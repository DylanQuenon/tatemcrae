// src/pages/admin/AdminAlbumPage.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Field from '../../../components/forms/Field';
import AlbumsAPI from '../../../services/AlbumsAPI';
import mediaObjectsAPI from '../../../services/mediaObjectsAPI';
import AudioLoader from '../../../components/loaders/AudioLoader';
import { SERVER_URL } from '../../../config';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const albumSchema = z.object({
    name: z
        .string()
        .min(1, "Album name is required and can't be empty."),
    releasedAt: z
        .string()
        .min(1, "Release date is required and can't be empty."),
    description: z
        .string()
        .min(1, "Description is required and can't be empty."),
    streamUrl: z
        .string()
        .min(1, "Streaming URL is required and can't be empty.")
        .url("Streaming URL must be a valid URL (e.g. https://...)"),
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

const AdminAlbumPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id && id !== "new");

    const [coverPreview, setCoverPreview] = useState(null);
    const [existingCoverIri, setExistingCoverIri] = useState(null);

    // Initialize React Hook Form with Zod validation.
    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors, isValid, isSubmitting }
    } = useForm({
        resolver: zodResolver(albumSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            releasedAt: "",
            description: "",
            streamUrl: "",
            coverFile: null
        }
    });

    const watchCoverFile = watch("coverFile");

    // Build the full URL used to display the cover preview.
    const getCoverUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${SERVER_URL}${url}`;
    };

    // Load the album data when editing an existing album.
    useEffect(() => {
        if (!isEditing) return;

        const loadAlbum = async () => {
            try {
                const data = await AlbumsAPI.find(id);
                const { name, releasedAt, description, streamUrl, cover } = data || {};

                let formattedDate = "";

                if (releasedAt) {
                    formattedDate = new Date(releasedAt)
                        .toISOString()
                        .split('T')[0];
                }

                // Populate the form with the existing album data.
                reset({
                    name: name ?? "",
                    releasedAt: formattedDate,
                    description: description ?? "",
                    streamUrl: streamUrl ?? ""
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
                console.error("Error loading album:", error);
                toast.error("Unable to load album");
                navigate("/admin/albums", { replace: true });
            }
        };

        loadAlbum();
    }, [id, isEditing, reset, navigate]);

    // Generate a temporary preview URL when a new cover image is selected.
    useEffect(() => {
        if (watchCoverFile && watchCoverFile.length > 0) {
            const file = watchCoverFile[0];
            const objectUrl = URL.createObjectURL(file);

            setCoverPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [watchCoverFile]);

    // Handle form submission.
    const onSubmit = async (data) => {
        // A cover image is required when creating a new album.
        const selectedFile = data.coverFile && data.coverFile[0];

        if (!isEditing && !selectedFile) {
            setError("coverFile", {
                type: "manual",
                message: "Album cover is required and can't be empty."
            });

            return;
        }

        let coverIri = existingCoverIri;

        // Step 1: Upload the selected image as a MediaObject.
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

        // Step 2: Send the album data to the Symfony/API Platform API.
        try {
            const albumPayload = {
                name: data.name,
                releasedAt: data.releasedAt,
                description: data.description,
                streamUrl: data.streamUrl,
                cover: coverIri
            };

            if (isEditing) {
                await AlbumsAPI.update(id, albumPayload);
                toast.success("Album updated successfully");
            } else {
                await AlbumsAPI.create(albumPayload);
                toast.success("Album created successfully");
            }

            navigate("/admin/albums", { replace: true });
        } catch (albumError) {
            console.error("API Error Response:", albumError.response);

            // Map API Platform 422 validation errors to React Hook Form fields.
            const violations = albumError.response?.data?.violations;

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
                    albumError.response?.data?.['hydra:description'] ||
                    "An error occurred while saving the album."
                );
            }
        }
    };

    // Disable submission when the form is invalid or no cover is selected during creation.
    const isFileMissingInCreate =
        !isEditing &&
        (!watchCoverFile || watchCoverFile.length === 0);

    const isSubmitDisabled =
        isSubmitting ||
        !isValid ||
        isFileMissingInCreate;

    return (
        <div className="min-h-screen bg-secondary text-white px-6 py-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        Management
                    </span>

                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        {!isEditing ? "Create Album" : "Edit Album"}
                    </h1>
                </div>

                <div className="p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                        noValidate
                    >
                        {/* Album name */}
                        <Field
                            label="ALBUM NAME *"
                            placeholder="E.G. DARK SIDE OF THE MOON..."
                            {...register("name")}
                            error={errors.name?.message}
                        />

                        {/* Release date */}
                        <Field
                            label="RELEASE DATE *"
                            type="date"
                            {...register("releasedAt")}
                            error={errors.releasedAt?.message}
                        />

                        {/* Album description */}
                        <Field
                            label="DESCRIPTION *"
                            type="textarea"
                            placeholder="ENTER ALBUM DESCRIPTION..."
                            rows={4}
                            {...register("description")}
                            error={errors.description?.message}
                        />

                        {/* Streaming URL */}
                        <Field
                            label="STREAMING URL *"
                            placeholder="HTTPS://OPEN.SPOTIFY.COM/ALBUM/..."
                            {...register("streamUrl")}
                            error={errors.streamUrl?.message}
                        />

                        {/* Album cover image */}
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

                        {/* Form actions */}
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