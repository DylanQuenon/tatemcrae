import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Field from '../../../components/forms/Field';
import newsAPI from '../../../services/newsAPI';
import mediaObjectsAPI from '../../../services/mediaObjectsAPI';
import AudioLoader from '../../../components/loaders/AudioLoader';
import { SERVER_URL } from '../../../config';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const newSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required and can't be empty."),
    subtitle: z
        .string()
        .min(1, "Subtitle is required and can't be empty."),
    content: z
        .string()
        .min(50, "Content is required and must be at least 50 characters long."),
    coverFile: z
        .any()
        .optional()
        .refine(
            (files) =>
                !files ||
                files.length === 0 ||
                files[0]?.size <= MAX_FILE_SIZE,
            "The image exceeds the maximum allowed size (2 MB)."
        )
        .refine(
            (files) =>
                !files ||
                files.length === 0 ||
                ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
            "Only .jpg, .png and .webp formats are supported."
        )
});

const AdminNewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id && id !== "new");

    const [coverPreview, setCoverPreview] = useState(null);
    const [existingCoverIri, setExistingCoverIri] = useState(null);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors, isValid, isSubmitting, dirtyFields }
    } = useForm({
        resolver: zodResolver(newSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            subtitle: "",
            content: "",
            coverFile: null
        }
    });

    const watchCoverFile = watch("coverFile");

    // Formate l'URL pour l'aperçu de l'image
    const getCoverUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${SERVER_URL}${url}`;
    };

    // Chargement de la news en mode édition
    useEffect(() => {
        if (!isEditing) return;

        const loadNews = async () => {
            try {
                const newsData = await newsAPI.find(id);
                const { title, subtitle, content, cover } = newsData || {};

                reset({
                    title: title ?? "",
                    subtitle: subtitle ?? "",
                    content: content ?? "",
                    coverFile: null
                });

                if (cover) {
                    const coverIri =
                        typeof cover === 'object'
                            ? cover['@id'] || cover.contentUrl
                            : cover;

                    setExistingCoverIri(coverIri);

                    if (typeof cover === 'object' && cover.contentUrl) {
                        setCoverPreview(getCoverUrl(cover.contentUrl));
                    }
                }
            } catch (error) {
                console.error("Error loading news:", error);
                toast.error("Unable to load news");
                navigate("/admin/news", { replace: true });
            }
        };

        loadNews();
    }, [id, isEditing, reset, navigate]);

    // Aperçu dynamique de l'image sélectionnée
    useEffect(() => {
        if (watchCoverFile && watchCoverFile.length > 0) {
            const file = watchCoverFile[0];
            const objectUrl = URL.createObjectURL(file);

            setCoverPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [watchCoverFile]);

    // Soumission du formulaire
    const onSubmit = async (data) => {
        const selectedFile = data.coverFile && data.coverFile[0];
        let coverIri = existingCoverIri;

        // 1. Upload du fichier image si modifié
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const mediaObject = await mediaObjectsAPI.create(formData);

                coverIri =
                    mediaObject['@id'] ||
                    `/api/media_objects/${mediaObject.id}`;
            } catch (mediaError) {
                console.error("Error uploading image:", mediaError);

                const violations = mediaError.response?.data?.violations;

                if (violations && Array.isArray(violations)) {
                    violations.forEach(({ propertyPath, message }) => {
                        setError(
                            propertyPath === 'file'
                                ? 'coverFile'
                                : propertyPath,
                            { message }
                        );
                    });
                } else {
                    setError("coverFile", {
                        message: "Failed to upload image to server."
                    });
                }

                toast.error("Image upload failed.");
                return;
            }
        }

        // 2. Préparation et envoi du payload (sans champ date inutile)
        try {
            if (isEditing) {
                const newsPayload = {
                    subtitle: data.subtitle,
                    content: data.content,
                    cover: coverIri || null
                };

                // N'envoie 'title' QUE s'il a été changé au clavier
                if (dirtyFields.title) {
                    newsPayload.title = data.title;
                }

                await newsAPI.update(id, newsPayload);
                toast.success("News updated successfully");
            } else {
                const newsPayload = {
                    title: data.title,
                    subtitle: data.subtitle,
                    content: data.content,
                    cover: coverIri || null
                };

                await newsAPI.create(newsPayload);
                toast.success("News created successfully");
            }

            navigate("/admin/news", { replace: true });
        } catch (newsError) {
            console.error("API Error Response:", newsError.response);

            const violations = newsError.response?.data?.violations;

            if (violations && Array.isArray(violations)) {
                violations.forEach(({ propertyPath, message }) => {
                    const fieldName =
                        propertyPath === 'cover'
                            ? 'coverFile'
                            : propertyPath;

                    setError(fieldName, { message });
                });

                toast.error("Please fix the errors in the form.");
            } else {
                toast.error(
                    newsError.response?.data?.['hydra:description'] ||
                    "An error occurred while saving the news."
                );
            }
        }
    };

    const isSubmitDisabled = isSubmitting || !isValid;

    return (
        <div className="min-h-screen bg-secondary text-white px-6 py-10">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        Management
                    </span>

                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        {!isEditing ? "Create News" : "Edit News"}
                    </h1>
                </div>

                <div className="p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                        noValidate
                    >
                        {/* Title */}
                        <Field
                            label="TITLE *"
                            placeholder="ENTER NEWS TITLE..."
                            {...register("title")}
                            error={errors.title?.message}
                        />

                        {/* Subtitle */}
                        <Field
                            label="SUBTITLE *"
                            placeholder="ENTER NEWS SUBTITLE..."
                            {...register("subtitle")}
                            error={errors.subtitle?.message}
                        />

                        {/* Content */}
                        <Field
                            label="CONTENT *"
                            type="textarea"
                            placeholder="ENTER NEWS CONTENT..."
                            rows={6}
                            {...register("content")}
                            error={errors.content?.message}
                        />

                        {/* Cover Image */}
                        <div className="space-y-3">
                            <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                                COVER IMAGE (MEDIA OBJECT)
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
                                                e.currentTarget.src =
                                                    "https://via.placeholder.com/150?text=Error";
                                            }}
                                        />
                                    </div>
                                )}

                                <label
                                    className={`
                                        flex-1 flex flex-col items-center justify-center py-6 px-4
                                        border border-dashed
                                        ${errors.coverFile
                                            ? 'border-red-500'
                                            : 'border-white/20'}
                                        hover:border-primary/60 transition-colors duration-300
                                        cursor-pointer text-center
                                    `}
                                >
                                    <span className="text-xs uppercase tracking-wider text-white/70">
                                        {watchCoverFile && watchCoverFile[0]
                                            ? watchCoverFile[0].name
                                            : "Choose an image file..."}
                                    </span>

                                    <span className="text-[10px] text-white/40 mt-1 uppercase">
                                        PNG, JPG, WEBP (MAX 2MB)
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                        {...register("coverFile")}
                                    />
                                </label>
                            </div>

                            {errors.coverFile && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.coverFile.message}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                className="
                                    min-w-40 min-h-11
                                    flex items-center justify-center gap-2
                                    px-8 py-3
                                    border border-primary
                                    bg-primary text-secondary
                                    text-xs uppercase tracking-[0.2em] font-medium
                                    transition-all duration-300
                                    hover:bg-transparent hover:text-primary
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    disabled:hover:bg-primary disabled:hover:text-secondary
                                "
                            >
                                {isSubmitting ? (
                                    <>
                                        <AudioLoader
                                            height={20}
                                            width={20}
                                            color="#000000"
                                        />

                                        <span className="text-[10px] tracking-widest">
                                            LOADING...
                                        </span>
                                    </>
                                ) : isEditing ? (
                                    "Update News"
                                ) : (
                                    "Save News"
                                )}
                            </button>

                            <Link
                                to="/admin/news"
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

export default AdminNewPage;