import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AlbumsAPI from "../../../services/AlbumsAPI";
import { SERVER_URL } from "../../../config";

const HomeAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const fetchAlbums = async () => {
    try {
      const data = await AlbumsAPI.findAll();
      setAlbums(data || []);
    } catch (error) {
      toast.error("Unable to load albums");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const toggleCard = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="w-full min-h-screen bg-secondary text-primary">
      <div className="w-full flex flex-col">
        {albums.map((album, index) => {
          const isActive = activeId === album.id;

          const coverPath = album?.cover?.contentUrl
          const imageUrl = coverPath ? `${SERVER_URL}${coverPath}` : null;
          const displayNumber = String(albums.length - index).padStart(2, "0");

          return (
            <div
              key={album.id || index}
              onClick={() => toggleCard(album.id)}
              className={`
                group relative cursor-pointer overflow-hidden
                transition-all duration-500 ease-in-out
                border-b border-primary/20 bg-secondary
                h-37.5 hover:h-75 max-md:hover:h-60
                ${isActive ? "h-60!" : ""}
              `}
            >
              {imageUrl && (
                <div
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: "center 20%",
                  }}
                  className={`
                    absolute inset-0 bg-cover bg-no-repeat
                    transition-opacity duration-500
                    opacity-0 group-hover:opacity-100
                    ${isActive ? "opacity-100!" : ""}
                  `}
                />
              )}

              <div
                className={`
                  absolute inset-0 bg-black/50
                  transition-opacity duration-500
                  opacity-0 group-hover:opacity-100
                  ${isActive ? "opacity-100!" : ""}
                `}
              />

              <div
                className={`
                  absolute left-4 bottom-4 z-10
                  pointer-events-none
                  transition-transform duration-500 ease-out
                  md:left-6 md:bottom-0
                  md:translate-y-16
                  md:group-hover:translate-y-0
                  ${isActive ? "md:translate-y-0!" : ""}
                `}
              >
                <span className="block text-3xl leading-none tracking-tighter opacity-90 select-none md:text-[160px]">
                  {displayNumber}
                </span>
              </div>

              {/* Ajustement ici : justify-start gap-4 en mobile, md:justify-between en desktop */}
              <div className="relative z-20 h-full w-full p-6 md:p-8 flex flex-col justify-start md:justify-between items-end text-right gap-3 md:gap-0">
                <h2 className="text-3xl md:text-5xl font-bold bg-tertiary bg-clip-text text-transparent tracking-wider uppercase">
                  {album.name}
                </h2>

                <div
                  className={`
                    flex flex-col items-end gap-3
                    transition-all duration-500
                    opacity-0 translate-y-4 pointer-events-none
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    group-hover:pointer-events-auto
                    ${isActive ? "opacity-100! translate-y-0! pointer-events-auto!" : ""}
                  `}
                >
                  {album.description && (
                    <p className="max-w-xl text-xs md:text-sm text-gray-200 uppercase tracking-wide leading-relaxed line-clamp-3">
                      {album.description}
                    </p>
                  )}

                  {album.streamUrl && (
                    <a
                      href={album.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-5 py-1.5 border border-primary rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary hover:text-secondary transition-colors"
                    >
                      STREAM NOW ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeAlbums;