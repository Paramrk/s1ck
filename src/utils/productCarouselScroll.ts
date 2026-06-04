/** Snap + hold timing so each product locks until the next scroll input. */
export const getProductCarouselTiming = (itemCount: number, isMobile: boolean) => {
    const transDur = isMobile ? 0.32 : 0.28;
    const holdDur = isMobile ? 0.92 : 0.82;
    const stepSlot = transDur + holdDur;
    const scrollPerStep = isMobile ? 400 : 340;
    const scrollLength =
        itemCount > 1 ? (itemCount - 1) * scrollPerStep + (isMobile ? 220 : 180) : 0;
    const totalDuration = itemCount > 1 ? holdDur + (itemCount - 1) * stepSlot : 0;

    const transStart = (index: number) => holdDur + (index - 1) * stepSlot;

    const snap =
        itemCount > 1
            ? ({
                  snapTo: "labels" as const,
                  duration: { min: 0.22, max: 0.5 },
                  delay: 0.08,
                  ease: "power2.inOut" as const,
                  directional: false,
                  inertia: false,
              } as const)
            : undefined;

    return { transDur, holdDur, stepSlot, scrollLength, totalDuration, transStart, snap };
};
