import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';

import galleriesAPI from '../../../services/galleriesAPI';
import tagsAPI from '../../../services/tagsAPI';
import TableLoader from '../../../components/loaders/TableLoader';
import Pagination from '../../../components/Pagination';
import ConfirmModal from '../components/modals/ConfirmModal';
import { SERVER_URL } from '../../../config';

// Custom styles configuration for react-select dropdowns
const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#051e42',
        borderColor: state.isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
        padding: '2px',
        boxShadow: 'none',
        fontFamily: "'Unison Pro', sans-serif",
        '&:hover': {
            borderColor: '#ffffff'
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#051e42',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 9999,
        fontFamily: "'Unison Pro', sans-serif"
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected 
            ? '#ffffff' 
            : state.isFocused 
            ? 'rgba(255, 255, 255, 0.1)' 
            : '#051e42',
        color: state.isSelected ? '#000000' : '#ffffff',
        cursor: 'pointer',
        fontFamily: "'Unison Pro', sans-serif",
        '&:active': {
            backgroundColor: '#ffffff'
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: '#ffffff',
        fontFamily: "'Unison Pro', sans-serif"
    }),
    input: (base) => ({
        ...base,
        color: '#ffffff',
        fontFamily: "'Unison Pro', sans-serif"
    }),
    placeholder: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.4)',
        fontFamily: "'Unison Pro', sans-serif"
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
        '&:hover': {
            color: '#ffffff'
        }
    }),
    clearIndicator: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.4)',
        '&:hover': {
            color: '#ffffff'
        }
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    })
};

