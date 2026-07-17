import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useMousePosition from "../../../hooks/useMousePosition";
import tourBackground from "../../../assets/images/tourbackground.jpg";
import { getConcerts } from "../../../services/ticketmasterAPI";

const HomeTour = () => {
    const navigate = useNavigate();

    // Controls the reveal effect visibility
    const [hover, setHover] = useState(false);

    // Stores Ticketmaster events
    const [concerts, setConcerts] = useState([]);

    // Tracks mouse position relative to the interactive area
    const { position, handleMouseMove } = useMousePosition();

    useEffect(() => {
        const fetchConcerts = async () => {
            const data = await getConcerts("Tate McRae");
            setConcerts(data);
        };

        fetchConcerts();
    }, []);

    return (
        <div className="w-full h-screen flex flex-wrap overflow-hidden">
            <div className="bg-secondary w-1/2 py-24 max-md:w-full flex flex-col justify-center">
                {/* Title */}
                <div className="relative w-full max-w-xl flex flex-col gap-5 mx-auto max-lg:px-4 max-md:px-6 z-10">
                    <span className="w-fit px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs uppercase tracking-[0.35em] text-primary">
                        Upcoming Events
                    </span>

                    <h2 className="text-5xl max-lg:text-4xl font-medium uppercase italic leading-none bg-tertiary bg-clip-text text-transparent">
                        Tate In Concert
                    </h2>
                </div>

                {/* Tour dates */}
                <div className="mt-16 flex flex-col">
                    {concerts.slice(0, 5).map((concert) => (
                       <motion.a
    key={concert.id}
    href={concert.url}
    target="_blank"
    rel="noreferrer"
    initial="rest"
    whileHover="hover"
    animate="rest"
    variants={{
        rest: {
            backgroundColor: "transparent",
            color: "#ffffff",
        },
        hover: {
            backgroundColor: "#7899C8",
            color: "#051E42",
        },
    }}
    transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
    }}
    className="group relative px-6 py-6 border-y border-primary/20 overflow-hidden"
>
    <motion.div
        layout
        transition={{
            layout: {
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
            },
        }}
        className="flex items-center w-full"
    >
        {/* Date */}
        <motion.div
            layout
            className="w-24 shrink-0"
        >
            <span className="text-sm uppercase tracking-[0.25em]">
                {new Date(concert.dates?.start?.localDate).toLocaleDateString(
                    "en-US",
                    {
                        day: "2-digit",
                        month: "short",
                    }
                )}
            </span>
        </motion.div>

        {/* Nom + Ville */}
        <motion.div
            layout
            className="flex-1 text-center min-w-0 px-8"
        >
            <p className="text-lg uppercase font-medium truncate">
                {concert.name}
            </p>

            <p className="text-sm opacity-70 truncate">
                {concert._embedded?.venues?.[0]?.city?.name}
            </p>
        </motion.div>

        {/* Get Tickets */}
        <motion.div
            variants={{
                rest: {
                    width: 0,
                    opacity: 0,
                    x: 30,
                },
                hover: {
                    width: 150,
                    opacity: 1,
                    x: 0,
                },
            }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden shrink-0 text-right"
        >
            <span className="whitespace-nowrap uppercase text-xs tracking-[0.3em] font-medium">
                Get Tickets →
            </span>
        </motion.div>
    </motion.div>
</motion.a>
                    ))}
                </div>
            </div>

            {/* Interactive image reveal section */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => navigate("/gallery?tag=concert")}
                className="
                    relative
                    w-1/2
                    max-md:hidden
                    select-none
                    h-full
                    overflow-hidden
                    cursor-none
                    custom-cursor-hide
                "
            >
                {/* Base image always visible behind the reveal effect */}
                <img
                    src={tourBackground}
                    alt="Concert"
                    className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                    "
                />

                {/* Second image revealed around the cursor using a radial mask */}
                <motion.img
                    src={tourBackground}
                    alt=""
                    animate={{
                        opacity: hover ? 1 : 0,
                    }}
                    transition={{
                        duration: 0.7,
                        ease: "easeOut",
                    }}
                    style={{
                        maskImage: `
                            radial-gradient(
                                circle 100px at ${position.x}px ${position.y}px,
                                transparent 0%,
                                transparent 55%,
                                rgba(0,0,0,0.35) 75%,
                                black 100%
                            )
                        `,
                        WebkitMaskImage: `
                            radial-gradient(
                                circle 100px at ${position.x}px ${position.y}px,
                                transparent 0%,
                                transparent 55%,
                                rgba(0,0,0,0.35) 75%,
                                black 100%
                            )
                        `,
                    }}
                    className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        blur-lg
                        brightness-75
                    "
                />

                {/* Custom cursor displayed only inside this section */}
                <motion.div
                    animate={{
                        x: position.x - 90,
                        y: position.y - 90,
                        scale: hover ? 1 : 0.85,
                        opacity: hover ? 1 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 25,
                        mass: 0.6,
                    }}
                    className="
                        absolute
                        w-[180px]
                        h-[180px]
                        rounded-full
                        border
                        border-white/80
                        bg-black/10
                        flex
                        items-center
                        justify-center
                        text-white
                        uppercase
                        text-xs
                        tracking-[0.3em]
                        text-center
                        pointer-events-none
                        z-20
                        shadow-[0_0_40px_rgba(255,255,255,0.2)]
                    "
                >
                    <div className="leading-relaxed">
                        <span className="block text-[10px] opacity-70">
                            View
                        </span>
                        <span className="block text-[15px] font-medium">
                            Concert
                        </span>
                        <span className="block text-[10px] opacity-70">
                            Gallery
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HomeTour;