import { useState } from "react";

const useMousePosition = () => {

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });


    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };


    return {
        position,
        handleMouseMove,
    };
};

export default useMousePosition;