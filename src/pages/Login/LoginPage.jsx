// src/pages/Login/LoginPage.jsx

import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import authAPI from "../../services/authAPI";
import Field from "../../components/forms/Field";
import AuthContext from "../../contexts/AuthContext";


const LoginPage = () => {
    const navigate = useNavigate();

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");

    // redirecting if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }


    const handleChange = ({ currentTarget }) => {
        setCredentials({
            ...credentials,
            [currentTarget.name]: currentTarget.value,
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await authAPI.authenticate(credentials);

            setError("");
            setIsAuthenticated(true);

            toast.success("Welcome back!");

            navigate("/admin", { replace: true });

        } catch {
            setError("Invalid email address or password.");
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary px-6">

            <div className="w-full max-w-md rounded-3xl border border-blue-800/50 bg-blue-950/20 p-10 shadow-xl shadow-blue-950/30 backdrop-blur-xl">

                {/* Brand */}
                <div className="mb-10 flex flex-col items-center">

                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-900/50 text-2xl font-bold text-white shadow-lg"> T</div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>

                    <p className="mt-2 text-center text-sm text-blue-100/70">Sign in to access your administration dashboard.</p>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <Field
                        label="Email address"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="admin@example.com"
                    />

                    <Field
                        label="Password"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />

                    <button type="submit" className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-blue-400/30 bg-blue-800/50 font-semibold text-white transition-all duration-300 hover:bg-blue-700/60 hover:shadow-lg hover:shadow-blue-900/40 active:scale-[0.98]">
                        Sign in
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-blue-100/50">
                    Protected administration area
                </p>


            </div>

        </div>
    );
};


export default LoginPage;