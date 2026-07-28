import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CustomDropdown = ({
  value,
  options,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full sm:w-auto ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          group
          relative
          flex
          w-full
          sm:min-w-[150px]
          items-center
          justify-between
          gap-8
          px-4
          py-3
          border
          text-left
          text-[10px]
          uppercase
          tracking-[0.16em]
          outline-none
          transition-all
          duration-300
          ${
            isOpen
              ? "border-white/50 bg-white/[0.07]"
              : "border-white/15 bg-white/[0.02] hover:border-white/35 hover:bg-white/[0.04]"
          }
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }
        `}
      >
        <span
          className={`transition-colors duration-300 ${
            isOpen ? "text-white" : "text-white/65"
          }`}
        >
          {selectedOption.label}
        </span>

        <motion.span
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-white/40 text-[9px]"
        >
          ↓
        </motion.span>

        <motion.span
          initial={false}
          animate={{
            scaleX: isOpen ? 1 : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-white"
        />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              left-0
              top-[calc(100%+8px)]
              z-[100]
              w-full
              min-w-[170px]
              overflow-hidden
              border
              border-white/15
              bg-secondary/95
              backdrop-blur-xl
              shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            "
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {options.map((option, index) => {
                const isSelected = option.value === value;

                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{
                      opacity: 0,
                      x: -5,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.025,
                      duration: 0.2,
                    }}
                    onClick={() => handleSelect(option)}
                    className={`
                      group
                      relative
                      flex
                      w-full
                      items-center
                      justify-between
                      px-4
                      py-3
                      text-left
                      text-[10px]
                      uppercase
                      tracking-[0.15em]
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "bg-white/[0.08] text-white"
                          : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                      }
                    `}
                  >
                    <span>{option.label}</span>

                    {isSelected && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          scale: 0,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        className="text-[8px] text-white/70"
                      >
                        ●
                      </motion.span>
                    )}

                    <span
                      className={`
                        absolute
                        bottom-0
                        left-4
                        h-px
                        bg-white/20
                        transition-all
                        duration-300
                        ${
                          isSelected
                            ? "w-[calc(100%-2rem)]"
                            : "w-0 group-hover:w-[calc(100%-2rem)]"
                        }
                      `}
                    />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;