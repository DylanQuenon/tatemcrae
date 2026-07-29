import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import galleriesAPI from "../../services/galleriesAPI";
import tagsAPI from "../../services/tagsAPI";
import { SERVER_URL } from "../../config";

import CustomDropdown from "../../components/CustomDropdown";
import PaginationFront from "../../components/PaginationFront";

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [tags, setTags] = useState([]);

  const [index, setIndex] = useState(-1);
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isTagsLoading, setIsTagsLoading] = useState(true);

  const [isChanging, setIsChanging] = useState(false);
  const [displayedGalleries, setDisplayedGalleries] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const itemsPerPage = 9; 

  // Détection du scroll dès 10px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);

      try {
        const data = await galleriesAPI.findAll();
        setGalleries(data || []);
      } catch (error) {
        console.error("Error fetching galleries:", error);
        toast.error("Unable to load gallery items.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      setIsTagsLoading(true);

      try {
        const data = await tagsAPI.findAll();
        setTags(data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Unable to load gallery tags.");
      } finally {
        setIsTagsLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    document.title = "Tate McRae | Gallery";
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString)
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const getImageUrl = (gallery) => {
    const imagePath = gallery.image?.contentUrl;

    if (!imagePath) return null;

    return imagePath.startsWith("http")
      ? imagePath
      : `${SERVER_URL}${imagePath}`;
  };

  const tagCounts = useMemo(() => {
    const counts = {};

    galleries.forEach((gallery) => {
      const galleryTags = Array.isArray(gallery.tag) ? gallery.tag : [];

      galleryTags.forEach((tag) => {
        const slug = tag.slug || tag.id;

        if (!slug) return;

        counts[slug] = (counts[slug] || 0) + 1;
      });
    });

    return counts;
  }, [galleries]);

  const filteredGalleries = useMemo(() => {
    const filtered = galleries.filter((gallery) => {
      if (selectedTag === "all") {
        return true;
      }

      const galleryTags = Array.isArray(gallery.tag) ? gallery.tag : [];

      return galleryTags.some(
        (tag) =>
          tag.slug === selectedTag ||
          String(tag.id) === String(selectedTag)
      );
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [galleries, selectedTag, sortOrder]);

  const maxPage = Math.ceil(filteredGalleries.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, maxPage);

  const paginatedGalleries = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return filteredGalleries.slice(start, end);
  }, [filteredGalleries, safeCurrentPage, itemsPerPage]);

  useEffect(() => {
    const startTransition = setTimeout(() => {
      setIsChanging(true);
    }, 0);

    const updateGalleries = setTimeout(() => {
      setDisplayedGalleries(paginatedGalleries);
      setIsChanging(false);
    }, 220);

    return () => {
      clearTimeout(startTransition);
      clearTimeout(updateGalleries);
    };
  }, [paginatedGalleries]);

  useEffect(() => {
    setIndex(-1);
  }, [selectedTag, sortOrder, safeCurrentPage]);

  const slides = useMemo(() => {
    return displayedGalleries.map((item) => ({
      src: getImageUrl(item),
      title: item.name || "UNTITLED FRAME",
      date: item.publishedAt ? formatDate(item.publishedAt) : "",
      caption: item.caption || item.description || "",
    }));
  }, [displayedGalleries]);

  const sortOptions = [
    { value: "desc", label: "Newest" },
    { value: "asc", label: "Oldest" },
  ];

  const handleTagChange = (slug) => {
    setSelectedTag(slug);
    setCurrentPage(1);
    setIndex(-1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
    setIndex(-1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIndex(-1);

    gridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const allCount = galleries.length;

  return (
    <div
      ref={sectionRef}
      className="w-full min-h-screen py-24 text-primary bg-secondary font-unison bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[60px_60px] relative flex flex-col justify-between"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">

        {/* Gallery header */}
        <div className="py-12 border-b border-primary/20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs uppercase text-primary/60 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>VISUAL VAULT // VOL. 01</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
              GALLERY
            </h2>
          </div>

          <p className="text-md text-right md:w-[50%] text-[#bebdbd]">
            Explore the gallery through curated tags and discover every side
            of Tate McRae’s world, one moment at a time.
          </p>
        </div>

        {/* Filters */}
        <div className="py-8 border-b border-primary/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/40">
              Sort by
            </span>

            <CustomDropdown
              value={sortOrder}
              options={sortOptions}
              onChange={handleSortChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-start lg:justify-end gap-x-6 gap-y-3 flex-wrap">
            <button
              type="button"
              onClick={() => handleTagChange("all")}
              className={`
                relative text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer
                ${selectedTag === "all" ? "text-white" : "text-white/35 hover:text-white/70"}
              `}
            >
              All
              <span className={`absolute -bottom-2 left-0 h-px bg-white transition-all duration-300 ${selectedTag === "all" ? "w-full" : "w-0"}`} />
              <span className="ml-1.5 text-[9px] text-current/50">{allCount}</span>
            </button>

            {!isTagsLoading &&
              tags.map((tag) => {
                const tagSlug = tag.slug || String(tag.id);
                const count = tagCounts[tagSlug] || 0;
                const isActive = selectedTag === tagSlug;

                return (
                  <button
                    key={tag.id || tagSlug}
                    type="button"
                    onClick={() => handleTagChange(tagSlug)}
                    className={`
                      relative text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer
                      ${isActive ? "text-white" : "text-white/35 hover:text-white/70"}
                    `}
                  >
                    {tag.name}
                    <span className={`ml-1.5 text-[9px] transition-colors duration-300 ${isActive ? "text-white/50" : "text-white/20"}`}>
                      {count}
                    </span>
                    <span className={`absolute -bottom-2 left-0 h-px bg-white transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
                  </button>
                );
              })}
          </div>
        </div>

        {/* Result count */}
        <div ref={gridRef} className="flex justify-between items-center pt-6 scroll-mt-28">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            {selectedTag === "all"
              ? "All photographs"
              : tags.find(
                  (tag) => (tag.slug || String(tag.id)) === selectedTag
                )?.name || "Filtered gallery"}
          </span>

          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            {isLoading ? (
              <span className="inline-block w-16 h-3 bg-white/10 rounded animate-pulse" />
            ) : (
              `${filteredGalleries.length} ${filteredGalleries.length === 1 ? "photo" : "photos"}`
            )}
          </span>
        </div>

        {/* Gallery grid */}
        <div
          className={`
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-8
            transition-all duration-300 ease-out
            ${isChanging && !isLoading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
          `}
        >
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />
            ))
          ) : displayedGalleries.length > 0 ? (
            displayedGalleries.map((gallery, i) => {
              const imageUrl = getImageUrl(gallery);

              return (
                <div
                  key={gallery.id || i}
                  onClick={() => imageUrl && setIndex(i)}
                  className="group relative overflow-hidden aspect-[4/5] cursor-pointer"
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={gallery.name || "Tate McRae gallery"}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
                    <h3 className="font-bold text-base uppercase text-primary leading-tight">
                      {gallery.name}
                    </h3>

                    {gallery.publishedAt && (
                      <span className="text-xs uppercase text-primary/60">
                        {formatDate(gallery.publishedAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-24 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                No photos found
              </p>
              <button
                type="button"
                onClick={() => handleTagChange("all")}
                className="mt-5 text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                View all photos
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && itemsPerPage < filteredGalleries.length && (
          <div className="relative z-30 mt-12 flex justify-center max-w-7xl mx-auto px-6">
            <PaginationFront
              currentPage={safeCurrentPage}
              itemsPerPage={itemsPerPage}
              length={filteredGalleries.length}
              onPageChanged={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* BOUTON BACK TO TOP EN MODE STICKY */}
      <aside className="sticky bottom-6 self-end mr-6 md:mr-10 z-40 h-0 flex items-center justify-end overflow-visible pointer-events-none">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`
            group flex items-center gap-2 px-3.5 py-2.5 md:px-4 md:py-3 rounded-full
            bg-secondary/90 border border-white/20 text-white text-[10px] uppercase tracking-[0.2em]
            backdrop-blur-md shadow-2xl -translate-y-full
            hover:bg-white hover:text-black hover:border-white
            transition-all duration-300 ease-out cursor-pointer
            ${
              showBackToTop
                ? "opacity-100 translate-x-0 pointer-events-auto scale-100"
                : "opacity-0 translate-x-4 pointer-events-none scale-90"
            }
          `}
        >
          <span>TOP</span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </aside>

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
        className="font-unison"
        render={{
          controls: () => {
            if (index < 0 || !slides[index]) return null;
            const currentSlide = slides[index];

            return (
              <>
                <div className="absolute top-6 left-6 z-50 text-white font-bold text-sm tracking-wider uppercase pointer-events-none">
                  {currentSlide.title}
                </div>

                <div className="absolute bottom-6 left-6 z-50 flex flex-col gap-1 max-w-md pointer-events-none">
                  {currentSlide.date && (
                    <span className="text-[11px] font-mono text-white/80 tracking-widest uppercase">
                      {currentSlide.date}
                    </span>
                  )}

                  {currentSlide.caption && (
                    <p className="text-xs text-white/60 font-mono tracking-wide leading-relaxed">
                      {currentSlide.caption}
                    </p>
                  )}
                </div>
              </>
            );
          },
        }}
      />
    </div>
  );
};

export default GalleryPage;