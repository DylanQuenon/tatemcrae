import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import TableLoader from "../../../components/loaders/TableLoader";

import TagsAPI from "../../../services/TagsAPI";
import ConfirmModal from "../components/modals/ConfirmModal";

const AdminTagsPage = () => {
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal & Delete state
    const [tagToDelete, setTagToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const itemsPerPage = 10;

    const fetchTags = async () => {
        try {
            const data = await TagsAPI.findAll();
            setTags(data);
            setLoading(false);
        } catch (error) {
            toast.error("Unable to load tags");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    const filteredTags = Array.isArray(tags)
        ? tags.filter((tag) => tag.name?.toLowerCase().includes(search.toLowerCase()))
        : [];

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedTags = Pagination.getData(
        filteredTags,
        currentPage,
        itemsPerPage
    );

    const confirmDelete = async () => {
        if (!tagToDelete) return;

        setIsDeleting(true);
        const originalTags = [...tags];

        setTags(tags.filter((tag) => tag.id !== tagToDelete.id));

        try {
            await TagsAPI.delete(tagToDelete.id);
            toast.success("Tag deleted successfully");
            setTagToDelete(null);
        } catch (error) {
            setTags(originalTags);
            toast.error("Unable to delete tag");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen py-24 bg-secondary text-white relative">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        Management
                    </span>
                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        Tags
                    </h1>
                </div>

                <Link
                    to="/admin/tags/new"
                    className="
                        inline-flex items-center justify-center
                        px-6 py-3
                        border border-primary/40
                        text-primary text-xs uppercase tracking-[0.2em]
                        transition-all duration-300
                        hover:bg-primary hover:text-secondary
                        active:scale-[0.98] cursor-pointer
                    "
                >
                    + Create tag
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative max-w-md">
                <input
                    type="text"
                    placeholder="SEARCH TAGS..."
                    value={search}
                    onChange={handleSearch}
                    className="
                        w-full px-5 py-4
                        bg-transparent
                        border border-white/15
                        text-white placeholder:text-white/30 text-xs tracking-wider uppercase
                        outline-none
                        transition-colors duration-300
                        focus:border-primary
                    "
                />
            </div>

            {/* Table */}
            {!loading ? (
                <div className="overflow-x-auto border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    ID
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Name
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {paginatedTags.length > 0 ? (
                                paginatedTags.map((tag) => (
                                    <tr
                                        key={tag.id}
                                        className="transition-colors duration-200 hover:bg-white/5"
                                    >
                                        <td className="px-6 py-5 text-xs font-mono text-white/50">
                                            #{tag.id}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="uppercase text-sm tracking-wider font-medium text-white/90">
                                                {tag.name}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-end items-center gap-3">
                                                <Link
                                                    to={`/admin/tags/${tag.id}`}
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
                                                    onClick={() => setTagToDelete(tag)}
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
                                    <td colSpan="3" className="px-6 py-16 text-center">
                                        <p className="text-primary/70 uppercase text-xs tracking-[0.2em]">
                                            No tags found
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <TableLoader rows={10} />
            )}

            {/* Pagination */}
            {itemsPerPage < (filteredTags.length || 0) && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        length={filteredTags.length}
                        onPageChanged={handlePageChange}
                    />
                </div>
            )}

          </div>


            {/* Modal composant séparé */}
            <ConfirmModal
                isOpen={!!tagToDelete}
                title="Confirm deletion"
                message={
                    <p>
                        Are you sure you want to delete the tag{" "}
                        <span className="text-primary font-semibold uppercase">
                            "{tagToDelete?.name}"
                        </span>
                        ? This action cannot be undone.
                    </p>
                }
                onClose={() => setTagToDelete(null)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />

        </div>
    );
};

export default AdminTagsPage;