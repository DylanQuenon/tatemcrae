const HomeMarquee = () => {
    const items = [
        "TATE MCRAE",
        "MUSIC",
        "MOVEMENT",
        "EMOTION",
        "ENERGY",
        "POP",
        "PERFORMANCE",
        "THINK LATER",
        "SO CLOSE TO WHAT",
    ];

    return (
        <div className="w-full overflow-hidden relative">
            <div className="flex w-max animate-marquee items-center gap-8 max-md:text-2xl text-4xl font-bold text-white">
                {[...items, ...items, ...items].map((item, index) => (
                    <div key={index} className="flex items-center gap-8 whitespace-nowrap">
                        <span
                            className={
                                index % 2 === 0
                                    ? "text-primary"
                                    : "text-transparent [-webkit-text-stroke:1px_white]"
                            }
                        >{
                            item}
                        </span>
                        <span>✦</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeMarquee;