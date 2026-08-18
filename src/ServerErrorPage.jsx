import { useEffect } from "react";
import { Link, useRouteError } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

const ServerErrorPage = () => {
  const error = useRouteError();

  useEffect(() => {
    document.title = "TATE MCRAE | 500 SERVER ERROR";
    if (error) {
      console.error("Route Error:", error);
    }
  }, [error]);

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
            ERROR 500
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary/50">
            // INTERNAL SERVER ERROR
          </span>
        </div>

        {/* Titres */}
        <div className="flex flex-col gap-2">
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-primary">
            500
          </h1>

          <p className="text-lg md:text-2xl font-black uppercase tracking-wide text-primary/90">
            SOMETHING WENT WRONG.
          </p>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-primary/70 uppercase leading-relaxed max-w-md">
          WE ENCOUNTERED AN UNEXPECTED SYSTEM FAILURE. OUR TEAM HAS BEEN NOTIFIED AND IS WORKING ON IT.
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

          <button
            onClick={() => window.location.reload()}
            className="
              w-full
              sm:w-auto
              inline-flex
              items-center
              justify-center
              gap-2
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
              cursor-pointer
            "
          >
            <RefreshCw size={14} />
            RELOAD PAGE
          </button>
        </div>

        {/* Filigrane arrière-plan */}
        <div className="absolute -bottom-10 -right-10 text-primary/[0.03] text-9xl font-black select-none pointer-events-none">
          CRASHED
        </div>
      </section>
    </main>
  );
};

export default ServerErrorPage;