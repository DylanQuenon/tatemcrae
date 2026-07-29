import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SERVER_URL } from "../config";

const ImageLightbox = ({ items, currentIndex, onClose, onPrev, onNext }) => {
  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    // Lock page scroll completely
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, onClose, onPrev, onNext]);

  if (currentIndex === null || !items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const getImageUrl = (item) => {
    if (!item?.image?.contentUrl) return "";
    const path = item.image.contentUrl;
    return path.startsWith("http") ? path : `${SERVER_URL}${path}`;
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] w-full h-full bg-black/90 backdrop-blur-md flex flex-col justify-between items-center p-4 md:p-6 overflow-hidden select-none"
      onClick={onClose}
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between shrink-0">
        <span className="text-xs font-mono text-white/60 tracking-wider">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image View */}
      <div 
        className="relative w-full max-w-3xl flex-1 flex items-center justify-center min-h-0 my-2 px-10 md:px-14"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-0 text-white/70 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center min-h-0">
          <img
            src={getImageUrl(currentItem)}
            alt={currentItem.name || "Gallery preview"}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-0 text-white/70 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-10"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Caption */}
      <div 
        className="text-center shrink-0 flex flex-col gap-0.5" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold uppercase text-white tracking-wide">
          {currentItem.name}
        </h3>
        {currentItem.publishedAt && (
          <p className="text-[10px] uppercase text-white/50 font-mono">
            {new Date(currentItem.publishedAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImageLightbox;