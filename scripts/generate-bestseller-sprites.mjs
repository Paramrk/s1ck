import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const framesPerSheet = 6;
const sequences = [
    {
        name: "desktop",
        input: path.join(root, "src", "assets", "bestseller-frames", "desktop"),
        output: path.join(root, "src", "assets", "bestseller-sprites", "desktop"),
        prefix: "bestseller-sprite-desktop",
        frameWidth: 1280,
        frameHeight: 720,
    },
    {
        name: "mobile",
        input: path.join(root, "src", "assets", "bestseller-frames", "mobile"),
        output: path.join(root, "src", "assets", "bestseller-sprites", "mobile"),
        prefix: "bestseller-sprite-mobile",
        frameWidth: 540,
        frameHeight: 960,
    },
];

for (const sequence of sequences) {
    await fs.mkdir(sequence.output, { recursive: true });
    const frames = (await fs.readdir(sequence.input))
        .filter((name) => name.endsWith(".webp"))
        .sort((left, right) => left.localeCompare(right));
    const sheetCount = Math.ceil(frames.length / framesPerSheet);

    for (let sheetIndex = 0; sheetIndex < sheetCount; sheetIndex += 1) {
        const sheetFrames = frames.slice(
            sheetIndex * framesPerSheet,
            (sheetIndex + 1) * framesPerSheet,
        );
        const composite = sheetFrames.map((name, index) => ({
            input: path.join(sequence.input, name),
            left: index * sequence.frameWidth,
            top: 0,
        }));
        const outputName = `${sequence.prefix}-${String(sheetIndex).padStart(3, "0")}.webp`;

        await sharp({
            create: {
                width: sequence.frameWidth * framesPerSheet,
                height: sequence.frameHeight,
                channels: 3,
                background: "#050505",
            },
        })
            .composite(composite)
            .webp({ quality: 45, alphaQuality: 90, smartSubsample: true, effort: 6 })
            .toFile(path.join(sequence.output, outputName));
    }

    console.log(`${sequence.name}: ${frames.length} frames -> ${sheetCount} sprite sheets`);
}
