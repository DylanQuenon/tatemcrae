import { motion } from "framer-motion";

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

    const marqueeItems = [...items, ...items];

    return (
        <div className="w-full overflow-hidden relative">
            <motion.div
                className="flex w-max items-center gap-8 max-md:text-2xl text-4xl font-bold text-white"
                animate={{
                    x: ["0%", "-50%"],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 45,
                        ease: "linear",
                    },
                }}
            >
                {marqueeItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-8 whitespace-nowrap"
                    >
                        <span
                            className={
                                index % 2 === 0
                                    ? "text-primary"
                                    : "text-transparent [-webkit-text-stroke:1px_white]"
                            }
                        >
                            {item}
                        </span>

                        <span>✦</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default HomeMarquee;