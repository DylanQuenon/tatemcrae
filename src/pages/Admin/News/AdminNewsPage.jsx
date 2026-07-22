import { useEffect, useState, useMemo } from "react";
import newsAPI from "../../../services/newsAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { SERVER_URL } from "../../../config";
import ConfirmModal from "../components/modals/ConfirmModal";


const AdminNewsPage = () => {
    const [news, setNews]= useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [newToDelete, setNewToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const itemsPerPage = 10;

    // Fetch news
    const fetchNews = async () => {
        let isMounted=true;
        try{
            const data= await newsAPI.findAll();
            if (isMounted){
                setNews(data || []);
            }
        }catch(error){
            if (isMounted){
                toast.error("Unable to load albums");
            }
        }
        return () => { isMounted = false; };
    };

    useEffect(() => {
        fetchNews();
    },[]);

    // Search Input
    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
    };

    // Filter News
    const filteredNews = useMemo(() => {
        if(!Array.isArray(news)) return [];
        const term = search.toLowerCase();
        return news.filter((article) =>
            article.title?.toLowerCase().includes(term)||
            article.content?.toLowerCase().includes(term)
        );
    }, [news, search]);
    
    const maxPage= Math.ceil(filteredNews.length/itemsPerPage) || 1;
    useEffect(() => {
        if(currentPage > maxPage){
            setCurrentPage(maxPage);
        }
    }, [filteredNews.length, currentPage, maxPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedNews = Pagination.getData(filteredNews, currentPage, itemsPerPage);

     const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString();
    };

    const truncateText = (text, maxLength = 80) => {
        if (!text) return "—";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const confirmDelete = async () => {
        if (!newToDelete) return;

        setIsDeleting(true);
        const originalNews = [...news];

        setNews((prev) => prev.filter((a) => a.id !== newToDelete.id));

        try {
            await newsAPI.delete(newToDelete.id);
            toast.success("Album deleted successfully");
            setNewToDelete(null);
        } catch (error) {
            setNews(originalNews);
            toast.error("Unable to delete album");
        } finally {
            setIsDeleting(false);
        }
    };

  return (
    <>
        <div className="min-h-screen py-24 bg-secondary text-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                        <span className="text-xs uppercase tracking-[0.3em] text-primary block">Management</span>
                        <h3 className="mt-2 text-4xl uppercase italic bg-tertiary bg-clip-text text-transparent">News</h3>
                    </div>
                    <Link
                        to="/admin/news/new"
                        className="inline-flex items-center justify-center px-6 py-3 border border-primary/40 text-primary text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary hover:text-secondary active:scale-[0.98] cursor-pointer">
                            + Create News
                    </Link>
                </div>

                <div className="mb-8 relative max-w-md">
                    <input 
                        type="text"
                        placeholder="SEARCH NEWS..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full px-5 py-4 bg-transparent border border-white/15 text-white placeholder:text-white/30 text-xs outline-none transition-colors duration-300 focus:border-primary"
                    />
                </div>
                <div className="overflow-x-auto border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Cover
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Title
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Subtitle
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Content
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Published Date
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {paginatedNews.length > 0 ? (
                                paginatedNews.map((article) => (
                                    <tr
                                        key={article.id}
                                        className="transition-colors duration-200 hover:bg-white/5"
                                    >
                                        <td className="px-6 py-4">
                                            {article.cover?.contentUrl ? (
                                                <img
                                                    src={
                                                        article.cover.contentUrl.startsWith("http")
                                                            ? article.cover.contentUrl
                                                            : `${SERVER_URL}${article.cover.contentUrl}`
                                                    }
                                                    alt={article.title || "new title"}
                                                    className="w-12 h-12 object-cover border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/40">
                                                    N/A
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="uppercase text-sm tracking-wider font-medium text-white/90">
                                                {article.title}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="uppercase text-sm tracking-wider font-medium text-white/90">
                                                {article.subtitle}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 max-w-xs">
                                            <p className="text-xs text-white/60 line-clamp-2" title={article.content}>
                                                {truncateText(article.content, 80)}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="uppercase text-xs tracking-wider text-white/60">
                                                {formatDate(article.publishedAt)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-end items-center gap-3">
                                                <Link
                                                    to={`/admin/news/${article.id}`}
                                                    className="
                                                        px-4 py-2
                                                        border border-primary/50
                                                        text-primary text-[10px] uppercase tracking-[0.15em]
                                                        transition-all duration-300
                                                        hover:bg-primary hover:text-secondary cursor-pointer
                                                    "
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => setNewToDelete(article)}
                                                    className="
                                                        px-4 py-2
                                                        border border-red-500/40
                                                        text-red-400 text-[10px] uppercase tracking-[0.15em]
                                                        transition-all duration-300
                                                        hover:bg-red-500 hover:text-white cursor-pointer
                                                    "
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <p className="text-primary/70 uppercase text-xs tracking-[0.2em]">
                                            No news found
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {itemsPerPage < (filteredNews.length || 0) && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            length={filteredNews.length}
                            onPageChanged={handlePageChange}
                        />
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={!!newToDelete}
                title="Confirm deletion"
                message={
                    <p>
                        Are you sure you want to delete the NEW{" "}
                        <span className="text-primary font-semibold uppercase">
                            "{setNewToDelete?.title}"
                        </span>
                        ? This action cannot be undone.
                    </p>
                }
                onClose={() => setNewToDelete(null)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />
        </div>
    </>
  )
}

export default AdminNewsPage