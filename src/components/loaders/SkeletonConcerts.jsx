import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // <-- NE PAS OUBLIER CET IMPORT

export default function SkeletonConcerts({ count = 5 }) {
    return (
        <SkeletonTheme baseColor="rgba(255, 255, 255, 0.08)" highlightColor="rgba(255, 255, 255, 0.2)">
            <div className="mt-16 flex flex-col">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className="px-6 py-6 border-y border-primary/20 flex items-center justify-between"
                    >
                        {/* 1. Emplacement de la Date */}
                        <div className="w-24 shrink-0">
                            <Skeleton width={70} height={18} />
                        </div>

                        {/* 2. Emplacement Titre + Ville/Lieu */}
                        <div className="flex-1 flex flex-col items-center justify-center px-8 min-w-0">
                            <Skeleton width={200} height={20} className="mb-2" />
                            <Skeleton width={140} height={14} />
                        </div>

                        {/* 3. Emplacement Bouton "Get Tickets" */}
                        <div className="w-36 shrink-0 flex justify-end">
                            <Skeleton width={110} height={16} />
                        </div>
                    </div>
                ))}
            </div>
        </SkeletonTheme>
    );
}