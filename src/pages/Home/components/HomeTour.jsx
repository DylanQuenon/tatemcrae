import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useMousePosition from "../../../hooks/useMousePosition";
import tourBackground from "../../../assets/images/tourbackground.jpg";
import concertsAPI from "../../../services/concertsAPI";
import { toast } from "react-toastify";
import SkeletonConcerts from "../../../components/loaders/SkeletonConcerts";

const HomeTour = () => {
    const navigate = useNavigate();

    // Controls the reveal effect visibility
    const [hover, setHover] = useState(false);

    // Stores Ticketmaster events
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tracks mouse position relative to the interactive area
    const { position, handleMouseMove } = useMousePosition();
    
    useEffect(() => {
        const fetchConcerts = async () => {
            try{
                const data = await concertsAPI.findAll()
                setConcerts(data)
                setLoading(false)
            }catch
            {
                // notif à faire
                toast.error("Impossible de charger les clients")
                //console.error(error.response)
            }
        }
        fetchConcerts();
    }, []);


    return (
        <div className="w-full min-h-screen flex flex-wrap overflow-hidden">
            {/* Left Column - Tour Dates & Details */}
            <div className="bg-secondary w-1/2 pt-24 max-lg:pt-16 max-md:w-full max-md:pt-20 flex flex-col gap-8 max-md:gap-6">

                {/* Section Header & Title */}
                <div className="relative w-full max-w-xl flex flex-col gap-5 mx-auto max-lg:px-6 max-md:px-6 z-10">
                    <span className="w-fit px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs max-md:text-[10px] uppercase tracking-[0.35em] text-primary">
                        Upcoming Events
                    </span>

                    <h2 className="text-5xl max-lg:text-4xl max-md:text-3xl font-medium uppercase italic leading-none bg-tertiary bg-clip-text text-transparent">
                        Tate In Concert
                    </h2>
                </div>

                {/* Tour Dates List Container */}
                {!loading ? (
                    <div className="flex flex-col md:flex-1">
                        {concerts && concerts.length > 0 ? (
                            <>
                                {/* List of Up to 5 Concerts */}
                                <div className="flex flex-col">
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
                                                    backgroundColor: "#ffffff",
                                                    color: "#051E40",
                                                },
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="group relative px-6 py-6 max-lg:px-4 max-md:px-4 max-md:py-5 border-y border-primary/20 overflow-hidden"
                                        >
                                            <motion.div
                                                layout
                                                transition={{
                                                    layout: {
                                                        duration: 0.45,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    },
                                                }}
                                                className="flex max-md:flex-col max-md:items-start md:items-center w-full gap-4 max-md:gap-3"
                                            >
                                                {/* Date */}
                                                <motion.div
                                                    layout
                                                    className="w-24 max-lg:w-20 max-md:w-full shrink-0"
                                                >
                                                    <span className="text-xs max-lg:text-[11px] max-md:text-[10px] text-nowrap uppercase tracking-[0.25em] max-md:tracking-[0.15em]">
                                                        {concert.date
                                                            ? new Date(
                                                                concert.date + "T00:00:00"
                                                                ).toLocaleDateString("en-US", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                })
                                                            : "Date TBA"}
                                                    </span>
                                                </motion.div>

                                                {/* Name + City & Venue */}
                                                <motion.div
                                                    layout
                                                    className="flex-1 min-w-0 px-8 max-lg:px-0 text-left w-full"
                                                >
                                                    <p className="text-lg max-lg:text-base max-md:text-sm uppercase font-medium truncate">
                                                        {concert.name || "Concert name TBA"}
                                                    </p>

                                                    <p className="text-sm max-lg:text-xs max-md:text-[10px] opacity-70 truncate">
                                                        {concert.city || "City TBA"} —{" "}
                                                        {concert.venue || "Venue TBA"}
                                                    </p>
                                                </motion.div>

                                                {/* Get Tickets */}
                                                <motion.div
                                                    layout
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
                                                    className="overflow-hidden shrink-0 text-right max-md:hidden"
                                                >
                                                    <span className="whitespace-nowrap uppercase text-xs max-lg:text-[10px] tracking-[0.3em] font-medium">
                                                        Get Tickets →
                                                    </span>
                                                </motion.div>

                                                {/* Mobile Get Tickets (Always visible, no hover needed on touch devices) */}
                                                <div className="hidden max-md:flex w-full justify-between items-center">
                                                    <span className="whitespace-nowrap uppercase text-[10px] tracking-[0.15em] font-medium">
                                                        Get Tickets →
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </motion.a>
                                    ))}
                                </div>

                                {/* See Full Tour Dates */}
                                <motion.a
                                    href="https://www.ticketmaster.com/tate-mcrae-tickets/artist/2720246"
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
                                            backgroundColor: "#ffffff",
                                            color: "#051E42",
                                        },
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="group relative w-full py-6 max-md:py-5 h-full overflow-hidden flex items-center justify-center cursor-pointer mt-8"
                                >
                                    {/* Default State */}
                                    <div className="group-hover:hidden w-full text-center px-6">
                                        <span className="uppercase text-xs max-md:text-[11px] font-medium tracking-wider">
                                            See full tour dates
                                        </span>
                                    </div>

                                    {/* Hover Marquee */}
                                    <div className="hidden group-hover:flex overflow-hidden whitespace-nowrap w-full">
                                        <motion.div
                                            className="flex gap-12 whitespace-nowrap shrink-0"
                                            animate={{ x: ["0%", "-50%"] }}
                                            transition={{
                                                repeat: Infinity,
                                                ease: "linear",
                                                duration: 8,
                                            }}
                                        >
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <span
                                                    key={i}
                                                    className="uppercase text-xs max-md:text-[11px] font-bold flex items-center gap-12"
                                                >
                                                    <span>See full tour dates</span>
                                                    <span className="text-xs">✦</span>
                                                </span>
                                            ))}
                                        </motion.div>
                                    </div>
                                </motion.a>
                            </>
                        ) : (
                            <div className="md:py-12 text-primary text-center my-auto">
                                <p className="text-lg max-md:text-base">
                                    No upcoming concerts
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <SkeletonConcerts count={5} />
                )}
            </div>

            {/* Right Column - Interactive Image Reveal Section */}
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
                    min-h-screen
                    overflow-hidden
                    cursor-none
                    custom-cursor-hide
                "
            >
                {/* Base background image */}
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

                {/* Revealed image layer */}
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

                {/* Interactive custom floating cursor */}
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
                        w-45
                        h-45
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