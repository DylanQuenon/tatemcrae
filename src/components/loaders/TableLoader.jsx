
const TableLoader = ({ rows = 10 }) => {
    return (
        <div className="overflow-hidden border border-white/10">

            <table className="w-full border-collapse">

                {/* Header */}
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="px-6 py-5">
                            <div className="h-3 w-10 bg-white/10 animate-pulse" />
                        </th>

                        <th className="px-6 py-5">
                            <div className="h-3 w-24 bg-white/10 animate-pulse" />
                        </th>

                        <th className="px-6 py-5">
                            <div className="h-3 w-20 bg-white/10 animate-pulse ml-auto" />
                        </th>
                    </tr>
                </thead>

                {/* Rows */}
                <tbody>
                    {Array.from({ length: rows }).map((_, index) => (
                        <tr
                            key={index}
                            className="border-b border-white/10"
                        >
                            {/* ID */}
                            <td className="px-6 py-6">
                                <div className="h-4 w-8 bg-white/10 animate-pulse rounded-sm" />
                            </td>

                            {/* Name */}
                            <td className="px-6 py-6">
                                <div className="h-4 w-40 bg-white/10 animate-pulse rounded-sm" />
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-6">
                                <div className="flex justify-end gap-3">
                                    <div className="h-9 w-16 bg-white/10 animate-pulse" />
                                    <div className="h-9 w-20 bg-white/10 animate-pulse" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
};

export default TableLoader;
