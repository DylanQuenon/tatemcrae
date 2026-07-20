import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import Field from '../../../components/forms/Field';
import AudioLoader from '../../../components/loaders/AudioLoader';
import TagsAPI from '../../../services/TagsAPI';

const AdminTagPage = () => {
    const { id = "new" } = useParams();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [tag, setTag] = useState({ name: "" });
    const [errors, setErrors] = useState({ name: "" });

    const fetchTag = async (tagId) => {
        try {
            const data = await TagsAPI.find(tagId);
            const { name } = data || {};
            setTag({ name: name ?? "" });
        } catch (error) {
            console.error("Error loading tag:", error);
            toast.error("Unable to load tag");
            navigate("/admin/tags", { replace: true });
        }
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchTag(id);
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setSubmitting(true);

        try {
            if (editing) {
                await TagsAPI.update(id, tag);
                toast.success("Tag updated successfully");
            } else {
                await TagsAPI.create(tag);
                toast.success("Tag created successfully");
                navigate("/admin/tags", { replace: true });
            }
        } catch (error) {
            const response = error.response;
            const violations = response?.data?.violations;

            if (violations && Array.isArray(violations)) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setTag({ ...tag, [name]: value });
    };

    return (
        <div className="min-h-screen py-24 bg-secondary text-white px-6">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        Management
                    </span>
                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        {!editing ? "Create Tag" : "Edit Tag"}
                    </h1>
                </div>

                {/* Form Card */}
                <div className="p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Field
                            name="name"
                            label="TAG NAME"
                            placeholder="E.G. TECHNOLOGY, COOKING..."
                            value={tag.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="
                                    min-w-[150px] min-h-[44px]
                                    flex items-center justify-center gap-2
                                    px-8 py-3
                                    border border-primary
                                    bg-primary text-secondary
                                    text-xs uppercase tracking-[0.2em] font-medium
                                    transition-all duration-300
                                    hover:bg-transparent hover:text-primary
                                    disabled:opacity-50 cursor-pointer
                                "
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                      
                                        <AudioLoader width={20} height={20} />
                                       
                                        <span className="text-[10px] tracking-widest">LOADING...</span>
                                    </div>
                                ) : editing ? (
                                    "Update Tag"
                                ) : (
                                    "Save Tag"
                                )}
                            </button>

                            <Link
                                to="/admin/tags"
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

export default AdminTagPage;