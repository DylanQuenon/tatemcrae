import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import backgroundNews from "../../assets/images/backgrounds/backgroundNews.webp";
import newsAPI from "../../services/newsAPI";
import { SERVER_URL } from "../../config";

import PaginationFront from "../../components/PaginationFront";
import CustomDropdown from "../../components/CustomDropdown";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isChanging, setIsChanging] = useState(false);
  const [displayedNews, setDisplayedNews] = useState([]);

  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const currentRotation = useRef(0);
  const targetRotation = useRef(0);

  const previousX = useRef(0);
  const animationFrame = useRef(null);

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);

      try {
        const data = await newsAPI.findAll();
        setNews(data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Unable to load news");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    document.title = "Tate McRae | News";
  }, []);

  useEffect(() => {
    const animate = () => {
      currentPos.current.x +=
        (targetPos.current.x - currentPos.current.x) * 0.1;

      currentPos.current.y +=
        (targetPos.current.y - currentPos.current.y) * 0.1;

      currentRotation.current +=
        (targetRotation.current - currentRotation.current) * 0.08;

      if (imageRef.current) {
        imageRef.current.style.transform = `
          translate3d(
            ${currentPos.current.x}px,
            ${currentPos.current.y}px,
            0
          )
          translate(-50%, -50%)
          rotate(${currentRotation.current}deg)
        `;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const availableYears = useMemo(() => {
    const years = news
      .map((article) => {
        const date = article.publishedAt || article.createdAt;

        if (!date) return null;

        return new Date(date).getFullYear();
      })
      .filter(Boolean);

    return [...new Set(years)].sort((a, b) => b - a);
  }, [news]);

  const filteredNews = useMemo(() => {
    if (!Array.isArray(news)) return [];

    return [...news]
      .filter((article) => {
        const date = article.publishedAt || article.createdAt;

        if (!date) return false;

        const articleDate = new Date(date);
        const year = articleDate.getFullYear();
        const month = articleDate.getMonth();

        const yearMatches =
          selectedYear === "all" ||
          year === Number(selectedYear);

        const monthMatches =
          selectedMonth === "all" ||
          month === Number(selectedMonth);

        return yearMatches && monthMatches;
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.publishedAt || a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.publishedAt || b.createdAt || 0
        ).getTime();

        return sortOrder === "asc"
          ? dateA - dateB
          : dateB - dateA;
      });
  }, [news, selectedYear, selectedMonth, sortOrder]);

  const maxPage =
    Math.ceil(filteredNews.length / itemsPerPage) || 1;

  const safeCurrentPage = Math.min(currentPage, maxPage);

  const paginatedNews = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return filteredNews.slice(start, end);
  }, [filteredNews, safeCurrentPage]);

  useEffect(() => {
    const startTransition = setTimeout(() => {
      setIsChanging(true);
    }, 0);

    const updateNews = setTimeout(() => {
      setDisplayedNews(paginatedNews);
      setIsChanging(false);
    }, 220);

    return () => {
      clearTimeout(startTransition);
      clearTimeout(updateNews);
    };
  }, [paginatedNews]);

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setCurrentPage(1);
    setActiveImage(null);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    setCurrentPage(1);
    setActiveImage(null);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
    setActiveImage(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setActiveImage(null);

    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getImageUrl = (item) => {
    const coverPath =
      item.cover?.contentUrl ||
      item.newsCover?.contentUrl ||
      item.image?.contentUrl;

    if (coverPath) {
      return coverPath.startsWith("http")
        ? coverPath
        : `${SERVER_URL}${coverPath}`;
    }

    return item.imageUrl || null;
  };

  const handleMouseEnter = (item, event) => {
    const imageUrl = getImageUrl(item);

    if (!imageUrl || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    targetPos.current = { x, y };
    currentPos.current = { x, y };

    previousX.current = event.clientX;

    targetRotation.current = 0;
    currentRotation.current = 0;

    setActiveImage(imageUrl);
  };

  const handleMouseMove = (event) => {
    if (!activeImage || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const velocity = event.clientX - previousX.current;

    previousX.current = event.clientX;

    targetPos.current = { x, y };

    targetRotation.current = Math.max(
      Math.min(velocity * 0.35, 10),
      -10
    );
  };

  const handleMouseLeave = () => {
    setActiveImage(null);
    targetRotation.current = 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasFilters =
    selectedYear !== "all" ||
    selectedMonth !== "all" ||
    sortOrder !== "desc";

  const resetFilters = () => {
    setSelectedYear("all");
    setSelectedMonth("all");
    setSortOrder("desc");
    setCurrentPage(1);
    setActiveImage(null);
  };

  const yearOptions = [
    {
      value: "all",
      label: "All years",
    },
    ...availableYears.map((year) => ({
      value: String(year),
      label: String(year),
    })),
  ];

  const monthOptions = [
    { value: "all", label: "All months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const sortOptions = [
    {
      value: "desc",
      label: "Newest first",
    },
    {
      value: "asc",
      label: "Oldest first",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-secondary text-primary bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[60px_60px]">
      {/* Hero */}
      <div
        className="relative w-full h-100 bg-primary bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundNews})`,
          backgroundPosition: "center 12%",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-secondary to-transparent pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 flex flex-col gap-7">
          <h2 className="text-5xl max-lg:text-4xl max-md:text-3xl uppercase italic leading-none bg-tertiary bg-clip-text text-transparent">
            News
          </h2>

          <p className="text-primary md:w-[55%] text-lg">
            Tate McRae captivates the Oscars spotlight, blending elegance,
            confidence, and undeniable rising global star power tonight
          </p>
        </div>
      </div>

      {/* News */}
      <section
        ref={sectionRef}
        className="relative py-20 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Filters */}
        <div className="mb-10 max-w-7xl mx-auto px-6 relative z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-unison tracking-[0.2em] uppercase text-white/40">
              Filter by
            </span>

            <CustomDropdown
              value={selectedYear}
              options={yearOptions}
              onChange={handleYearChange}
              disabled={isLoading}
            />

            <CustomDropdown
              value={selectedMonth}
              options={monthOptions}
              onChange={handleMonthChange}
              disabled={isLoading}
            />

            <CustomDropdown
              value={sortOrder}
              options={sortOptions}
              onChange={handleSortChange}
              disabled={isLoading}
            />

            {hasFilters && !isLoading && (
              <button
                type="button"
                onClick={resetFilters}
                className="group relative px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                Reset

                <span className="absolute bottom-2 left-4 h-px w-0 bg-white transition-all duration-300 group-hover:w-[calc(100%-2rem)]" />
              </button>
            )}
          </div>

          <span className="text-[10px] font-unison tracking-[0.2em] uppercase text-white/30">
            {isLoading ? (
              <span className="inline-block w-20 h-3 bg-white/10 rounded animate-pulse" />
            ) : (
              `${filteredNews.length} ${
                filteredNews.length === 1 ? "article" : "articles"
              }`
            )}
          </span>
        </div>

        {/* News list */}
        <div
          className={`
            relative
            z-20
            border-y
            border-white/15
            transition-all
            duration-300
            ease-out
            ${
              isChanging && !isLoading
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }
          `}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="min-h-42.5 md:min-h-47.5 border-b border-white/10 last:border-b-0 py-8 md:py-10 animate-pulse"
              >
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-8">
                  <div className="flex items-start gap-5 md:gap-8 w-full max-w-3xl">
                    <div className="h-4 w-6 bg-white/10 rounded shrink-0 mt-1" />

                    <div className="flex flex-col gap-3 w-full">
                      <div className="h-3 w-28 bg-white/10 rounded" />

                      <div className="h-8 md:h-12 w-3/4 bg-white/15 rounded" />

                      <div className="h-4 w-5/6 bg-white/10 rounded mt-1" />
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-4 shrink-0">
                    <div className="h-3 w-24 bg-white/10 rounded" />
                    <div className="h-4 w-4 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : displayedNews.length > 0 ? (
            displayedNews.map((item, index) => {
              const formattedDate = formatDate(
                item.publishedAt || item.createdAt
              );

              const globalIndex =
                (safeCurrentPage - 1) * itemsPerPage + index + 1;

              return (
                <Link
                  key={item.id || item.title}
                  to={`/news/${item.slug}`}
                  className="group relative block min-h-42.5 md:min-h-47.5 border-b border-white/10 last:border-b-0 cursor-pointer transition-colors duration-500 hover:bg-white/2.5"
                  onMouseEnter={(event) =>
                    handleMouseEnter(item, event)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="max-w-7xl mx-auto px-6 relative z-20 w-full flex items-center justify-between gap-8 py-8 md:py-10">
                    <div className="flex items-start gap-5 md:gap-8">
                      <span className="pt-1 text-[10px] md:text-xs font-unison tracking-widest text-white/30 uppercase shrink-0">
                        {String(globalIndex).padStart(2, "0")}
                      </span>

                      <div className="flex flex-col gap-2 max-w-3xl">
                        <span className="text-[10px] md:text-xs font-unison tracking-widest text-white/40 uppercase">
                          {formattedDate}
                        </span>

                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase leading-[0.95] text-white transition-transform duration-500 ease-out group-hover:translate-x-4">
                          {item.title}
                        </h3>

                        {item.subcontent && (
                          <p className="max-w-2xl text-sm text-white/55 line-clamp-2 mt-1">
                            {item.subcontent}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative shrink-0 hidden md:flex items-center gap-4 text-xs font-unison uppercase tracking-widest text-white/50 transition-colors duration-300 group-hover:text-white">
                      <span>Read Article</span>

                      <span className="text-lg transition-transform duration-500 group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-24 text-center max-w-7xl mx-auto px-6">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                No news found
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Floating preview */}
        <div
          ref={imageRef}
          className={`
            pointer-events-none
            absolute
            top-0
            left-0
            z-10
            w-70
            md:w-90
            lg:w-100
            aspect-16/10
            overflow-hidden
            bg-black
            transition-all
            duration-300
            ease-out
            ${
              activeImage && !isLoading
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }
          `}
          style={{
            willChange: "transform",
          }}
        >
          {activeImage && !isLoading && (
            <img
              key={activeImage}
              src={activeImage}
              alt="News preview"
              className="w-full h-full object-cover pointer-events-none animate-[fadeIn_0.25s_ease-out]"
            />
          )}
        </div>

        {/* Pagination */}
        {!isLoading && itemsPerPage < filteredNews.length && (
          <div className="relative z-30 mt-12 flex justify-center max-w-7xl mx-auto px-6">
            <PaginationFront
              currentPage={safeCurrentPage}
              itemsPerPage={itemsPerPage}
              length={filteredNews.length}
              onPageChanged={handlePageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsPage;