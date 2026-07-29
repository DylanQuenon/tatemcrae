import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import TableLoader from "../../../components/loaders/TableLoader";


import ConfirmModal from "../components/modals/ConfirmModal";
import subscribersAPI from "../../../services/subscribersAPI";

const AdminSubscribersPage = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal & Delete state
    const [subscriberToDelete, setSubscriberToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const itemsPerPage = 10;

    const fetchSubscribers = async () => {
        try {
            const data = await subscribersAPI.findAll();
            setSubscribers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Unable to load subscribers");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    const filteredSubscribers = Array.isArray(subscribers)
        ? subscribers.filter((sub) => sub.email?.toLowerCase().includes(search.toLowerCase()))
        : [];

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedSubscribers = Pagination.getData(
        filteredSubscribers,
        currentPage,
        itemsPerPage
    );

    const confirmDelete = async () => {
        if (!subscriberToDelete) return;

        setIsDeleting(true);
        const originalSubscribers = [...subscribers];

        setSubscribers(subscribers.filter((sub) => sub.id !== subscriberToDelete.id));

        try {
            await subscribersAPI.delete(subscriberToDelete.id);
            toast.success("Subscriber deleted successfully");
            setSubscriberToDelete(null);
        } catch (error) {
            setSubscribers(originalSubscribers);
            toast.error("Unable to delete subscriber");
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
                        Subscribers
                    </h1>
                </div>

                <Link
                    to="/admin/subscribers/new"
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
                    + Create subscriber
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative max-w-md">
                <input
                    type="text"
                    placeholder="SEARCH SUBSCRIBERS..."
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
                                    Email
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Status
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium">
                                    Created At
                                </th>
                                <th className="px-6 py-5 text-xs uppercase tracking-[0.25em] text-primary font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {paginatedSubscribers.length > 0 ? (
                                paginatedSubscribers.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className="transition-colors duration-200 hover:bg-white/5"
                                    >
                                        <td className="px-6 py-5 text-xs font-mono text-white/50">
                                            #{sub.id}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="uppercase text-sm tracking-wider font-medium text-white/90">
                                                {sub.email}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full ${sub.active ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                                                {sub.active===true ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-xs text-white/60 font-mono">
                                            {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '-'}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-end items-center gap-3">
                                         
                                                <button
                                                    onClick={() => setSubscriberToDelete(sub)}
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
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <p className="text-primary/70 uppercase text-xs tracking-[0.2em]">
                                            No subscribers found
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
            {itemsPerPage < (filteredSubscribers.length || 0) && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        length={filteredSubscribers.length}
                        onPageChanged={handlePageChange}
                    />
                </div>
            )}

          </div>

            {/* Modal composant séparé */}
            <ConfirmModal
                isOpen={!!subscriberToDelete}
                title="Confirm deletion"
                message={
                    <p>
                        Are you sure you want to delete the subscriber{" "}
                        <span className="text-primary font-semibold uppercase">
                            "{subscriberToDelete?.email}"
                        </span>
                        ? This action cannot be undone.
                    </p>
                }
                onClose={() => setSubscriberToDelete(null)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />

        </div>
    );
};

export default AdminSubscribersPage;