const AdminGalleriesPage = () => {
    const [galleries, setGalleries] = useState([]);
    const [tagsOptions, setTagsOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter, search, and sort states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [sortOrder, setSortOrder] = useState({ label: 'Newest First', value: 'desc' });

    // Deletion modal states
    const [galleryToDelete, setGalleryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const sortOptions = [
        { label: 'Newest First', value: 'desc' },
        { label: 'Oldest First', value: 'asc' }
    ];

    // Helper to format media URLs correctly based on environment configuration
    const getMediaUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${SERVER_URL}${url}`;
    };

    // Fetch available tags once on component mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagsData = await tagsAPI.findAll();
                const options = (tagsData || []).map((t) => ({
                    label: t.name,
                    value: t.slug,
                }));
                setTagsOptions(options);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };
        fetchTags();
    }, []);

    // Fetch all gallery items once on component mount
    useEffect(() => {
        const fetchGalleries = async () => {
            let isMounted = true;
            try {
                setLoading(true);
                const data = await galleriesAPI.findAll();
                if (isMounted) {
                    setGalleries(data || []);
                }
            } catch (error) {
                console.error("Error fetching galleries:", error);
                toast.error("Unable to load gallery items.");
            } finally {
                if (isMounted) setLoading(false);
            }
            return () => { isMounted = false; };
        };

        fetchGalleries();
    }, []);

    // Compute filtered and sorted gallery list efficiently with useMemo
    const filteredGalleries = useMemo(() => {
        let result = galleries.filter((item) => {
            const matchesSearch =
                searchTerm.trim() === '' ||
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.caption?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTag =
                !selectedTag ||
                (Array.isArray(item.tag) &&
                    item.tag.some((t) => {
                        if (typeof t === 'object' && t !== null) {
                            return t.slug === selectedTag.value;
                        }
                        return t === selectedTag.value;
                    }));

            return matchesSearch && matchesTag;
        });

        // Apply chronological sorting
        result.sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.createdAt || 0);
            const dateB = new Date(b.publishedAt || b.createdAt || 0);

            if (sortOrder.value === 'desc') {
                return dateB - dateA || b.id - a.id;
            } else {
                return dateA - dateB || a.id - b.id;
            }
        });

        return result;
    }, [galleries, searchTerm, selectedTag, sortOrder]);

    // Adjust current page if filter results reduce the maximum available pages
    const maxPage = Math.ceil(filteredGalleries.length / itemsPerPage) || 1;
    useEffect(() => {
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [filteredGalleries.length, currentPage, maxPage]);

    const paginatedGalleries = Pagination.getData(
        filteredGalleries,
        currentPage,
        itemsPerPage
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleTagChange = (option) => {
        setSelectedTag(option);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedTag(null);
        setSortOrder({ label: 'Newest First', value: 'desc' });
        setCurrentPage(1);
    };

    // Handle asynchronous gallery item deletion with optimistic updates
    const confirmDelete = async () => {
        if (!galleryToDelete) return;

        setIsDeleting(true);
        const originalGalleries = [...galleries];
        setGalleries(prev => prev.filter((item) => item.id !== galleryToDelete.id));

        try {
            await galleriesAPI.delete(galleryToDelete.id);
            toast.success("Gallery item deleted successfully.");
            setGalleryToDelete(null);
        } catch (error) {
            console.error("Error deleting item:", error);
            setGalleries(originalGalleries);
            toast.error("Failed to delete item.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary text-white px-6 py-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                            Management
                        </span>
                        <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                            Galleries
                        </h1>
                    </div>

                    <Link
                        to="/admin/galleries/new"
                        className="px-6 py-3 border border-primary bg-primary text-secondary text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-transparent hover:text-primary"
                    >
                        Add New Item
                    </Link>
                </div>

                {/* Filter and search control bar */}
                <div className="mb-6 p-6 border border-white/10 bg-secondary/50 backdrop-blur-sm relative z-20 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4 space-y-2">
                        <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                            Search
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="SEARCH BY NAME OR CAPTION..."
                            className="w-full bg-secondary border border-white/20 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="md:col-span-3 space-y-2">
                        <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                            Filter by Tag
                        </label>
                        <Select
                            isClearable
                            options={tagsOptions}
                            value={selectedTag}
                            onChange={handleTagChange}
                            styles={customSelectStyles}
                            placeholder="ALL TAGS..."
                            menuPortalTarget={document.body}
                        />
                    </div>

                    <div className="md:col-span-3 space-y-2">
                        <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                            Chronological Order
                        </label>
                        <Select
                            options={sortOptions}
                            value={sortOrder}
                            onChange={(option) => {
                                setSortOrder(option);
                                setCurrentPage(1);
                            }}
                            styles={customSelectStyles}
                            isClearable={false}
                            menuPortalTarget={document.body}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="w-full py-2.5 px-4 border border-white/20 text-white/70 text-xs uppercase tracking-[0.15em] hover:border-white hover:text-white transition-all cursor-pointer"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Data table container with animation */}
                <div className="p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm overflow-x-auto relative z-10">
                    {loading ? (
                        <TableLoader />
                    ) : (
                        <table className="w-full text-left text-sm text-white/80 border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-primary">
                                    <th className="py-4 px-4">Preview</th>
                                    <th className="py-4 px-4">Name</th>
                                    <th className="py-4 px-4">Caption</th>
                                    <th className="py-4 px-4">Tags</th>
                                    <th className="py-4 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {paginatedGalleries.length === 0 ? (
                                        <motion.tr
                                            key="no-items"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <td colSpan="5" className="py-8 text-center text-white/40">
                                                No items found.
                                            </td>
                                        </motion.tr>
                                    ) : (
                                        paginatedGalleries.map((item) => {
                                            const imageUrl = item.image?.contentUrl;

                                            return (
                                                <motion.tr
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="py-4 px-4">
                                                        {imageUrl ? (
                                                            <img
                                                                src={getMediaUrl(imageUrl)}
                                                                alt={item.name}
                                                                className="w-16 h-12 object-cover border border-white/10"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-12 bg-white/10 flex items-center justify-center text-[10px] text-white/40">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium text-white">
                                                        {item.name}
                                                    </td>
                                                    <td className="py-4 px-4 text-white/60 truncate max-w-xs">
                                                        {item.caption}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {Array.isArray(item.tag) && item.tag.map((t, idx) => {
                                                                const tagName = typeof t === 'object' ? t.name : t;
                                                                return (
                                                                    <span
                                                                        key={t.id || idx}
                                                                        className="text-[10px] px-2 py-0.5 border border-primary/40 text-primary"
                                                                    >
                                                                        {tagName}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right space-x-3">
                                                        <Link
                                                            to={`/admin/galleries/${item.id}`}
                                                            className="text-xs uppercase tracking-wider text-primary hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => setGalleryToDelete(item)}
                                                            className="text-xs uppercase tracking-wider text-red-400 hover:underline cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>

                {itemsPerPage < (filteredGalleries.length || 0) && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            length={filteredGalleries.length}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
            </div>

            {/* Confirmation modal wrapper for item deletion */}
            <ConfirmModal
                isOpen={!!galleryToDelete}
                onClose={() => setGalleryToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Gallery Item"
                message={`Are you sure you want to delete "${galleryToDelete?.name || 'this item'}"? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default AdminGalleriesPage;