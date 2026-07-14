import { useEffect } from 'react';

export default function AdminDashboard() {
    useEffect(() => {
    document.title = "Admin Dashboard - Tate McRae";
  }, []);
    
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
                            12
                        </span>
                    </div>


                    <div className="flex flex-col gap-2 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-6 shadow-lg shadow-blue-950/20">
                        <span className="text-sm font-medium text-blue-100">
                            Gallery images
                        </span>

                        <span className="text-3xl font-bold text-white">
                            248
                        </span>
                    </div>


                    <div className="flex flex-col gap-2 rounded-2xl border border-blue-800/60 bg-blue-900/20 p-6 shadow-lg shadow-blue-950/20">
                        <span className="text-sm font-medium text-blue-100">
                            News articles
                        </span>

                        <span className="text-3xl font-bold text-white">
                            36
                        </span>
                    </div>

                </div>


                {/* Main content */}
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-3xl border border-blue-800/60 bg-blue-900/20 p-10 shadow-lg shadow-blue-950/20">

                    <div className="rounded-full border border-blue-400/30 bg-blue-800/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-200">
                        Ready
                    </div>


                    <div className="flex flex-col gap-2 text-center">

                        <h2 className="text-xl font-semibold text-white">
                            Dashboard is ready
                        </h2>

                        <p className="max-w-md text-sm text-blue-100/70">
                            Your administration content, statistics and management tools will appear here.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}