import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const FRAME_RATE = 60;
const FRAMES_PER_SHEET = 6;
const DESKTOP_DECODED_SHEETS = 12;
const MOBILE_DECODED_SHEETS = 14;
const DESKTOP_FRAME_COUNT = 662;
const MOBILE_FRAME_COUNT = 666;
const PRELOAD_CONCURRENCY = 5;

const desktopSpriteModules = import.meta.glob<{ default: string }>(
    "../assets/bestseller-sprites/desktop/*.webp",
    { eager: true },
);
const mobileSpriteModules = import.meta.glob<{ default: string }>(
    "../assets/bestseller-sprites/mobile/*.webp",
    { eager: true },
);

const urlsFromModules = (modules: Record<string, { default: string }>) =>
    Object.entries(modules)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([, module]) => module.default);

const DESKTOP_SPRITES = urlsFromModules(desktopSpriteModules);
const MOBILE_SPRITES = urlsFromModules(mobileSpriteModules);

export type BestsellerFrameSequenceHandle = {
    setTime: (seconds: number) => void;
};

type BestsellerFrameSequenceProps = {
    mobile: boolean;
    cueTimes: readonly number[];
    onPreloadProgress?: (progress: number) => void;
    onPreloadComplete?: () => void;
};

const BestsellerFrameSequence = forwardRef<
    BestsellerFrameSequenceHandle,
    BestsellerFrameSequenceProps
