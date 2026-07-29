import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = [
  "TATE MCRAE",
  "IT'S OK I'M OK",
  "THINK LATER",
  "SO CLOSE TO WHAT",
  "WORLD TOUR",
  "LOADING...",
];

const InitialLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
   
        const increment = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + increment, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Defilement rapide des mots
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 300);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between p-6 md:p-12 bg-secondary text-primary font-['Unison_Pro',sans-serif] bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] select-none pointer-events-auto"
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      {/* Top Header info */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/70">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          OFFICIAL PLATFORM
        </span>
        <span>© TATE MCRAE</span>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center my-auto gap-4 relative">
        <AnimatePresence mode="wait">
          <motion.h1
            key={wordIndex}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.2 }}
            className="text-3xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-center"
          >
            {WORDS[wordIndex]}
          </motion.h1>
        </AnimatePresence>

        <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-primary/50 font-bold">
          INITIALIZING SOUND & VISUAL EXPERIENCE
        </p>
      </div>

      {/* Bottom Progress Bar & Percentage */}
      <div className="flex flex-col gap-4 border-t border-primary/20 pt-6">
        <div className="flex items-end justify-between font-black uppercase">
          <span className="text-xs text-primary/60 tracking-wider">
            SYSTEM READY
          </span>
          <span className="text-5xl md:text-7xl tracking-tighter">
            {progress}%
          </span>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-2 border border-primary/30 p-[2px] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default InitialLoader;