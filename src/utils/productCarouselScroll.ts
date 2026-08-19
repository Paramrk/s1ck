/** Smooth transition + hold timing so bottle animation plays continuously while scrolling */
export const getProductCarouselTiming = (itemCount: number, isMobile: boolean) => {
    const transDur = isMobile ? 0.95 : 1.2;
    const holdDur = isMobile ? 0.45 : 0.5;
    const stepSlot = transDur + holdDur;
    const scrollPerStep = isMobile ? 680 : 880;
    const scrollLength =
        itemCount > 1 ? (itemCount - 1) * scrollPerStep + (isMobile ? 400 : 500) : 0;
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
