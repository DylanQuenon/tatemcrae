import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useMousePosition from "../../../hooks/useMousePosition";
import tourBackground from "../../../assets/images/tourbackground.jpg";

const HomeTour = () => {

    const navigate = useNavigate();

    // Controls the reveal effect visibility
    const [hover, setHover] = useState(false);

    // Tracks mouse position relative to the interactive area
    const { position, handleMouseMove } = useMousePosition();


    return (
        <div className="w-full h-screen flex overflow-hidden">

            <div className="bg-secondary w-1/2" />


            {/* Interactive image reveal section */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => navigate("/gallery?tag=concert")}
                className="
                    relative
                    w-1/2
                    max-md:w-full
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
                        blur-md
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