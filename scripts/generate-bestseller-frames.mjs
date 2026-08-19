import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const ROOT = path.resolve(import.meta.dirname, "..");
const FPS = 60;
const QUALITY = 72;
const FORCE = process.argv.includes("--force");
const MOTION_INTERPOLATION =
    `minterpolate=fps=${FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`;

if (!ffmpegPath) {
    throw new Error("ffmpeg-static did not provide an FFmpeg executable.");
}

const sequences = [
    {
        name: "desktop",
        prefix: "bestseller-desktop",
        input: path.join(ROOT, "public", "new best sellers desktop.mp4"),
        output: path.join(ROOT, "src", "assets", "bestseller-frames", "desktop"),
        width: 1280,
        height: 720,
    },
    {
        name: "mobile",
        prefix: "bestseller-mobile",
        input: path.join(ROOT, "public", "new bestseller mobile.mp4"),
        output: path.join(ROOT, "src", "assets", "bestseller-frames", "mobile"),
        width: 540,
        height: 960,
    },
];

const run = (args, { allowFailure = false } = {}) =>
    new Promise((resolve, reject) => {
        const process = spawn(ffmpegPath, args, {
            cwd: ROOT,
            stdio: ["ignore", "inherit", "pipe"],
        });
        let stderr = "";

        process.stderr.on("data", (chunk) => {
            const text = chunk.toString();
            stderr += text;
            if (!args.includes("-loglevel") || args[args.indexOf("-loglevel") + 1] !== "error") {
                globalThis.process.stderr.write(text);
            }
        });
        process.on("error", reject);
        process.on("close", (code) => {
            if (code === 0 || allowFailure) {
                resolve(stderr);
                return;
            }
            reject(new Error(`FFmpeg exited with code ${code}.\n${stderr}`));
        });
    });

const probeVideo = async (input) => {
    const stderr = await run([
        "-hide_banner",
        "-i",
        input,
        "-map",
        "0:v:0",
        "-frames:v",
        "1",
        "-f",
        "null",
        "-",
    ]);
    const durationMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    const videoMatch = stderr.match(/Video:.*?(\d{2,5})x(\d{2,5}).*?(\d+(?:\.\d+)?) fps/);
    if (!durationMatch || !videoMatch) {
        throw new Error(`Could not read video metadata from ${input}.`);
    }

    const duration =
        Number(durationMatch[1]) * 3600 +
        Number(durationMatch[2]) * 60 +
        Number(durationMatch[3]);

    return {
        duration,
        sourceWidth: Number(videoMatch[1]),
        sourceHeight: Number(videoMatch[2]),
        sourceFps: Number(videoMatch[3]),
    };
};

for (const sequence of sequences) {
    const metadata = await probeVideo(sequence.input);
    const frameCount = Math.round(metadata.duration * FPS);
    const existingFrames = await fs
        .readdir(sequence.output)
        .catch(() => []);

    if (!FORCE && existingFrames.filter((name) => name.endsWith(".webp")).length === frameCount) {
        console.log(`${sequence.name}: ${frameCount} existing ${FPS} fps frames found; skipping`);
        continue;
    }

    const temporaryOutput = path.join(
        ROOT,
        "tmp",
        "bestseller-frame-output",
        sequence.name,
    );
    await fs.rm(temporaryOutput, { recursive: true, force: true });
    await fs.mkdir(temporaryOutput, { recursive: true });

    console.log(
        `${sequence.name}: ${metadata.sourceWidth}x${metadata.sourceHeight} at ${metadata.sourceFps} fps -> ` +
        `${sequence.width}x${sequence.height} at ${FPS} fps (${frameCount} frames)`,
    );

    const filter = [
        `scale=${sequence.width}:${sequence.height}:flags=lanczos`,
        // Give the motion interpolator enough trailing material to preserve
        // every frame through the exact source duration.
        "tpad=stop_mode=clone:stop_duration=0.1",
        MOTION_INTERPOLATION,
        // minterpolate starts after its look-behind window. Rebase that first
        // synthesized frame to t=0 so supplied product cues remain exact.
        "setpts=PTS-STARTPTS",
        `trim=duration=${metadata.duration}`,
    ].join(",");
    const outputPattern = path.join(
        temporaryOutput,
        `${sequence.prefix}-%04d.webp`,
    );

    await run([
        "-hide_banner",
        "-loglevel",
        "error",
        "-stats",
        "-i",
        sequence.input,
        "-vf",
        filter,
        "-an",
        "-c:v",
        "libwebp",
        "-quality",
        String(QUALITY),
        "-compression_level",
        "4",
        "-fps_mode",
        "passthrough",
        "-start_number",
        "0",
        "-y",
        outputPattern,
    ]);

    let generatedFrames = (await fs.readdir(temporaryOutput))
        .filter((name) => name.endsWith(".webp"))
        .sort((left, right) => left.localeCompare(right));

    // FFmpeg's motion interpolator can finish a few frames before the
    // container duration because it needs future frames for motion vectors.
    // Preserve the full 60 fps timeline by holding the final rendered frame.
    const trailingFrameGap = frameCount - generatedFrames.length;
    if (trailingFrameGap > 0 && trailingFrameGap <= Math.ceil(FPS * 0.1)) {
        const lastFrame = path.join(
            temporaryOutput,
            generatedFrames[generatedFrames.length - 1],
        );
        for (let index = generatedFrames.length; index < frameCount; index += 1) {
            const outputName = `${sequence.prefix}-${String(index).padStart(4, "0")}.webp`;
            await fs.copyFile(lastFrame, path.join(temporaryOutput, outputName));
            generatedFrames.push(outputName);
        }
        console.log(
            `${sequence.name}: held the final image for ${trailingFrameGap} trailing frames`,
        );
    }

    if (generatedFrames.length !== frameCount) {
        throw new Error(
            `${sequence.name}: expected ${frameCount} frames, generated ${generatedFrames.length}.`,
        );
    }

    await fs.rm(sequence.output, { recursive: true, force: true });
    await fs.mkdir(path.dirname(sequence.output), { recursive: true });
    await fs.rename(temporaryOutput, sequence.output);
    console.log(`${sequence.name}: generated ${generatedFrames.length}/${frameCount} frames`);
}
