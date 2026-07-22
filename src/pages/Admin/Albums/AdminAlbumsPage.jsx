import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import TableLoader from "../../../components/loaders/TableLoader";
import AlbumsAPI from "../../../services/AlbumsAPI";
import ConfirmModal from "../components/modals/ConfirmModal";
import { SERVER_URL } from "../../../config";

const AdminAlbumsPage = () => {
    const [albums, setAlbums] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [albumToDelete, setAlbumToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const itemsPerPage = 10;

    const fetchAlbums = async () => {
        let isMounted = true;
        try {
            const data = await AlbumsAPI.findAll();
            if (isMounted) {
                setAlbums(data || []);
                setLoading(false);
            }
        } catch (error) {
            if (isMounted) {
                toast.error("Unable to load albums");
                setLoading(false);
            }
        }
        return () => { isMounted = false; };
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    const filteredAlbums = useMemo(() => {
        if (!Array.isArray(albums)) return [];
        const term = search.toLowerCase();
        return albums.filter((album) =>
            album.name?.toLowerCase().includes(term) ||
            album.description?.toLowerCase().includes(term)
        );
    }, [albums, search]);

    const maxPage = Math.ceil(filteredAlbums.length / itemsPerPage) || 1;
    useEffect(() => {
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [filteredAlbums.length, currentPage, maxPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedAlbums = Pagination.getData(
        filteredAlbums,
        currentPage,
        itemsPerPage
    );

    const confirmDelete = async () => {
        if (!albumToDelete) return;

        setIsDeleting(true);
        const originalAlbums = [...albums];

        setAlbums((prev) => prev.filter((a) => a.id !== albumToDelete.id));

        try {
            await AlbumsAPI.delete(albumToDelete.id);
            toast.success("Album deleted successfully");
            setAlbumToDelete(null);
        } catch (error) {
            setAlbums(originalAlbums);
            toast.error("Unable to delete album");
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString();
    };

    const truncateText = (text, maxLength = 80) => {
        if (!text) return "—";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className="min-h-screen py-24 bg-secondary text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                        <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                            Management
                        </span>
                        <h3 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                            Albums
                        </h3>
                    </div>

                    <Link
                        to="/admin/albums/new"
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
                        + Create album
                    </Link>
                </div>

                <div className="mb-8 relative max-w-md">
                    <input
                        type="text"
                        placeholder="SEARCH ALBUMS..."
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

                {!loading ? (
                    <div className="overflow-x-auto border border-white/10 bg-secondary/50 backdrop-blur-sm">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                        Cover
                                    </th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                        Name
                                    </th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                        Release Date
                                    </th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                        Description
                                    </th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                        Stream
                                    </th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">
                                {paginatedAlbums.length > 0 ? (
                                    paginatedAlbums.map((album) => (
                                        <tr
                                            key={album.id}
                                            className="transition-colors duration-200 hover:bg-white/5"
                                        >
                                            <td className="px-6 py-4">
                                                {album.cover?.contentUrl ? (
                                                    <img
                                                        src={
                                                            album.cover.contentUrl.startsWith("http")
                                                                ? album.cover.contentUrl
                                                                : `${SERVER_URL}${album.cover.contentUrl}`
                                                        }
                                                        alt={album.name || "Album cover"}
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
                                                    {album.name}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="uppercase text-xs tracking-wider text-white/60">
                                                    {formatDate(album.releasedAt)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 max-w-xs">
                                                <p className="text-xs text-white/60 line-clamp-2" title={album.description}>
                                                    {truncateText(album.description, 80)}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                {album.streamUrl ? (
                                                    <a
                                                        href={album.streamUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-[10px] uppercase tracking-wider text-primary hover:underline"
                                                    >
                                                        Listen ↗
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-white/30">—</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex justify-end items-center gap-3">
                                                    <Link
                                                        to={`/admin/albums/${album.id}`}
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
                                                        onClick={() => setAlbumToDelete(album)}
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
                                                No albums found
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

                {itemsPerPage < (filteredAlbums.length || 0) && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            length={filteredAlbums.length}
                            onPageChanged={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!albumToDelete}
                title="Confirm deletion"
                message={
                    <p>
                        Are you sure you want to delete the album{" "}
                        <span className="text-primary font-semibold uppercase">
                            "{albumToDelete?.name}"
                        </span>
                        ? This action cannot be undone.
                    </p>
                }
                onClose={() => setAlbumToDelete(null)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default AdminAlbumsPage;