>(({ mobile, cueTimes, onPreloadProgress, onPreloadComplete }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const decodedRef = useRef(new Map<number, HTMLImageElement>());
    const loadingRef = useRef(new Map<number, Promise<HTMLImageElement | null>>());
    const requestedFrameRef = useRef(0);
    const previousFrameRef = useRef(0);
    const sequenceVersionRef = useRef(0);
    const preloadCallbacksRef = useRef({ onPreloadProgress, onPreloadComplete });

    const sprites = mobile ? MOBILE_SPRITES : DESKTOP_SPRITES;
    const frameCount = mobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
    const maxDecodedSheets = mobile ? MOBILE_DECODED_SHEETS : DESKTOP_DECODED_SHEETS;
    const forwardRunway = mobile ? 8 : 6;
    const dimensions = mobile
        ? { width: 540, height: 960 }
        : { width: 1280, height: 720 };

    preloadCallbacksRef.current = { onPreloadProgress, onPreloadComplete };

    const pruneDecodedSheets = () => {
        const requestedSheet = Math.floor(requestedFrameRef.current / FRAMES_PER_SHEET);

        while (decodedRef.current.size > maxDecodedSheets) {
            const farthestSheet = Array.from(decodedRef.current.keys()).reduce(
                (farthest, sheetIndex) =>
                    Math.abs(sheetIndex - requestedSheet) > Math.abs(farthest - requestedSheet)
                        ? sheetIndex
                        : farthest,
            );
            decodedRef.current.delete(farthestSheet);
        }
    };

    const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        const sheetIndex = Math.floor(index / FRAMES_PER_SHEET);
        const image = decodedRef.current.get(sheetIndex);
        if (!canvas || !image) return false;

        const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
        if (!context) return false;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        const sourceX = (index % FRAMES_PER_SHEET) * dimensions.width;
        context.drawImage(
            image,
            sourceX,
            0,
            dimensions.width,
            dimensions.height,
            0,
            0,
            canvas.width,
            canvas.height,
        );

        decodedRef.current.delete(sheetIndex);
        decodedRef.current.set(sheetIndex, image);
        return true;
    };

    const loadSheet = (sheetIndex: number, priority: "high" | "low" = "low") => {
        const safeIndex = Math.max(0, Math.min(sprites.length - 1, sheetIndex));
        const decoded = decodedRef.current.get(safeIndex);
        if (decoded) return Promise.resolve(decoded);
        const pending = loadingRef.current.get(safeIndex);
        if (pending) return pending;

        const version = sequenceVersionRef.current;

        const promise = new Promise<HTMLImageElement | null>((resolve) => {
            const image = new Image();
            image.decoding = "async";
            image.fetchPriority = priority;
            image.onload = async () => {
                try {
                    await image.decode();
                } catch {
                    // Loaded images remain drawable on browsers with partial decode support.
                }

                loadingRef.current.delete(safeIndex);
                if (sequenceVersionRef.current !== version) {
                    resolve(null);
                    return;
                }

                decodedRef.current.set(safeIndex, image);
                pruneDecodedSheets();

                if (Math.floor(requestedFrameRef.current / FRAMES_PER_SHEET) === safeIndex) {
                    drawFrame(requestedFrameRef.current);
                }
                resolve(image);
            };
            image.onerror = () => {
                loadingRef.current.delete(safeIndex);
                resolve(null);
            };
            image.src = sprites[safeIndex];
        });
        loadingRef.current.set(safeIndex, promise);
        return promise;
    };

    useImperativeHandle(ref, () => ({
        setTime(seconds: number) {
            const index = Math.max(
                0,
                Math.min(frameCount - 1, Math.round(seconds * FRAME_RATE)),
            );
            const sheetIndex = Math.floor(index / FRAMES_PER_SHEET);

            if (
                index === requestedFrameRef.current &&
                decodedRef.current.has(sheetIndex)
            ) {
                return;
            }

            const direction = index >= previousFrameRef.current ? 1 : -1;
            previousFrameRef.current = index;
            requestedFrameRef.current = index;

            drawFrame(index);
            void loadSheet(sheetIndex, "high");
            void loadSheet(sheetIndex + direction, "high");
            for (let offset = 2; offset <= forwardRunway; offset += 1) {
                void loadSheet(sheetIndex + direction * offset);
            }
            void loadSheet(sheetIndex - direction);
        },
    }), [sprites, frameCount, forwardRunway]);

    useEffect(() => {
        sequenceVersionRef.current += 1;
        decodedRef.current.clear();
        loadingRef.current.clear();
        requestedFrameRef.current = 0;
        previousFrameRef.current = 0;

        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
            if (context) {
                context.fillStyle = "#050505";
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        let cancelled = false;

        const preloadSequence = async () => {
            if (sprites.length === 0) {
                preloadCallbacksRef.current.onPreloadProgress?.(100);
                preloadCallbacksRef.current.onPreloadComplete?.();
                return;
            }

            const cueSheets = cueTimes.map((time) =>
                Math.floor(Math.round(time * FRAME_RATE) / FRAMES_PER_SHEET),
            );
            const priority = Array.from(new Set([
                0,
                1,
                2,
                ...cueSheets.flatMap((sheet) => [sheet - 1, sheet, sheet + 1]),
                ...sprites.map((_, index) => index),
            ])).filter((index) => index >= 0 && index < sprites.length);

            let completed = 0;
            const total = priority.length;
            const report = () => {
                if (cancelled) return;
                const progress = Math.min(100, Math.round((completed / total) * 100));
                preloadCallbacksRef.current.onPreloadProgress?.(progress);
            };

            report();
            void loadSheet(0, "high");

            let cursor = 0;
            const workers = Array.from({ length: PRELOAD_CONCURRENCY }, async () => {
                while (cursor < priority.length) {
                    if (cancelled) return;
                    const index = priority[cursor];
                    cursor += 1;

                    try {
                        await fetch(sprites[index], { cache: "force-cache" });
                    } catch {
                        // loadSheet remains available if fetch fails.
                    }

                    await loadSheet(index, index < 3 ? "high" : "low");
                    completed += 1;
                    report();
                }
            });

            await Promise.all(workers);

            if (!cancelled) {
                preloadCallbacksRef.current.onPreloadProgress?.(100);
                preloadCallbacksRef.current.onPreloadComplete?.();
                drawFrame(0);
            }
        };

        void preloadSequence();

        return () => {
            cancelled = true;
        };
    }, [sprites, cueTimes, dimensions.height, dimensions.width]);

    return (
        <div
            ref={stageRef}
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#050505]"
        >
            <canvas
                ref={canvasRef}
                role="img"
                aria-label="S1CK bestseller fragrance animation"
                className="h-full w-full select-none object-contain"
                style={{
                    transform: "translate3d(0,0,0)",
                    backfaceVisibility: "hidden",
                    contain: "layout paint",
                }}
            />
        </div>
    );
});

BestsellerFrameSequence.displayName = "BestsellerFrameSequence";

export default BestsellerFrameSequence;
