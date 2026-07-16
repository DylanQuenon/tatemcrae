import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Navbar from "../components/Navbar/Navbar";

const PublicLayout = () => {
    const location = useLocation();
    const currentOutlet = useOutlet();

    return (
        <div className="min-h-screen bg-secondary font-unison overflow-hidden">
            <Navbar />

            <main className="relative">
                <AnimatePresence mode="wait">
                    {currentOutlet && (
                        <motion.div
                            key={location.pathname}
                            initial={{
                                opacity: 0,
                                y: -80,
                                rotate: -10,
                                scale: 0.8,
                                filter: "blur(12px)",
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                rotate: 0,
                                scale: 1,
                                filter: "blur(0px)",
                            }}
                            exit={{
                                opacity: 0,
                                y: 80,
                                filter: "blur(12px)",
                                rotate: 10,
                                scale: 0.8,
                            }}
                            transition={{
                                duration: 0.85,
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
    );
};

export default PublicLayout;