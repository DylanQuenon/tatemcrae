// src/components/navbar/AdminNavbar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import authAPI from "../../services/authAPI";
import AuthContext from "../../contexts/AuthContext";

const AdminNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: "Dashboard", path: "/admin" },
        { name: "Home", path: "/" },
        { name: "News", path: "/news" },
    ];

    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
    };

    return (
        <nav className="fixed left-0 top-0 z-50 w-full border-b border-blue-800/50 bg-secondary/80 text-white backdrop-blur-xl">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


                {/* Branding */}
                <NavLink
                    to="/admin"
                    className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white"
                >
                    <span>
                        TATE{" "}
                        <span className="text-secondary [-webkit-text-stroke:1px_white]">
                            MCRAE
                        </span>
                    </span>

                    <span className="rounded-full border border-blue-400/30 bg-blue-900/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                        Admin
                    </span>
                </NavLink>



                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">

                    <ul className="flex items-center gap-8">

                        {links.map((link) => (
                            <li key={link.path}>

                                <NavLink
                                    to={link.path}
                                    end={link.path === "/admin"}
                                    className={({ isActive }) =>
                                        `relative text-sm font-medium transition-all duration-300 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-blue-300 after:transition-all ${
                                            isActive
                                                ? "text-white after:w-full"
                                                : "text-blue-100/60 after:w-0 hover:text-white hover:after:w-full"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>

                            </li>
                        ))}

                    </ul>


                    <div className="h-6 w-px bg-blue-700/50" />


                    <button
                        onClick={handleLogout}
                        className="cursor-pointer rounded-lg border border-blue-700/50 bg-blue-900/20 px-4 py-2 text-sm font-medium text-blue-100 transition-all duration-300 hover:border-blue-400/50 hover:bg-blue-800/40 hover:text-white"
                    >
                        Logout
                    </button>

                </div>



                {/* Burger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer flex flex-col gap-1.5 md:hidden"
                >
                    <span className="h-0.5 w-6 bg-white"></span>
                    <span className="h-0.5 w-6 bg-white"></span>
                    <span className="h-0.5 w-6 bg-white"></span>
                </button>

            </div>



            {/* Mobile Menu */}
            {isOpen && (
                <div className="border-t border-blue-800/50 bg-secondary/95 px-6 py-6 backdrop-blur-xl md:hidden">

                    <ul className="flex flex-col gap-5">

                        {links.map((link) => (
                            <li key={link.path}>

                                <NavLink
                                    to={link.path}
                                    end={link.path === "/admin"}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-white"
                                            : "text-blue-100/60 hover:text-white"
                                    }
                                >
                                    {link.name}
                                </NavLink>

                            </li>
                        ))}


                        <li>
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer rounded-lg border border-blue-700/50 bg-blue-900/20 px-4 py-2 text-sm font-medium text-blue-100"
                            >
                                Logout
                            </button>
                        </li>

                    </ul>

                </div>
            )}

        </nav>
    );
};

export default AdminNavbar;