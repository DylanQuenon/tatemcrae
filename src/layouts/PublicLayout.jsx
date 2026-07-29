import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import CustomCursor from "../components/CustomCursor";
import InitialLoader from "../components/loaders/InitialLoader";
import Footer from "../components/footer/Footer";


const PublicLayout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();

  // Gestion de l'état du chargement
  const [isLoading, setIsLoading] = useState(() => {
    // Si déjà vu dans la session actuelle, ne pas réafficher lors des clics internes
    return !sessionStorage.getItem("hasLoadedTateMcRae");
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLoaderComplete = () => {
    sessionStorage.setItem("hasLoadedTateMcRae", "true");
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <InitialLoader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      
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
          <Footer/>
        </div>
      </div>
    </>
  );
};

export default PublicLayout;