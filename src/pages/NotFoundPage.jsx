import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "TATE MCRAE | 404 NOT FOUND";
  }, []);

  return (
    <main
      className="
        w-full
        min-h-screen
        bg-secondary
        text-primary
        flex
        items-center
        justify-center
        p-6
        font-['Unison_Pro',sans-serif]
        relative
        bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]
        bg-[size:24px_24px]
      "
    >
      <section className="max-w-2xl w-full border border-primary/20 bg-secondary/80 backdrop-blur-xs p-8 md:p-12 flex flex-col items-center text-center gap-8 relative overflow-hidden">
        
        {/* Badges / Fil d'ariane */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 border border-primary/30 rounded-full bg-primary/5">
            ERROR 404
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary/50">
            // PAGE NOT FOUND
          </span>
        </div>

        {/* Titres */}
        <div className="flex flex-col gap-2">
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-primary">
            404
          </h1>

          <p className="text-lg md:text-2xl font-black uppercase tracking-wide text-primary/90">
            IT’S OK, YOU’RE OK.
          </p>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-primary/70 uppercase leading-relaxed max-w-md">
          THE PAGE YOU ARE LOOKING FOR WAS MOVED, REMOVED, OR NEVER EXISTED IN THIS DIMENSION.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4 border-t border-primary/10">
          <Link
            to="/"
            className="
              w-full
              sm:w-auto
              inline-flex
              items-center
              justify-center
              gap-3
              text-xs
              uppercase
              font-bold
              bg-primary
              text-secondary
              px-8
              py-4
              border
              border-primary
              hover:bg-transparent
              hover:text-primary
              transition-all
              duration-300
            "
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </Link>

          <Link
            to="/news"
            className="
              w-full
              sm:w-auto
              inline-flex
              items-center
              justify-center
              text-xs
              uppercase
              font-bold
              border
              border-primary/40
              px-8
              py-4
              hover:border-primary
              hover:bg-primary/5
              transition-all
              duration-300
            "
          >
            LATEST NEWS
          </Link>
        </div>

        {/* Filigrane arrière-plan */}
        <div className="absolute -bottom-10 -right-10 text-primary/[0.03] text-9xl font-black select-none pointer-events-none">
          TATE
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;