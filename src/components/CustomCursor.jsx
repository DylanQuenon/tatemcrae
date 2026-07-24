import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useGlobalMousePosition from "../hooks/useGlobalMousePosition";

const CustomCursor = () => {

    const { position, isHoveringLink } = useGlobalMousePosition();

    // Hide the custom cursor on specific elements
    const [isHidden, setIsHidden] = useState(false);

    // Track mouse click state
    const [isClicking, setIsClicking] = useState(false);



    useEffect(() => {

        // Check continuously if the cursor is inside a hidden area
        // Using mousemove avoids issues when holding the mouse button
        const handleMouseMove = (e) => {

            if (e.target.closest(".custom-cursor-hide")) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

        };


        // Trigger click animation when mouse button is pressed
        const handleMouseDown = () => {
            setIsClicking(true);
        };


        // Reset click animation when mouse button is released
        const handleMouseUp = () => {
            setIsClicking(false);
        };


        // Reset click state if mouse leaves the window while clicking
        const handleMouseLeave = () => {
            setIsClicking(false);
        };


        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseleave", handleMouseLeave);


        // Remove listeners when component is unmounted
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };

    }, []);



    return (
        <>

            {/* DOT - Main cursor point */}
            <motion.div
                animate={{
                    // Center the dot on the mouse position
                    x: position.x - 5,
                    y: position.y - 5,

                    // Cursor reactions
                    scale: isHidden
                        ? 0
                        : isClicking
                            ? 0.7
                            : isHoveringLink
                                ? 1.4
                                : 1,

                    opacity: isHidden ? 0 : 1,
                }}

                // Fast animation for a precise cursor feeling
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.2,
                }}

                className="
                    fixed
                    top-0
                    left-0
                    max-md:hidden
                    w-[10px]
                    h-[10px]
                    bg-primary
                    rounded-full
                    pointer-events-none
                    z-[9999]
                "
            />


            {/* RING - Delayed cursor trail */}
            <motion.div
                animate={{
                    // Center the ring on the mouse position
                    x: position.x - 24,
                    y: position.y - 24,

                    // Cursor reactions
                    scale: isHidden
                        ? 0
                        : isClicking
                            ? 1.8
                            : isHoveringLink
                                ? 1.3
                                : 1,

                    opacity: isHidden
                        ? 0
                        : isClicking
                            ? 0.5
                            : 1,
                }}

                // Slower spring creates the smooth trailing effect
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                    mass: 1.8,
                }}

                className="
                    fixed
                    top-0
                    left-0
                    max-md:hidden
                    w-[48px]
                    h-[48px]
                    border
                    border-primary
                    rounded-full
                    pointer-events-none
                    z-[9998]
                "
            />

        </>
    );
};

export default CustomCursor;