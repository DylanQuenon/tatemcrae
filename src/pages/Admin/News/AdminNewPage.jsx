import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import newsAPI from "../../../services/newsAPI";
import { toast } from "react-toastify";
import { SERVER_URL } from "../../../config";

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
    // edit versus new
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id && id !== "new");
    
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
        formState: { errors, isValid, isSubmitting }
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

    // watch cover file
    const watchCoverFile = watch("coverFile");

    // Helper pour générer l'URL complète de l'image
    const getCoverUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("blob:")) return url;
        return `${SERVER_URL}${url}`;
    };

    // ÉTAPE 3 : Chargement des données en mode édition
    useEffect(() => {
        if (!isEditing) return;

        const loadNews = async () => {
            try {
                // ⚠️ AJOUT DE AWAIT ICI
                const newsData = await newsAPI.find(id);
                console.log("newsData récupéré :", newsData);

                const { title, subtitle, content, cover } = newsData || {};

                reset({
                    title: title ?? "",
                    subtitle: subtitle ?? "",
                    content: content ?? "",
                    coverFile: null
                });

                if (cover) {
                    const coverIri = typeof cover === 'object' ? cover['@id'] : cover;
                    setExistingCoverIri(coverIri);

                    if (typeof cover === 'object' && cover.contentUrl) {
                        // Utilisation du helper avec SERVER_URL pour le serveur backend
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
    }, [id, isEditing, navigate, reset]);

    // ÉTAPE 4 : Aperçu temporaire quand un NOUVEAU fichier est choisi
    useEffect(() => {
        if (watchCoverFile && watchCoverFile.length > 0) {
            const file = watchCoverFile[0];
            const objectUrl = URL.createObjectURL(file);
            setCoverPreview(objectUrl);

            // Clean-up mémoire
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [watchCoverFile]);

    return (
        <div className="py-24 bg-secondary">
            <h1>{isEditing ? "Edit news" : "Add News"}</h1>

            {/* 🧪 ZONE DE TEST ÉTAPE 4 */}
            <div style={{ border: '2px dashed #ccc', padding: '15px', margin: '20px 0' }}>
                <h3>Test de l'Étape 4 (Prévisualisation) :</h3>

                <input
                    type="file"
                    accept="image/*"
                    {...register("coverFile")}
                />

                <div style={{ marginTop: '15px' }}>
                    <p><strong>Aperçu :</strong></p>
                    {coverPreview ? (
                        <img
                            src={coverPreview}
                            alt="Aperçu"
                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                    ) : (
                        <p style={{ color: '#888' }}>Aucune image à afficher</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNewPage;