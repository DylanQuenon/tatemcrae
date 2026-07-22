import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';

import Field from '../../../components/forms/Field';
import galleriesAPI from '../../../services/galleriesAPI';
import mediaObjectsAPI from '../../../services/mediaObjectsAPI';
import tagsAPI from '../../../services/tagsAPI';
import AudioLoader from '../../../components/loaders/AudioLoader';
import { SERVER_URL } from '../../../config';

// Maximum allowed image file size configuration (2 MB limit)
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for validating the gallery item form fields and constraints
const gallerySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters long.")
        .max(255, "Name cannot exceed 255 characters."),
    caption: z
        .string()
        .min(1, "Caption is required."),
    shootingUrl: z
        .string()
        .url("Invalid URL format.")
        .or(z.literal(""))
        .optional(),
    tags: z
        .array(
            z.object({
                label: z.string(),
                value: z.string()
            })
        )
        .min(1, "At least one tag is required."),
    imageFile: z
        .any()
        .optional()
        .refine(
            (files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
            "The image size exceeds 2 MB."
        )
        .refine(
            (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
            "Accepted formats: .jpg, .png, .webp"
        )
});

// Custom styles configuration for the CreatableSelect multi-tag dropdown component
const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#051e42',
        borderColor: state.isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
        padding: '2px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#ffffff'
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#051e42',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 50
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
        '&:active': {
            backgroundColor: '#ffffff'
        }
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid #ffffff'
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#ffffff'
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#ffffff',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ffffff',
            color: '#000000'
        }
    }),
    input: (base) => ({
        ...base,
        color: '#ffffff'
    }),
    placeholder: (base) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.4)'
    }),
    singleValue: (base) => ({
        ...base,
        color: '#ffffff'
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

const AdminGalleryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id && id !== "new");

    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageIri, setExistingImageIri] = useState(null);
    const [tagOptions, setTagOptions] = useState([]);
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setError,
        reset,
        watch,
        formState: { errors, isValid, isSubmitting }
    } = useForm({
        resolver: zodResolver(gallerySchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            caption: "",
            shootingUrl: "",
            tags: [],
            imageFile: null
        }
    });

    const watchImageFile = watch("imageFile");

    // Helper utility to resolve absolute media URLs based on environment configuration
    const getMediaUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${SERVER_URL}${url}`;
    };

    // Fetch and populate available tag options on component initialization
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagsData = await tagsAPI.findAll();
                const options = (tagsData || []).map((t) => ({
                    label: t.name,
                    value: t['@id'] || `/api/tags/${t.id}`
                }));
                setTagOptions(options);
            } catch (error) {
                console.error("Error loading tags:", error);
            }
        };

        fetchTags();
    }, []);

    // Fetch existing gallery item details if performing an update operation
    useEffect(() => {
        if (!isEditing) return;

        const loadGalleryItem = async () => {
            try {
                const data = await galleriesAPI.find(id);
                const { name, caption, shootingUrl, tag, image } = data || {};

                const selectedTags = Array.isArray(tag)
                    ? tag.map((t) => ({
                          label: typeof t === 'object' ? t.name : t,
                          value: typeof t === 'object' ? t['@id'] || `/api/tags/${t.id}` : t
                      }))
                    : [];

                reset({
                    name: name ?? "",
                    caption: caption ?? "",
                    shootingUrl: shootingUrl ?? "",
                    tags: selectedTags,
                    imageFile: null
                });

                if (image) {
                    const imageIri = typeof image === 'object' ? image['@id'] : image;
                    setExistingImageIri(imageIri);

                    if (typeof image === 'object' && image.contentUrl) {
                        setImagePreview(getMediaUrl(image.contentUrl));
                    }
                }
            } catch (error) {
                console.error("Loading error:", error);
                toast.error("Unable to load item data.");
                navigate("/admin/galleries", { replace: true });
            }
        };

        loadGalleryItem();
    }, [id, isEditing, reset, navigate]);

    // Generate and clean up local object URLs dynamically when a new image file is chosen
    useEffect(() => {
        if (watchImageFile && watchImageFile.length > 0) {
            const file = watchImageFile[0];
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [watchImageFile]);

    // Handle asynchronous inline creation of a brand new tag via CreatableSelect
    const handleCreateTag = async (inputValue, currentSelected, onChangeField) => {
        setIsCreatingTag(true);
        try {
            const newTag = await tagsAPI.create({ name: inputValue });
            const newIri = newTag['@id'] || `/api/tags/${newTag.id}`;
            const newOption = { label: newTag.name, value: newIri };

            setTagOptions((prev) => [...prev, newOption]);
            onChangeField([...(currentSelected || []), newOption]);

            toast.success(`Tag "${newTag.name}" successfully created!`);
        } catch (error) {
            console.error("Error creating tag:", error);
            toast.error("Unable to create tag.");
        } finally {
            setIsCreatingTag(false);
        }
    };

    // Handle form submission, managing media object uploads and database persistence
    const onSubmit = async (data) => {
        let imageIri = existingImageIri;

        const selectedFile = data.imageFile && data.imageFile[0];
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const mediaObject = await mediaObjectsAPI.create(formData);
                imageIri = mediaObject['@id'] || `/api/media_objects/${mediaObject.id}`;
            } catch (mediaError) {
                console.error("Image upload error:", mediaError);
                setError("imageFile", { message: "Failed to upload image." });
                return;
            }
        }

        if (!imageIri) {
            setError("imageFile", { message: "An image is required." });
            return;
        }

        const finalTagIris = (data.tags || []).map((t) => t.value);

        const payload = {
            name: data.name,
            caption: data.caption,
            shootingUrl: data.shootingUrl || null,
            tag: finalTagIris,
            image: imageIri
        };

        try {
            if (isEditing) {
                await galleriesAPI.update(id, payload);
                toast.success("Item updated successfully.");
            } else {
                await galleriesAPI.create(payload);
                toast.success("Item created successfully.");
            }

            navigate("/admin/galleries", { replace: true });
        } catch (apiError) {
            console.error("API Error:", apiError.response);
            toast.error("An error occurred while saving.");
        }
    };

    return (
        <div className="min-h-screen bg-[#051e42] text-white px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        Management
                    </span>
                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        {!isEditing ? "Create Gallery Item" : "Edit Gallery Item"}
                    </h1>
                </div>

                <div className="p-8 border border-white/10 bg-[#051e42]/50 backdrop-blur-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                        
                        <Field
                            label="NAME *"
                            placeholder="ENTER NAME..."
                            {...register("name")}
                            error={errors.name?.message}
                        />

                        <Field
                            label="CAPTION *"
                            placeholder="ENTER CAPTION..."
                            {...register("caption")}
                            error={errors.caption?.message}
                        />

                        <Field
                            label="SHOOTING URL (OPTIONAL)"
                            placeholder="HTTPS://..."
                            {...register("shootingUrl")}
                            error={errors.shootingUrl?.message}
                        />

                        <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                                TAGS *
                            </label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <CreatableSelect
                                        isMulti
                                        isDisabled={isCreatingTag}
                                        isLoading={isCreatingTag}
                                        options={tagOptions}
                                        value={value || []}
                                        styles={customSelectStyles}
                                        onChange={(selected) => onChange(selected || [])}
                                        onCreateOption={(inputValue) =>
                                            handleCreateTag(inputValue, value, onChange)
                                        }
                                        placeholder="Select or type a new tag..."
                                        formatCreateLabel={(inputValue) => `Create tag "${inputValue}"`}
                                    />
                                )}
                            />
                            {errors.tags && (
                                <p className="text-red-400 text-xs mt-1">{errors.tags.message}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs uppercase tracking-[0.2em] text-primary font-medium">
                                IMAGE *
                            </label>

                            <div className="flex items-center gap-6">
                                {imagePreview && (
                                    <div className="w-20 h-20 border border-white/20 overflow-hidden shrink-0">
                                        <img
                                            src={getMediaUrl(imagePreview)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <label className={`flex-1 flex flex-col items-center justify-center py-6 px-4 border border-dashed ${errors.imageFile ? 'border-red-500' : 'border-white/20'} cursor-pointer text-center`}>
                                    <span className="text-xs uppercase tracking-wider text-white/70">
                                        {watchImageFile && watchImageFile[0]
                                            ? watchImageFile[0].name
                                            : "Choose an image..."}
                                    </span>
                                    <span className="text-[10px] text-white/40 mt-1">
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
                                <p className="text-red-400 text-xs mt-1">{errors.imageFile.message}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                className="px-8 py-3 border border-primary bg-primary text-secondary text-xs uppercase tracking-[0.2em] font-medium transition-all hover:bg-transparent hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <AudioLoader height={20} width={20} color="#ffffff" />
                                ) : isEditing ? (
                                    "Update Item"
                                ) : (
                                    "Save Item"
                                )}
                            </button>

                            <Link
                                to="/admin/galleries"
                                className="px-6 py-3 border border-white/20 text-white/70 text-xs uppercase tracking-[0.2em] hover:border-white hover:text-white"
                            >
                                Back
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminGalleryPage;