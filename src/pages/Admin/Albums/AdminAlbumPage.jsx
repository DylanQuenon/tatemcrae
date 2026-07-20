import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Field from '../../../components/forms/Field';
import AlbumsAPI from '../../../services/AlbumsAPI';
import mediaObjectsAPI from '../../../services/mediaObjectsAPI';
import AudioLoader from '../../../components/loaders/AudioLoader';
import { SERVER_URL } from '../../../config';

const AdminAlbumPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id && id !== "new");

    const [submitting, setSubmitting] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const [album, setAlbum] = useState({
        name: "",
        releasedAt: "",
        description: "",
        streamUrl: "",
        cover: null
    });

    const [errors, setErrors] = useState({
        name: "",
        releasedAt: "",
        description: "",
        streamUrl: "",
        cover: ""
    });

    const getCoverUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${SERVER_URL}${url}`;
    };

    const fetchAlbum = async (albumId) => {
        if (!albumId || albumId === "undefined") return;

        try {
            const data = await AlbumsAPI.find(albumId);
            const { name, releasedAt, description, streamUrl, cover } = data || {};

            let formattedDate = "";
            if (releasedAt) {
                formattedDate = new Date(releasedAt).toISOString().split('T')[0];
            }

            setAlbum({
                name: name ?? "",
                releasedAt: formattedDate,
                description: description ?? "",
                streamUrl: streamUrl ?? "",
                cover: cover ? (typeof cover === 'object' ? cover['@id'] || cover.contentUrl : cover) : null
            });

            if (cover && typeof cover === 'object' && cover.contentUrl) {
                setCoverPreview(getCoverUrl(cover.contentUrl));
            }
        } catch (error) {
            console.error("Error loading album:", error);
            toast.error("Unable to load album");
            navigate("/admin/albums", { replace: true });
        }
    };

    useEffect(() => {
        if (isEditing) {
            fetchAlbum(id);
        }
    }, [id, isEditing]);

    // Validation individuelle dynamique
    const validateField = (fieldName, value) => {
        let errorMessage = "";
        const valStr = String(value || "").trim();

        if (!valStr) {
            switch (fieldName) {
                case "name":
                    errorMessage = "Album name is required and can't be empty.";
                    break;
                case "releasedAt":
                    errorMessage = "Release date is required and can't be empty.";
                    break;
                case "description":
                    errorMessage = "Description is required and can't be empty.";
                    break;
                case "streamUrl":
                    errorMessage = "Streaming URL is required and can't be empty.";
                    break;
                default:
                    errorMessage = "This field is required and can't be empty.";
            }
        }

        setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
    };

    // Validation en direct lors du changement
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setAlbum(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Validation lorsque le curseur quitte le champ
    const handleBlur = (event) => {
        const { name, value } = event.currentTarget;
        validateField(name, value);
    };

    // Validation de l'image de couverture
    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            const MAX_SIZE = 2 * 1024 * 1024; // 2MB

            if (file.size > MAX_SIZE) {
                setErrors(prev => ({
                    ...prev,
                    cover: "The image exceeds the maximum allowed size (2 MB)."
                }));
                setCoverFile(null);
                setCoverPreview(null);
                return;
            }

            setErrors(prev => ({ ...prev, cover: "" }));
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        } else if (!album.cover) {
            setErrors(prev => ({ ...prev, cover: "Album cover is required and can't be empty." }));
        }
    };

    const extractJsonPayload = (responseData) => {
        if (!responseData) return null;
        if (typeof responseData === 'object') return responseData;

        if (typeof responseData === 'string') {
            const start = responseData.indexOf('{');
            const end = responseData.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                try {
                    return JSON.parse(responseData.substring(start, end + 1));
                } catch (e) {
                    console.error("Unable to parse JSON:", e);
                }
            }
        }
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation globale avant soumission
        const clientErrors = {};
        if (!album.name.trim()) clientErrors.name = "Album name is required and can't be empty.";
        if (!album.releasedAt) clientErrors.releasedAt = "Release date is required and can't be empty.";
        if (!album.description.trim()) clientErrors.description = "Description is required and can't be empty.";
        if (!album.streamUrl.trim()) clientErrors.streamUrl = "Streaming URL is required and can't be empty.";
        if (!coverFile && !album.cover) clientErrors.cover = "Album cover is required and can't be empty.";

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            toast.error("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        let coverIri = album.cover;

        // 1. Upload du média
        if (coverFile) {
            try {
                const formData = new FormData();
                formData.append('file', coverFile);

                const mediaObject = await mediaObjectsAPI.create(formData);
                coverIri = mediaObject['@id'] || `/api/media_objects/${mediaObject.id}`;
            } catch (mediaError) {
                console.error("Error uploading image:", mediaError.response);
                const responseData = mediaError.response?.data;
                const data = extractJsonPayload(responseData);
                let imageErrorMessage = "An error occurred while uploading the image.";

                if (data?.violations && Array.isArray(data.violations)) {
                    const fileViolation = data.violations.find(v => v.propertyPath === 'file' || v.propertyPath === 'cover');
                    if (fileViolation) {
                        imageErrorMessage = fileViolation.message;
                    } else if (data.violations[0]?.message) {
                        imageErrorMessage = data.violations[0].message;
                    }
                } else if (data?.['hydra:description']) {
                    imageErrorMessage = data['hydra:description'];
                } else if (typeof responseData === 'string' && responseData.includes('POST Content-Length')) {
                    imageErrorMessage = "The file is too large for the PHP server limits.";
                } else if (mediaError.response?.status === 422) {
                    imageErrorMessage = "The selected file is invalid or corrupted.";
                }

                setErrors(prev => ({ ...prev, cover: imageErrorMessage }));
                toast.error(imageErrorMessage);
                setSubmitting(false);
                return;
            }
        }

        // 2. Enregistrement de l'album
        try {
            const albumData = { ...album, cover: coverIri };

            if (isEditing) {
                await AlbumsAPI.update(id, albumData);
                toast.success("Album updated successfully");
            } else {
                await AlbumsAPI.create(albumData);
                toast.success("Album created successfully");
            }

            navigate("/admin/albums", { replace: true });
        } catch (albumError) {
            console.error("Symfony API Error Response (Album):", albumError.response);

            const data = extractJsonPayload(albumError.response?.data);

            if (data?.violations && Array.isArray(data.violations)) {
                const apiErrors = {};
                data.violations.forEach(({ propertyPath, message }) => {
                    const key = propertyPath === 'file' ? 'cover' : propertyPath;
                    apiErrors[key] = message;
                });
                setErrors(apiErrors);
                toast.error("Validation failed. Please check the form errors.");
            } else if (data?.['hydra:description']) {
                toast.error(data['hydra:description']);
            } else if (data?.detail) {
                toast.error(data.detail);
            } else if (data?.message) {
                toast.error(data.message);
            } else {
                toast.error("An error occurred while saving the album.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const hasErrors = Object.values(errors).some(errorMsg => Boolean(errorMsg));
    const isFormIncomplete = !album.name.trim() || !album.releasedAt || !album.description.trim() || !album.streamUrl.trim() || (!coverFile && !album.cover);
    const isSubmitDisabled = submitting || hasErrors || isFormIncomplete;

    return (
        <div className="min-h-screen bg-secondary text-white px-6 py-10">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        Management
                    </span>
                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        {!isEditing ? "Create Album" : "Edit Album"}
                    </h1>
                </div>

                <div className="p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                        <Field
                            name="name"
                            label="ALBUM NAME *"
                            placeholder="E.G. DARK SIDE OF THE MOON..."
                            value={album.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.name}
                        />

                        <Field
                            name="releasedAt"
                            label="RELEASE DATE *"
                            type="date"
                            value={album.releasedAt}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.releasedAt}
                        />

                        <Field
                            name="description"
                            label="DESCRIPTION *"
                            type="textarea"
                            placeholder="ENTER ALBUM DESCRIPTION..."
                            value={album.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.description}
                            rows={4}
                        />

                        <Field
                            name="streamUrl"
                            label="STREAMING URL *"
                            placeholder="HTTPS://OPEN.SPOTIFY.COM/ALBUM/..."
                            value={album.streamUrl}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.streamUrl}
                        />

                        <div className="space-y-3">
                            <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                                ALBUM COVER (MEDIA OBJECT) *
                            </label>

                            <div className="flex items-center gap-6">
                                {coverPreview && (
                                    <div className="w-20 h-20 border border-white/20 overflow-hidden relative group shrink-0">
                                        <img
                                            src={getCoverUrl(coverPreview)}
                                            alt="Cover preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "https://via.placeholder.com/150?text=Error";
                                            }}
                                        />
                                    </div>
                                )}

                                <label className={`
                                    flex-1 flex flex-col items-center justify-center py-6 px-4
                                    border border-dashed
                                    ${errors.cover ? 'border-red-500' : 'border-white/20'}
                                    hover:border-primary/60 transition-colors duration-300
                                    cursor-pointer text-center
                                `}>
                                    <span className="text-xs uppercase tracking-wider text-white/70">
                                        {coverFile ? coverFile.name : "Choose an image file..."}
                                    </span>
                                    <span className="text-[10px] text-white/40 mt-1 uppercase">
                                        PNG, JPG, WEBP (MAX 2MB)
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {errors.cover && (
                                <p className="text-red-400 text-xs mt-1">{errors.cover}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                className="
                                    min-w-[160px] min-h-[44px]
                                    flex items-center justify-center gap-2
                                    px-8 py-3
                                    border border-primary
                                    bg-primary text-secondary
                                    text-xs uppercase tracking-[0.2em] font-medium
                                    transition-all duration-300
                                    hover:bg-transparent hover:text-primary
                                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-secondary
                                "
                            >
                                {submitting ? (
                                    <>
                                        <AudioLoader height={20} width={20} color="#000000" />
                                        <span className="text-[10px] tracking-widest">LOADING...</span>
                                    </>
                                ) : isEditing ? (
                                    "Update Album"
                                ) : (
                                    "Save Album"
                                )}
                            </button>

                            <Link
                                to="/admin/albums"
                                className="
                                    px-6 py-3
                                    border border-white/20
                                    text-white/70 text-xs uppercase tracking-[0.2em]
                                    transition-all duration-300
                                    hover:border-white hover:text-white cursor-pointer
                                "
                            >
                                Back to list
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAlbumPage;