import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CircleDot,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { toast } from "react-toastify";

import "swiper/css";

import { SERVER_URL } from "../../../config";
import galleriesAPI from "../../../services/galleriesAPI";

const HomeGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);

  // References for custom Swiper navigation buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  
  useEffect(() => {
      const fetchGallery = async () => {
        try {
          setIsLoading(true);
    
          const data = await galleriesAPI.findAll();
    
          // Sort items by date descending and take the 10 most recent
          const latestTen = (data || [])
            .sort((a, b) => {
              const dateA = new Date(
                a.publishedAt || a.createdAt || 0
              ).getTime();
    
              const dateB = new Date(
                b.publishedAt || b.createdAt || 0
              ).getTime();
    
              return dateB - dateA;
            })
            .slice(0, 10);
    
          setGallery(latestTen);
        } catch (error) {
            console.error("Error fetching gallery items:", error);
            toast.error("Unable to load pictures");
        } finally {
            setIsLoading(false);
        }
      };
      fetchGallery();
  }, []);

  return (
    <div className="w-full bg-secondary bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[60px_60px] text-primary py-10 max-md:py-12 overflow-hidden">
      {/* Aligns left margin dynamically with the site container grid */}
      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 pl-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pr-0">
        {/* Section info / Copywriting */}
        <div className="w-full lg:w-95 xl:w-105 shrink-0 pr-6 lg:pr-0">
          <div className="flex flex-col gap-8">
            
            <div className="flex items-center gap-2.5 w-fit px-4 py-2 text-sm border border-primary rounded-full">
              <CircleDot className="w-3.5 h-3.5" />
              <span>Gallery</span>
            </div>

            <h2 className="text-3xl uppercase leading-[1.3] text-white">
              A vision made for you through{" "}
              <span className="font-bold text-transparent bg-tertiary bg-clip-text">
                Tate's eyes
              </span>
            </h2>

            <p className="text-xs font-unison leading-relaxed tracking-widest uppercase text-white/60">
              Step into a carefully curated visual journey where every
              moment captures the emotion, movement, and authenticity behind
              Tate McRae's music, offering a deeper connection to her world
              and artistic vision.
            </p>

            <div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 pb-1 text-xs font-unison tracking-widest uppercase text-white transition-colors border-b border-primary hover:text-primary"
              >
                View All (
                {gallery.length < 10
                  ? `0${gallery.length}`
                  : gallery.length}
                )
              </Link>
            </div>

          </div>
        </div>

        {/* Swiper Carousel */}
        <div className="w-full lg:flex-1 min-w-0">

          {!isLoading ? (
            <div className="flex flex-col gap-10">
              <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView={1.1}
                loop={gallery.length > 2}
                breakpoints={{
                  640: { slidesPerView: 1.8 },
                  1024: { slidesPerView: 2.2 },
                  1280: { slidesPerView: 2.5 },
                }}
                onInit={(swiper) => {
                  // Bind custom navigation buttons on Swiper init
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                onSlideChange={(swiper) => {
                  // Track realIndex to keep exact slide count during infinite loop
                  setCurrentIndex(swiper.realIndex + 1);
                }}
                className="w-full"
              >
                {gallery.map((item, index) => {
                  // Resolve image path (absolute URL vs relative server path)
                  const imageUrl = item.image?.contentUrl
                    ? item.image.contentUrl.startsWith("http")
                      ? item.image.contentUrl
                      : `${SERVER_URL}${item.image.contentUrl}`
                    : item.imageUrl || null;

                  return (
                    <SwiperSlide key={item.id || index}>
                      <div className="flex flex-col space-y-3">
                        <div className="font-unison text-xs tracking-widest text-white/50">
                          #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </div>

                        <div className="relative w-full h-120 overflow-hidden border border-white/10 bg-black/40 transition-all duration-500 group hover:border-primary/60">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                item.name?.replace(/<[^>]*>?/gm, "") ||
                                "Gallery image"
                              }
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-white/5">
                              <span className="text-xs font-unison uppercase text-white/30">
                                No Media
                              </span>
                            </div>
                          )}

                          {/* Hover details overlay */}
                          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-linear-to-t from-black/95 via-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            {item.name && (
                              <h3
                                className="text-lg font-bold uppercase italic text-white line-clamp-1"
                                dangerouslySetInnerHTML={{
                                  __html: item.name,
                                }}
                              />
                            )}

                            {item.caption && (
                              <p
                                className="mt-1 text-xs font-unison tracking-wider uppercase text-white/70 line-clamp-2"
                                dangerouslySetInnerHTML={{
                                  __html: item.caption,
                                }}
                              />
                            )}

                            {item.shootingUrl && (
                              <a
                                href={item.shootingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-4 text-xs font-unison tracking-widest uppercase text-primary hover:underline"
                              >
                                See Full Shooting
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4
                            className="text-sm font-bold tracking-wide uppercase text-white line-clamp-1"
                            dangerouslySetInnerHTML={{
                              __html: item.name || "Unnamed",
                            }}
                          />
                          {item.caption && (
                            <p
                              className="text-[11px] font-unison tracking-widest uppercase text-white/50 line-clamp-1"
                              dangerouslySetInnerHTML={{
                                __html: item.caption,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Slider controls & counter */}
              <div className="flex items-center justify-between pr-6 lg:pr-16">
                <div className="font-unison text-4xl tracking-widest text-white">
                  {currentIndex < 10 ? `0${currentIndex}` : currentIndex}
                  <span className="font-normal text-white/30">
                    /
                    {gallery.length < 10
                      ? `0${gallery.length}`
                      : gallery.length}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    ref={prevRef}
                    className="p-3 text-white transition-colors border border-white/20 rounded-full hover:border-primary hover:text-primary active:scale-95"
                    aria-label="Previous slide"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    ref={nextRef}
                    className="p-3 text-white transition-colors border border-white/20 rounded-full hover:border-primary hover:text-primary active:scale-95"
                    aria-label="Next slide"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Skeleton loading placeholder */
            <div className="flex gap-6 overflow-hidden">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between min-w-95 h-130 p-4 border border-white/5 bg-white/2 animate-pulse"
                >
                  <div className="w-8 h-4 bg-white/10" />
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 bg-white/10" />
                    <div className="w-1/2 h-3 bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default HomeGallery;