import { useEffect, useState } from "react";

type TickingClockProps = {
    size?: number;
    className?: string;
    /** How many clock-seconds pass per real second (higher = faster hands). */
    speed?: number;
};

/** ~2.5s per second-hand revolution — reads as "time flying" for long-lasting. */
const DEFAULT_SPEED = 24;

/** Degrees per clock-second — shared rotation rate for all hands. */
const DEG_PER_CLOCK_SEC = 6;

const TickingClock = ({ size = 180, className = "", speed = DEFAULT_SPEED }: TickingClockProps) => {
    const [angles, setAngles] = useState({ hourDeg: 0, minuteDeg: 0, secondDeg: 0 });

    useEffect(() => {
        const start = performance.now();
        let rafId = 0;

        const animate = (now: number) => {
            const elapsedSec = ((now - start) / 1000) * speed;
            const seconds = elapsedSec % 60;
            const rotation = seconds * DEG_PER_CLOCK_SEC;

            setAngles({
                secondDeg: rotation,
                minuteDeg: -rotation,
                hourDeg: rotation + 120,
            });

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [speed]);

    const { hourDeg, minuteDeg, secondDeg } = angles;

    return (
        <div
            className={`relative shrink-0 ${className}`}
            style={{ width: size, height: size }}
            aria-hidden
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                <circle
                    cx="50"
                    cy="50"
                    r="47"
                    fill="#ffffff"
                    stroke="rgba(17,17,17,0.08)"
                    strokeWidth="1"
                />

                {Array.from({ length: 60 }).map((_, i) => {
                    const isMajor = i % 5 === 0;
                    const angle = (i * 6 - 90) * (Math.PI / 180);
                    const innerR = isMajor ? 38 : 41;
                    const outerR = 44;
                    return (
                        <line
                            key={i}
                            x1={50 + Math.cos(angle) * innerR}
                            y1={50 + Math.sin(angle) * innerR}
                            x2={50 + Math.cos(angle) * outerR}
                            y2={50 + Math.sin(angle) * outerR}
                            stroke={isMajor ? "#DC2626" : "rgba(17,17,17,0.18)"}
                            strokeWidth={isMajor ? 1.6 : 0.8}
                            strokeLinecap="round"
                        />
                    );
                })}

                <g style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: "50px 50px" }}>
                    <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="30"
                        stroke="#1a1a1a"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                    />
                </g>

                <g style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: "50px 50px" }}>
                    <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="22"
                        stroke="#1a1a1a"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>

                <g style={{ transform: `rotate(${secondDeg}deg)`, transformOrigin: "50px 50px" }}>
                    <line
                        x1="50"
                        y1="54"
                        x2="50"
                        y2="18"
                        stroke="#DC2626"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                </g>

                <circle cx="50" cy="50" r="2.8" fill="#DC2626" />
                <circle cx="50" cy="50" r="1.2" fill="#ffffff" />
            </svg>
        </div>
    );
};

export default TickingClock;
