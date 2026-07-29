
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { SiInstagram, SiX, SiTiktok, SiFacebook } from "react-icons/si";

import newsAPI from "../../services/newsAPI";
import { SERVER_URL } from "../../config";

const NewsDetailPage = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      setIsLoading(true);

      try {
        const data = await newsAPI.findBySlug(slug);
        setArticle(data);

        const allNews = await newsAPI.findAll();

        setRelatedArticles(
          allNews
            .filter((item) => item.slug !== slug)
            .slice(0, 3)
        );
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Unable to load news");
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  useEffect(() => {
    document.title = article?.title
      ? `Tate McRae | ${article.title}`
      : "TATE MCRAE | NEWS";
  }, [article]);

  const getImageUrl = (item) => {
    if (!item) return null;

    const imagePath =
      item.cover?.contentUrl ||
      item.newsCover?.contentUrl ||
      item.image?.contentUrl;

    if (imagePath) {
      return imagePath.startsWith("http")
        ? imagePath
        : `${SERVER_URL}${imagePath}`;
    }

    return item.imageUrl || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString)
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-secondary text-primary flex items-center justify-center font-['Unison_Pro',sans-serif]">
        <p className="text-xs uppercase opacity-60 animate-pulse">
          LOADING ARTICLE...
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-screen bg-secondary text-primary flex flex-col items-center justify-center gap-6 font-['Unison_Pro',sans-serif]">
        <p className="text-xs uppercase opacity-60">
          ARTICLE NOT FOUND
        </p>

        <Link
          to="/news"
          className="
            text-xs
            uppercase
            border
            border-primary/40
            px-6
            py-3
            hover:bg-primary
            hover:text-secondary
            transition-all
          "
        >
          BACK TO NEWS
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(article);

  return (
    <main
      className="
        w-full
        min-h-screen
        bg-secondary
        text-primary
        py-24
        font-['Unison_Pro',sans-serif]
        relative
        bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[60px_60px]
      "
    >
      <section className="max-w-7xl mx-auto border border-primary/20 bg-secondary/80 backdrop-blur-xs">

        {/* Back navigation */}
        <div className="p-4 md:p-6 border-b border-primary/20">
          <Link
            to="/news"
            className="
              inline-flex
              items-center
              gap-3
              text-xs
              uppercase
              font-bold
              text-primary/80
              hover:text-primary
              transition-colors
            "
          >
            <div className="w-7 h-7 rounded-full border border-primary/60 flex items-center justify-center">
              <ArrowLeft size={14} />
            </div>

            BACK TO NEWS
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-primary/20 items-start">

          {/* Main article */}
          <div className="lg:col-span-8 p-6 md:p-10 flex flex-col gap-8">

            <div className="flex flex-col gap-3">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-tight">
                {article.title}
              </h1>

              <span className="text-xs text-primary/60">
                {formatDate(article.publishedAt)}
              </span>
            </div>

            {imageUrl && (
              <div className="w-full rounded-2xl overflow-hidden border border-primary/10">
                <img
                  className="w-full h-auto object-cover"
                  src={imageUrl}
                  alt={article.title}
                />
              </div>
            )}

            {article.subtitle && (
              <p className="text-xs md:text-sm font-bold uppercase text-primary/90 leading-relaxed border-b border-primary/10 pb-4">
                {article.subtitle}
              </p>
            )}

            {article.content && (
              <div
                className="
                  text-xs
                  md:text-sm
                  text-primary/80
                  leading-relaxed
                  uppercase

                  [&_p]:mb-6
                  [&_p]:leading-relaxed

                  [&_h1]:text-base
                  [&_h1]:font-black
                  [&_h1]:uppercase
                  [&_h1]:mt-8
                  [&_h1]:mb-4
                  [&_h1]:text-primary

                  [&_h2]:text-sm
                  [&_h2]:font-bold
                  [&_h2]:uppercase
                  [&_h2]:mt-8
                  [&_h2]:mb-3
                  [&_h2]:text-primary

                  [&_h3]:text-xs
                  [&_h3]:font-bold
                  [&_h3]:uppercase
                  [&_h3]:mt-6
                  [&_h3]:mb-2
                  [&_h3]:text-primary

                  [&_ul]:list-disc
                  [&_ul]:pl-5
                  [&_ul]:mb-6
                  [&_ul]:space-y-2

                  [&_ol]:list-decimal
                  [&_ol]:pl-5
                  [&_ol]:mb-6
                  [&_ol]:space-y-2

                  [&_li]:mb-2

                  [&_a]:text-primary
                  [&_a]:underline
                  [&_a]:underline-offset-4
                  hover:[&_a]:text-primary/70

                  [&_blockquote]:border-l-2
                  [&_blockquote]:border-primary
                  [&_blockquote]:pl-4
                  [&_blockquote]:my-6
                  [&_blockquote]:italic
                  [&_blockquote]:text-primary/70

                  [&_img]:rounded-xl
                  [&_img]:my-6
                  [&_img]:w-full
                  [&_img]:object-cover

                  [&_strong]:font-bold
                  [&_strong]:text-primary
                "
                dangerouslySetInnerHTML={{
                  __html: article.content,
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-0 p-6 md:p-8 flex flex-col gap-10">

            {/* Social sharing */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase text-primary">
                SHARE TO
              </h3>

              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    w-10
                    h-10
                    rounded-full
                    border
                    border-primary/40
                    flex
                    items-center
                    justify-center
                    hover:bg-primary
                    hover:text-secondary
                    transition-all
                  "
                >
                  <SiInstagram size={16} />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    w-10
                    h-10
                    rounded-full
                    border
                    border-primary/40
                    flex
                    items-center
                    justify-center
                    hover:bg-primary
                    hover:text-secondary
                    transition-all
                  "
                >
                  <SiX size={15} />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    w-10
                    h-10
                    rounded-full
                    border
                    border-primary/40
                    flex
                    items-center
                    justify-center
                    hover:bg-primary
                    hover:text-secondary
                    transition-all
                  "
                >
                  <SiTiktok size={15} />
                </a>

                <a
                  href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    w-10
                    h-10
                    rounded-full
                    border
                    border-primary/40
                    flex
                    items-center
                    justify-center
                    hover:bg-primary
                    hover:text-secondary
                    transition-all
                  "
                >
                  <SiFacebook size={16} />
                </a>
              </div>
            </div>

            {/* Related articles */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase text-primary">
                RELATED ARTICLES
              </h3>

              <div className="flex flex-col gap-6">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((rel) => {
                    const relImage = getImageUrl(rel);

                    return (
                      <Link
                        key={rel.id || rel.slug}
                        to={`/news/${rel.slug}`}
                        className="
                          group
                          border
                          border-primary/20
                          rounded-xl
                          overflow-hidden
                          bg-primary/5
                          hover:border-primary
                          transition-all
                          flex
                          flex-col
                        "
                      >
                        {relImage && (
                          <div className="w-full h-44 overflow-hidden relative">
                            <img
                              src={relImage}
                              alt={rel.title}
                              className="
                                w-full
                                h-full
                                object-cover
                                group-hover:scale-105
                                transition-transform
                                duration-500
                              "
                            />
                          </div>
                        )}

                        <div className="p-4 flex flex-col gap-2">
                          <span className="text-[10px] text-primary/50">
                            {formatDate(rel.publishedAt)}
                          </span>

                          <h4 className="text-xs font-black uppercase leading-snug text-primary group-hover:underline">
                            {rel.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="border border-primary/20 rounded-xl overflow-hidden bg-primary/5 p-4 flex flex-col gap-3">
                    {imageUrl && (
                      <div className="w-full h-44 overflow-hidden rounded-lg">
                        <img
                          src={imageUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <span className="text-[10px] text-primary/50">
                      {formatDate(article.publishedAt)}
                    </span>

                    <h4 className="text-xs font-black uppercase leading-snug text-primary">
                      {article.title}
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewsDetailPage;

