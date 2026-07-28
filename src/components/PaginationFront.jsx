import { useState } from "react";

const PaginationFront = ({
    currentPage,
    itemsPerPage,
    length,
    onPageChanged,
}) => {
    const [pageInput, setPageInput] = useState("");

    const totalPages = Math.ceil(length / itemsPerPage);

    if (totalPages <= 1) return null;

    const goToPage = (page) => {
        const nextPage = Math.max(1, Math.min(page, totalPages));

        onPageChanged(nextPage);
        setPageInput("");
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const page = Number(pageInput);

        if (!page || page < 1 || page > totalPages) {
            return;
        }

        goToPage(page);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Main pagination */}
            <div className="flex items-center justify-center gap-6 md:gap-8">
                {/* Previous */}
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="
                        group
                        w-12
                        h-12
                        md:w-14
                        md:h-14
                        rounded-full
                        border
                        border-primary/50
                        flex
                        items-center
                        justify-center
                        text-primary
                        transition-all
                        duration-300
                        hover:bg-primary
                        hover:text-secondary
                        hover:border-primary
                        disabled:opacity-25
                        disabled:hover:bg-transparent
                        disabled:hover:text-primary
                        cursor-pointer
                        disabled:cursor-default
                    "
                >
                    <span className="text-2xl font-light leading-none transition-transform duration-300 group-hover:-translate-x-0.5">
                        ←
                    </span>
                </button>

                {/* Page counter */}
                <div className="flex items-center gap-2 min-w-[180px] justify-center">
                    <span className="text-5xl md:text-6xl leading-none font-unison tracking-tight text-primary">
                        {String(currentPage).padStart(2, "0")}
                    </span>

                    <span className="text-4xl md:text-5xl font-unison leading-none text-primary/25">
                        /
                    </span>

                    <span className="text-5xl md:text-6xl leading-none font-unison tracking-tight text-primary/25">
                        {String(totalPages).padStart(2, "0")}
                    </span>
                </div>

                {/* Next */}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="
                        group
                        w-12
                        h-12
                        md:w-14
                        md:h-14
                        rounded-full
                        border
                        border-primary/50
                        flex
                        items-center
                        justify-center
                        text-primary
                        transition-all
                        duration-300
                        hover:bg-primary
                        hover:text-secondary
                        hover:border-primary
                        disabled:opacity-25
                        disabled:hover:bg-transparent
                        disabled:hover:text-primary
                        cursor-pointer
                        disabled:cursor-default
                    "
                >
                    <span className="text-2xl font-light leading-none transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                    </span>
                </button>
            </div>

            {/* Go to page */}
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3"
            >
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-unison text-primary/60">
                    Go to page
                </span>

                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={(event) => setPageInput(event.target.value)}
                    placeholder={`E.G. ${Math.min(12, totalPages)}`}
                    className="
                        w-20
                        h-8
                        px-3
                        border
                        border-primary/30
                        bg-primary/5
                        text-primary
                        text-[10px]
                        uppercase
                        tracking-wider
                        outline-none
                        placeholder:text-primary/30
                        focus:border-primary
                        transition-colors
                        duration-300
                    "
                />
            </form>
        </div>
    );
};

export default PaginationFront;