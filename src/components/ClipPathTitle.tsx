
const ClipPathTitle = ({
    title,
    color,
    bg,
    className,
    borderColor
}: {
    title: string;
    color?: string;
    bg?: string;
    className?: string;
    borderColor?: string;
}) => {
    return (
        <div className="text-[clamp(1.75rem,5.6vw,5.75rem)] font-bold uppercase leading-[1.05] tracking-normal">
            <div
                style={{ clipPath: "polygon(50% 0%, 50% 0,50% 100%, 50% 100%)", borderColor: borderColor }}
                className={`${className} max-w-[96vw] border-[3px] text-nowrap opacity-0`}>
                <div className="md:pb-4 pb-3 md:px-10 px-3 md:pt-2 pt-3" style={{ backgroundColor: bg }}>
                    <h2 className="" style={{ color: color }}>{title}</h2>
                </div>
            </div>
        </div>
    )
}

export default ClipPathTitle
