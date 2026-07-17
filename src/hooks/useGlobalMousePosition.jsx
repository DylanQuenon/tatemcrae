import { useState, useEffect } from "react";

const useGlobalMousePosition = () => {

    // Store the current mouse position on the entire page
    const [position, setPosition] = useState({ x: -100, y: -100 });

    // Detect if the mouse is hovering an interactive element
    const [isHoveringLink, setIsHoveringLink] = useState(false);


    useEffect(() => {

        // Update the cursor position whenever the mouse moves
        const handleMouseMove = (e) => {
            setPosition({
                x: e.clientX,
                y: e.clientY,
            });
        };


        // Check if the mouse is over a link, button, or clickable element
        const handleMouseOver = (e) => {

            if (
                e.target.closest("a") ||
                e.target.closest("button") ||
                e.target.style.cursor === "pointer"
            ) {
                setIsHoveringLink(true);
            } else {
                setIsHoveringLink(false);
            }

        };


        // Listen for mouse movements and hover changes globally
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);


        // Clean up event listeners when the component is unmounted
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };

    }, []);


    return {
        position,
        isHoveringLink,
    };
};

export default useGlobalMousePosition;