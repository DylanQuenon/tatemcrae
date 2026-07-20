
import { motion } from "framer-motion";

const Pagination = ({
    currentPage,
    itemsPerPage,
    length,
    onPageChanged,
}) => {
    const pagesCount = Math.ceil(length / itemsPerPage);

    if (pagesCount <= 1) return null;

    const pages = Array.from(
        { length: pagesCount },
        (_, index) => index + 1
    );

    return (
        <div className="flex items-center justify-center gap-2 mt-8">

            {/* Previous */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === 1}
                onClick={() => onPageChanged(currentPage - 1)}
                className="
                    px-4
                    py-2
                    border
                    border-white/15
                    text-xs
                    uppercase
                    tracking-[0.15em]
                    transition-all
                    duration-300
                    disabled:opacity-30
                    disabled:cursor-not-allowed
                    hover:border-primary
                    hover:text-primary
                "
            >
                ←
            </motion.button>

            {/* Pages */}
            {pages.map((page) => (
                <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChanged(page)}
                    className={`
                        w-10
                        h-10
                        border
                        text-xs
                        transition-all
                        duration-300

                        ${
                            currentPage === page
                                ? "bg-primary text-secondary border-primary"
                                : "border-white/15 text-white hover:border-primary hover:text-primary"
                        }
                    `}
                >
                    {page}
                </motion.button>
            ))}

            {/* Next */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === pagesCount}
                onClick={() => onPageChanged(currentPage + 1)}
                className="
                    px-4
                    py-2
                    border
                    border-white/15
                    text-xs
                    uppercase
                    tracking-[0.15em]
                    transition-all
                    duration-300
                    disabled:opacity-30
                    disabled:cursor-not-allowed
                    hover:border-primary
                    hover:text-primary
                "
            >
                →
            </motion.button>

        </div>
    );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage
    //              3         * 10          -   10          =   20  
    return items.slice(start, start + itemsPerPage)
    // arr.slice(debut, fin)
}

export default Pagination;
