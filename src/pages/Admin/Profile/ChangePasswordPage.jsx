import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Field from '../../../components/forms/Field';
import AudioLoader from '../../../components/loaders/AudioLoader';
import authAPI from '../../../services/AuthAPI';
import AuthContext from '../../../contexts/AuthContext';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    // Set browser document title on mount
    useEffect(() => {
        document.title = "Change Password | Admin";
    }, []);

    const [submitting, setSubmitting] = useState(false);

    // Form input states
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Form field error messages
    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Toggle visibility states for each password field
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    // Toggle password visibility mode (text vs password type)
    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Update form input values dynamically
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setPasswords({ ...passwords, [name]: value });
    };

    // Handle form submission and server API interaction
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        // Client-side confirmation check
        if (passwords.newPassword !== passwords.confirmPassword) {
            setErrors({
                confirmPassword: "NEW PASSWORDS DO NOT MATCH"
            });
            return;
        }

        setSubmitting(true);

        try {
            // Call API Platform custom processor endpoint
            await authAPI.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            toast.success("Password changed successfully. Please login again.");

            // 1. Suppression du token
            if (authAPI.logout) {
                authAPI.logout();
            }

            // 2. Mise à jour du Context en temps réel (déconnexion instantanée)
            if (setIsAuthenticated) {
                setIsAuthenticated(false);
            }

            // 3. Redirection vers la page de connexion
            navigate('/login', { replace: true });
        } catch (error) {
            const response = error.response;
            const data = response?.data;

            // Handle API Platform validation violations or custom HTTP exceptions
            if (data?.violations && Array.isArray(data.violations)) {
                const apiErrors = {};
                data.violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            } else if (data?.detail) {
                // Catch thrown BadRequestHttpException messages
                if (data.detail.includes("current password")) {
                    setErrors({ currentPassword: data.detail });
                } else {
                    toast.error(data.detail);
                }
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-32 bg-secondary text-white px-6 font-['Unison_Pro',sans-serif]">
            <div className="max-w-2xl mx-auto">

                {/* Page Header */}
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary block">
                        SECURITY
                    </span>
                    <h1 className="mt-2 text-4xl font-medium uppercase italic bg-tertiary bg-clip-text text-transparent">
                        Change Password
                    </h1>
                </div>

                {/* Form Card Container */}
                <div className="p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Current Password Field */}
                        <div className="relative">
                            <Field
                                type={showPasswords.currentPassword ? "text" : "password"}
                                name="currentPassword"
                                label="CURRENT PASSWORD"
                                placeholder="••••••••••••"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                error={errors.currentPassword}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("currentPassword")}
                                className="absolute right-3 top-9 text-[10px] tracking-[0.2em] text-white/50 hover:text-primary transition-colors duration-300 uppercase cursor-pointer"
                            >
                                {showPasswords.currentPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>

                        {/* New Password Field */}
                        <div className="relative">
                            <Field
                                type={showPasswords.newPassword ? "text" : "password"}
                                name="newPassword"
                                label="NEW PASSWORD"
                                placeholder="••••••••••••"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                error={errors.newPassword}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("newPassword")}
                                className="absolute right-3 top-9 text-[10px] tracking-[0.2em] text-white/50 hover:text-primary transition-colors duration-300 uppercase cursor-pointer"
                            >
                                {showPasswords.newPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>

                        {/* Confirm New Password Field */}
                        <div className="relative">
                            <Field
                                type={showPasswords.confirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                label="CONFIRM NEW PASSWORD"
                                placeholder="••••••••••••"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirmPassword")}
                                className="absolute right-3 top-9 text-[10px] tracking-[0.2em] text-white/50 hover:text-primary transition-colors duration-300 uppercase cursor-pointer"
                            >
                                {showPasswords.confirmPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>

                        {/* Form Action Buttons */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="
                                    min-w-[180px] min-h-[44px]
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
                                ) : (
                                    "Update Password"
                                )}
                            </button>

                            <Link
                                to="/admin"
                                className="
                                    px-6 py-3
                                    border border-white/20
                                    text-white/70 text-xs uppercase tracking-[0.2em]
                                    transition-all duration-300
                                    hover:border-white hover:text-white cursor-pointer
                                "
                            >
                                Dashboard
                            </Link>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ChangePasswordPage;