import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react"; // 1. Importer useEffect
import Navbar from "../components/Navbar/Navbar";
import CustomCursor from "../components/CustomCursor";

const PublicLayout = () => {
    const location = useLocation();
    const currentOutlet = useOutlet();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <div className="md:cursor-none">
                <CustomCursor />
                <div className="min-h-screen bg-secondary font-unison overflow-x-clip">
                    <Navbar />

                    <main className="relative">
                        <AnimatePresence mode="wait">
                            {currentOutlet && (
                                <motion.div
                                    key={location.pathname}
                                    initial={{
                                        opacity: 0,
                                        y: -100,
                                        filter: "blur(10px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: 100,
                                        filter: "blur(10px)",
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.76, 0, 0.24, 1],
                                    }}
                                >
                                    {React.cloneElement(currentOutlet, {
                                        key: location.pathname,
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </>
    );
};

export default PublicLayout;