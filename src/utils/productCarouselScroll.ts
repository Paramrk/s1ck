export type CarouselSegment =
    | {
          kind: "transition";
          start: number;
          end: number;
          fromTime: number;
          toTime: number;
          productIndex: number;
      }
    | {
          kind: "hold";
          start: number;
          end: number;
          time: number;
          productIndex: number;
      };

/** Smooth transition + hold timing so bottle animation plays continuously while scrolling */
export const getProductCarouselTiming = (itemCount: number, isMobile: boolean) => {
    const transDur = isMobile ? 0.95 : 1.2;
    const holdDur = isMobile ? 0.45 : 0.5;
    const stepSlot = transDur + holdDur;
    // More scroll distance per step keeps the target playhead from jumping too far per wheel tick.
    const scrollPerStep = isMobile ? 920 : 1180;
    const scrollLength =
        itemCount > 1 ? (itemCount - 1) * scrollPerStep + (isMobile ? 520 : 640) : 0;
    const totalDuration = itemCount > 1 ? holdDur + (itemCount - 1) * stepSlot : 0;

    const transStart = (index: number) => holdDur + (index - 1) * stepSlot;

    const snap =
        itemCount > 1
            ? ({
                  snapTo: "labels" as const,
                  duration: { min: 0.25, max: 0.55 },
                  delay: 0.22,
                  ease: "power2.out" as const,
                  directional: false,
                  inertia: false,
              } as const)
            : undefined;

    return { transDur, holdDur, stepSlot, scrollLength, totalDuration, transStart, snap };
};

export const buildCarouselSegments = (
    cueTimes: readonly number[],
    transDur: number,
    holdDur: number,
    startTime = 0,
) => {
    let transitionAt = 0;
    const segments: CarouselSegment[] = [];

    for (let index = 0; index < cueTimes.length; index += 1) {
        const settledAt = transitionAt + transDur;
        const fromTime = index === 0 ? startTime : cueTimes[index - 1];

        segments.push({
            kind: "transition",
            start: transitionAt,
            end: settledAt,
            fromTime,
            toTime: cueTimes[index],
            productIndex: index,
        });

        if (index < cueTimes.length - 1) {
            segments.push({
                kind: "hold",
                start: settledAt,
                end: settledAt + holdDur,
                time: cueTimes[index],
                productIndex: index,
            });
            transitionAt = settledAt + holdDur;
        }
    }

    const totalDuration = transitionAt + transDur;
    return { segments, totalDuration };
};

export const getPlayheadAtProgress = (
    progress: number,
    segments: CarouselSegment[],
    totalDuration: number,
) => {
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const timelineTime = clampedProgress * totalDuration;

    for (const segment of segments) {
        if (timelineTime < segment.start || timelineTime > segment.end) continue;

        if (segment.kind === "hold") {
            return segment.time;
        }

        const segmentProgress =
            segment.end === segment.start
                ? 1
                : (timelineTime - segment.start) / (segment.end - segment.start);

        return segment.fromTime + (segment.toTime - segment.fromTime) * segmentProgress;
    }

    const lastCue = segments
        .filter((segment): segment is Extract<CarouselSegment, { kind: "transition" }> =>
            segment.kind === "transition",
        )
        .at(-1);

    return lastCue?.toTime ?? 0;
};

export const getProgressForProduct = (
    productIndex: number,
    segments: CarouselSegment[],
    totalDuration: number,
) => {
    if (totalDuration <= 0) return 0;

    const hold = segments.find(
        (segment) => segment.kind === "hold" && segment.productIndex === productIndex,
    );
    if (hold) return hold.start / totalDuration;

    const transition = segments.find(
        (segment) => segment.kind === "transition" && segment.productIndex === productIndex,
    );
    return transition ? transition.end / totalDuration : 0;
};

/** Active product card stays visible from its cue until the next product takes over. */
export const getSettledProductIndex = (
    playheadTime: number,
    cueTimes: readonly number[],
) => {
    let index = 0;
    for (let i = 0; i < cueTimes.length; i += 1) {
        if (playheadTime >= cueTimes[i] - 0.02) {
            index = i;
        }
    }
    return index;
};

export const getActiveProductIndex = (
    playheadTime: number,
    cueTimes: readonly number[],
) => {
    if (cueTimes.length === 0 || playheadTime < cueTimes[0] - 0.04) {
        return -1;
    }

    return getSettledProductIndex(playheadTime, cueTimes);
};

export const getMaxProgressForPlayhead = (
    playheadTime: number,
    segments: CarouselSegment[],
    totalDuration: number,
) => {
    if (totalDuration <= 0) return 0;

    const finalTransition = segments
        .filter((segment): segment is Extract<CarouselSegment, { kind: "transition" }> =>
            segment.kind === "transition",
        )
        .at(-1);

    if (finalTransition && playheadTime >= finalTransition.toTime - 0.001) {
        return 1;
    }

    for (const segment of segments) {
        if (segment.kind === "transition") {
            const from = segment.fromTime;
            const to = segment.toTime;
            const minTime = Math.min(from, to);
            const maxTime = Math.max(from, to);

            if (playheadTime < minTime - 0.001 || playheadTime > maxTime + 0.001) {
                continue;
            }

            const span = to - from;
            const local = span === 0 ? 1 : (playheadTime - from) / span;
            const timelineTime = segment.start + local * (segment.end - segment.start);
            return Math.min(1, timelineTime / totalDuration);
        }

        if (segment.kind === "hold" && Math.abs(playheadTime - segment.time) <= 0.04) {
            return segment.end / totalDuration;
        }
    }

    const firstTransition = segments.find(
        (segment): segment is Extract<CarouselSegment, { kind: "transition" }> =>
            segment.kind === "transition",
    );

    if (firstTransition && playheadTime <= firstTransition.toTime) {
        const span = firstTransition.toTime - firstTransition.fromTime;
        const local = span === 0
            ? 0
            : Math.max(0, (playheadTime - firstTransition.fromTime) / span);
        const timelineTime = firstTransition.start + local * (firstTransition.end - firstTransition.start);
        return Math.min(1, timelineTime / totalDuration);
    }

    return 0;
};

export const snapPlayheadToFrame = (seconds: number, frameRate = 60) =>
    Math.round(seconds * frameRate) / frameRate;
