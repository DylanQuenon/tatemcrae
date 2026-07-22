import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Field from '../../../components/forms/Field';
import galleriesAPI from '../../../services/galleriesAPI';
import mediaObjectsAPI from '../../../services/mediaObjectsAPI';
import AudioLoader from '../../../components/loaders/AudioLoader';
import { SERVER_URL } from '../../../config';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const gallerySchema = z.object({
    title: z
        .string()
        .min(1, "Gallery title is required and can't be empty."),
    description: z
        .string()
        .optional(),
    imageFile: z
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

const AdminGalleryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id && id !== "new");

    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageIri, setExistingImageIri] = useState(null);

    // Initialize React Hook Form with Zod validation.
    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors, isValid, isSubmitting }
    } = useForm({
        resolver: zodResolver(gallerySchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            imageFile: null
        }
    });

    const watchImageFile = watch("imageFile");

    // Build the full URL used to display the image preview.
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${SERVER_URL}${url}`;
    };

    // Load the gallery data when editing an existing item.
    useEffect(() => {
        if (!isEditing) return;

        const loadGallery = async () => {
            try {
                const data = await galleriesAPI.find(id);
                const { title, name, description, image, mediaObject } = data || {};

                // Handles both 'title' or 'name' property depending on your API structure
                const galleryTitle = title || name || "";

                reset({
                    title: galleryTitle,
                    description: description ?? ""
                });

                // Handles cover/image field structure from API Platform
                const targetImage = image || mediaObject;

                if (targetImage) {
                    const imageIri =
                        typeof targetImage === 'object'
                            ? targetImage['@id'] || targetImage.contentUrl
                            : targetImage;

                    setExistingImageIri(imageIri);

                    if (typeof targetImage === 'object' && targetImage.contentUrl) {
                        setImagePreview(getImageUrl(targetImage.contentUrl));
                    }
                }
            } catch (error) {
                console.error("Error loading gallery item:", error);
                toast.error("Unable to load gallery item");
                navigate("/admin/galleries", { replace: true });
            }
        };

        loadGallery();
    }, [id, isEditing, reset, navigate]);

    // Generate a temporary preview URL when a new image is selected.
    useEffect(() => {
        if (watchImageFile && watchImageFile.length > 0) {
            const file = watchImageFile[0];
            const objectUrl = URL.createObjectURL(file);

            setImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [watchImageFile]);

    // Handle form submission.
    const onSubmit = async (data) => {
        const selectedFile = data.imageFile && data.imageFile[0];

        // An image is required when creating a new gallery item.
        if (!isEditing && !selectedFile) {
            setError("imageFile", {
                type: "manual",
                message: "Gallery image is required and can't be empty."
            });

            return;
        }

        let imageIri = existingImageIri;

        // Step 1: Upload the selected image as a MediaObject.
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const mediaObject = await mediaObjectsAPI.create(formData);

                imageIri =
                    mediaObject['@id'] ||
                    `/api/media_objects/${mediaObject.id}`;
            } catch (mediaError) {
                console.error("Error uploading image:", mediaError);

                const violations = mediaError.response?.data?.violations;

                if (violations && Array.isArray(violations)) {
                    violations.forEach(({ propertyPath, message }) => {
                        setError(
                            propertyPath === 'file'
                                ? 'imageFile'
                                : propertyPath,
                            { message }
                        );
                    });
                } else {
                    setError("imageFile", {
                        message: "Failed to upload image to server."
                    });
                }

                toast.error("Image upload failed.");
                return;
            }
        }

        // Step 2: Send the gallery payload to API Platform.
        try {
            const galleryPayload = {
                title: data.title,
                description: data.description,
                image: imageIri
            };

            if (isEditing) {
                await galleriesAPI.update(id, galleryPayload);
                toast.success("Gallery item updated successfully");
            } else {
                await galleriesAPI.create(galleryPayload);
                toast.success("Gallery item created successfully");
            }

            navigate("/admin/galleries", { replace: true });
        } catch (galleryError) {
            console.error("API Error Response:", galleryError.response);

            // Map API Platform 422 validation errors to React Hook Form fields.
            const violations = galleryError.response?.data?.violations;

            if (violations && Array.isArray(violations)) {
                violations.forEach(({ propertyPath, message }) => {
                    const fieldName =
                        propertyPath === 'image'
                            ? 'imageFile'
                            : propertyPath;

                    setError(fieldName, { message });
                });

                toast.error("Please fix the errors in the form.");
            } else {
                toast.error(
                    galleryError.response?.data?.['hydra:description'] ||
                    "An error occurred while saving the gallery item."
                );
            }
        }
    };

    // Disable submission when the form is invalid or no image is selected during creation.
    const isFileMissingInCreate =
        !isEditing &&
        (!watchImageFile || watchImageFile.length === 0);

    const isSubmitDisabled =
        isSubmitting ||
        !isValid ||
        isFileMissingInCreate;

    return (
        <div className="min-h-screen bg-secondary text-white px-6 py-10">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        Management
                    </span>

                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        {!isEditing ? "Create Gallery Item" : "Edit Gallery Item"}
                    </h1>
                </div>

                <div className="p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                        noValidate
                    >
                        {/* Gallery Title */}
                        <Field
                            label="TITLE *"
                            placeholder="E.G. CONCERT PHOTO 2024..."
                            {...register("title")}
                            error={errors.title?.message}
                        />

                        {/* Description */}
                        <Field
                            label="DESCRIPTION"
                            type="textarea"
                            placeholder="ENTER GALLERY DESCRIPTION..."
                            rows={4}
                            {...register("description")}
                            error={errors.description?.message}
                        />

                        {/* Gallery Image */}
                        <div className="space-y-3">
                            <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                                IMAGE (MEDIA OBJECT) *
                            </label>

                            <div className="flex items-center gap-6">
                                {imagePreview && (
                                    <div className="w-20 h-20 border border-white/20 overflow-hidden relative group shrink-0">
                                        <img
                                            src={getImageUrl(imagePreview)}
                                            alt="Preview"
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
                                        ${errors.imageFile
                                            ? 'border-red-500'
                                            : 'border-white/20'}
                                        hover:border-primary/60 transition-colors duration-300
                                        cursor-pointer text-center
                                    `}
                                >
                                    <span className="text-xs uppercase tracking-wider text-white/70">
                                        {watchImageFile && watchImageFile[0]
                                            ? watchImageFile[0].name
                                            : "Choose an image file..."}
                                    </span>

                                    <span className="text-[10px] text-white/40 mt-1 uppercase">
                                        PNG, JPG, WEBP (MAX 2MB)
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                        {...register("imageFile")}
                                    />
                                </label>
                            </div>

                            {errors.imageFile && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.imageFile.message}
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
                                    "Update Item"
                                ) : (
                                    "Save Item"
                                )}
                            </button>

                            <Link
                                to="/admin/galleries"
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

export default AdminGalleryPage;