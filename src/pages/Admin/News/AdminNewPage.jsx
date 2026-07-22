import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const newSchema= z.object({
    title:z
    .string()
    .min(1, "Title is required and can't be empty."),
    subtitle:z
    .string()
    .min(1, "Subtitle is required and can't be empty."),
    content:z
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
    
    


})

const AdminNewPage = () => {
    // edit versus new
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditing= Boolean(id && id !== "new");
    // pictures
    const [coverPreview, setCoverPreview] = useState(null);
    const [existingCoverIri, setExistingCoverIri] = useState(null);

    // form
    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: {errors, isValid, isSubmitting}
    } = useForm({
        resolver: zodResolver(newSchema),
        mode:"onChange",
        defaultValues: {
            title: "",
            subtitle: "",
            content: "",
            coverFile: null
        }
    });

    return (
        <div className="py-24 bg-secondary">
            <h1>{isEditing ? "Edit news" : "Add News"}</h1>
          
        </div>
    )
}

export default AdminNewPage