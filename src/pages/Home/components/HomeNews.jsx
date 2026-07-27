import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../../../config";
import newsAPI from "../../../services/newsAPI";
import { toast } from "react-toastify";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomeNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ref for 6th card (lyrics animation)
  const sixthCardRef = useRef(null);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const data = await newsAPI.findAll();

      const sortedData = (data || []).sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setNews(sortedData);
    } catch (error) {
      toast.error("Unable to load news");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // GSAP ScrollTrigger: Animate lyrics from gray to white on scroll
  useEffect(() => {
    if (isLoading || !sixthCardRef.current) return;

    const ctx = gsap.context(() => {
      // Words color fade animation
      gsap.fromTo(
        sixthCardRef.current.querySelectorAll(".word"),
        {
          color: "#4b5563",
          opacity: 0.2,
        },
        {
          scrollTrigger: {
            trigger: sixthCardRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 1,
          },
          color: "#ffffff",
          opacity: 1,
          stagger: 0.1,
          ease: "none",
        }
      );

      // Bottom neon line scale animation
      gsap.fromTo(
        sixthCardRef.current.querySelector(".neon-line"),
        { scaleX: 0, transformOrigin: "left" },
        {
          scrollTrigger: {
            trigger: sixthCardRef.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: 1,
          },
          scaleX: 1,
        }
      );
    }, sixthCardRef);

    return () => ctx.revert();
  }, [isLoading]);

  // Split string into word spans for GSAP target selector
  const renderSplitText = (text) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="word inline-block mr-[0.25em]">
        {word}
      </span>
    ));
  };

  const quotePart1 = "Say you wanna know me, you don't wanna know me. You just wanna do what I do";
  const quotePart2 = "I'm still waitin' at the green light. To tell you what I feel like, but I can't go";

  return (
    <div className="min-h-screen w-full bg-secondary bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px] text-primary py-24">
      <div className="relative w-full max-w-7xl mx-auto max-lg:px-4 max-md:px-6 z-10">
        
        {/* Header Section */}
        <div className="flex justify-between max-lg:gap-5 flex-wrap">
          <h2 className="text-5xl max-lg:text-4xl max-md:text-3xl uppercase italic leading-none bg-tertiary bg-clip-text text-transparent">
            What's New?
          </h2>
          <div className="lg:w-[35%] flex flex-col gap-5 max-md:items-start items-end">
            <p className="font-unison lg:text-right">
              Stay updated with the latest Tate McRae news, from appearances and releases to major career moments.
            </p>
            <Link
              to="/news"
              className="flex gap-1 items-center py-2 px-4 border border-primary rounded-full text-xs uppercase tracking-wider hover:bg-primary hover:text-secondary transition-colors"
            >
              Watch Now 
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* News Grid */}
        {!isLoading ? (
          <div className="grid grid-cols-3 gap-6 mt-12 max-md:grid-cols-2 max-sm:grid-cols-1">
            {/* Top 5 News Articles */}
            {news.slice(0, 5).map((article, index) => {
              const imageUrl = article.cover?.contentUrl
                ? article.cover.contentUrl.startsWith("http")
                  ? article.cover.contentUrl
                  : `${SERVER_URL}${article.cover.contentUrl}`
                : null;

              const formattedDate = article.publishedAt || article.createdAt
                ? new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                  })
                : null;

              return (
                <Link
                  to={`/news/${article.slug}`}
                  key={article.slug || index}
                  className="group relative flex flex-col justify-between h-115 w-full border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-primary/60"
                >
                  {/* Background Image & Overlay */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={article.title?.replace(/<[^>]*>?/gm, '') || "News image"}
                        className="w-full h-full object-cover object-center grayscale-[50%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <span className="text-xs font-mono uppercase text-white/30">No Media</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-secondary/40 group-hover:bg-secondary/30 transition-all duration-500" />
                  </div>

                  {/* Top-to-Bottom Gradient Overlay: Couvre 65% de la carte jusqu'en bas */}
                  <div className="absolute inset-x-0 bottom-0 h-[65%] z-5 bg-gradient-to-t from-secondary via-secondary/90 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none" />

                  {/* Card Index & Date */}
                  <div className="relative z-10 p-6 flex justify-between items-start font-mono text-[11px] tracking-widest text-white/50">
                    <span className="text-primary font-bold">0{index + 1}</span>
                    {formattedDate && <span>{formattedDate}</span>}
                  </div>

                  {/* Hover Action Badge */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <div className="w-20 h-20 rounded-full bg-primary text-secondary flex items-center justify-center gap-1 font-bold text-[10px] uppercase tracking-widest shadow-2xl opacity-0 scale-50 rotate-45 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 transition-all duration-500 ease-out">
                      <span>See</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card Bottom Content */}
                  <div className="relative z-10 p-6 space-y-2">
                    {article.subtitle && (
                      <div
                        className="text-xs uppercase tracking-[0.15em] text-primary font-medium block line-clamp-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out [&>*]:inline [&>*]:m-0"
                        dangerouslySetInnerHTML={{ __html: article.subtitle }}
                      />
                    )}

                    <div
                      className="text-xl font-bold uppercase italic leading-tight text-white group-hover:text-primary transition-colors duration-300 line-clamp-2 *:inline *:m-0"
                      dangerouslySetInnerHTML={{ __html: article.title }}
                    />

                    {/* Bottom Accent Line */}
                    <div className="w-full h-0.5 bg-white/10 overflow-hidden mt-4">
                      <div className="w-full h-full bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* 6th Card: Animated Lyrics */}
            <div
              ref={sixthCardRef}
              className="relative flex flex-col justify-between h-115 w-full border border-white/10 bg-black/40 backdrop-blur-md p-8 overflow-hidden group hover:border-primary/40 transition-all duration-500"
            >
              <div className="font-mono text-[11px] tracking-widest text-white/30">
                <span className="text-primary font-bold">06</span>
              </div>

              <div className="my-auto space-y-6">
                <p className="text-2xl max-md:text-xl uppercase italic font-bold leading-snug text-gray-600">
                  {renderSplitText(`"${quotePart1}"`)}
                </p>

                <p className="text-lg max-md:text-base text-end uppercase italic font-medium leading-normal text-gray-600">
                  {renderSplitText(quotePart2)}
                </p>
              </div>

              {/* Scroll animated bottom line */}
              <div className="w-full h-0.5 bg-white/10 overflow-hidden">
                <div className="neon-line w-full h-full bg-primary" />
              </div>
            </div>
          </div>
        ) : (
          /* Skeleton Loading Grid */
          <div className="grid grid-cols-3 gap-6 mt-12 max-md:grid-cols-2 max-sm:grid-cols-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-115 w-full border border-white/5 bg-white/2 animate-pulse p-6 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-4 bg-white/10" />
                  <div className="w-20 h-4 bg-white/10" />
                </div>
                <div className="space-y-3">
                  <div className="w-1/2 h-3 bg-white/10" />
                  <div className="w-full h-8 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HomeNews;