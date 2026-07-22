import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import galleriesAPI from '../../services/galleriesAPI';
import albumsAPI from '../../services/albumsAPI';
import newsAPI from '../../services/newsAPI';
import AudioLoader from '../../components/loaders/AudioLoader';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        albums: 0,
        galleries: 0,
        news: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Admin Dashboard - Tate McRae";

        const fetchStats = async () => {
            try {
                const [galleriesRes, albumsRes, newsRes] = await Promise.all([
                    galleriesAPI.findAll().catch(() => []),
                    albumsAPI?.findAll().catch(() => []) || Promise.resolve([]),
                    newsAPI?.findAll().catch(() => []) || Promise.resolve([])
                ]);

                setStats({
                    albums: Array.isArray(albumsRes) ? albumsRes.length : 0,
                    galleries: Array.isArray(galleriesRes) ? galleriesRes.length : 0,
                    news: Array.isArray(newsRes) ? newsRes.length : 0
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Helper to calculate bar heights safely
    const totalCount = stats.albums + stats.galleries + stats.news || 1;
    const albumsHeight = Math.round((stats.albums / totalCount) * 100);
    const galleriesHeight = Math.round((stats.galleries / totalCount) * 100);
    const newsHeight = Math.round((stats.news / totalCount) * 100);

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary flex flex-col items-center justify-center gap-6 text-white px-6">
                <AudioLoader height={60} width={60} color="#ffffff" />
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-xl font-medium uppercase tracking-widest bg-tertiary bg-clip-text text-transparent">
                        Loading Dashboard
                    </h2>
                    <p className="text-xs text-blue-100/60 uppercase tracking-wider">
                        Fetching metrics and application data...
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-secondary px-6 py-20 text-white md:px-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-10">

                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-blue-800/50 pb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Admin{" "}
                        <span className="text-secondary [-webkit-text-stroke:1px_white]">
                            Dashboard
                        </span>
                    </h1>

                    <p className="text-sm text-blue-100/70">
                        Welcome back. Manage your application content and settings.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3">

                    <div className="flex flex-col gap-2 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-6 shadow-lg shadow-blue-950/20">
                        <span className="text-sm font-medium text-blue-100">
                            Albums
                        </span>
                        <span className="text-3xl font-bold text-white">
                            {stats.albums}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-6 shadow-lg shadow-blue-950/20">
                        <span className="text-sm font-medium text-blue-100">
                            Gallery images
                        </span>
                        <span className="text-3xl font-bold text-white">
                            {stats.galleries}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-6 shadow-lg shadow-blue-950/20">
                        <span className="text-sm font-medium text-blue-100">
                            News articles
                        </span>
                        <span className="text-3xl font-bold text-white">
                            {stats.news}
                        </span>
                    </div>

                </div>

                {/* Main content with Analytics & Quick Actions */}
                <div className="grid gap-8 lg:grid-cols-2">

                    {/* Content Distribution Chart */}
                    <div className="flex flex-col justify-between gap-6 rounded-3xl border border-blue-800/60 bg-blue-900/20 p-8 shadow-lg shadow-blue-950/25">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white tracking-wide">
                                Content Distribution
                            </h2>
                            <span className="rounded-full border border-blue-400/30 bg-blue-800/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-blue-200">
                                Overview
                            </span>
                        </div>

                        <div className="flex h-52 items-end justify-around gap-4 pt-6 px-4 border-b border-blue-800/40">
                            {/* Albums Bar */}
                            <div className="flex flex-col items-center gap-2 h-full justify-end w-1/3">
                                <span className="text-xs text-blue-200 font-medium">{stats.albums}</span>
                                <div 
                                    style={{ height: `${Math.max(albumsHeight, 10)}%` }} 
                                    className="w-full bg-blue-500/40 border border-blue-400/50 rounded-t-lg transition-all duration-500 hover:bg-blue-400/60"
                                ></div>
                                <span className="text-xs text-blue-100/70 uppercase tracking-wider mt-1">Albums</span>
                            </div>

                            {/* Galleries Bar */}
                            <div className="flex flex-col items-center gap-2 h-full justify-end w-1/3">
                                <span className="text-xs text-blue-200 font-medium">{stats.galleries}</span>
                                <div 
                                    style={{ height: `${Math.max(galleriesHeight, 10)}%` }} 
                                    className="w-full bg-primary/40 border border-primary/60 rounded-t-lg transition-all duration-500 hover:bg-primary/60"
                                ></div>
                                <span className="text-xs text-blue-100/70 uppercase tracking-wider mt-1">Galleries</span>
                            </div>

                            {/* News Bar */}
                            <div className="flex flex-col items-center gap-2 h-full justify-end w-1/3">
                                <span className="text-xs text-blue-200 font-medium">{stats.news}</span>
                                <div 
                                    style={{ height: `${Math.max(newsHeight, 10)}%` }} 
                                    className="w-full bg-indigo-500/40 border border-indigo-400/50 rounded-t-lg transition-all duration-500 hover:bg-indigo-400/60"
                                ></div>
                                <span className="text-xs text-blue-100/70 uppercase tracking-wider mt-1">News</span>
                            </div>
                        </div>

                        <p className="text-xs text-blue-100/50 text-center">
                            Proportions based on active database records.
                        </p>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="flex flex-col justify-between gap-6 rounded-3xl border border-blue-800/60 bg-blue-900/20 p-8 shadow-lg shadow-blue-950/25">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white tracking-wide">
                                    Quick Actions
                                </h2>
                                <span className="rounded-full border border-blue-400/30 bg-blue-800/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-blue-200">
                                    Ready
                                </span>
                            </div>
                            <p className="text-sm text-blue-100/70">
                                Jump straight into managing your gallery items, releases, or creating new updates.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link 
                                to="/admin/galleries"
                                className="w-full text-center px-6 py-3 border border-primary bg-primary text-secondary text-xs uppercase tracking-[0.2em] font-medium transition-all hover:bg-transparent hover:text-white"
                            >
                                Manage Galleries
                            </Link>
                            <Link 
                                to="/admin/galleries/new"
                                className="w-full text-center px-6 py-3 border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-medium transition-all hover:border-white hover:bg-white/10"
                            >
                                Add New Gallery Item
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}