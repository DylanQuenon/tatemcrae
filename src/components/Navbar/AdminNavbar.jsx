// src/components/navbar/AdminNavbar.jsx

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";

import authAPI from "../../services/authAPI";
import AuthContext from "../../contexts/AuthContext";

const AdminNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    // Primary navigation links displayed directly on desktop
    const primaryLinks = [
        { name: "Dashboard", path: "/admin" },
        { name: "News", path: "/admin/news" },
        { name: "Albums", path: "/admin/albums" },
        { name: "Galleries", path: "/admin/galleries" },
        { name: "Tags", path: "/admin/tags" },
    ];

    // Secondary navigation links grouped under the "More" dropdown menu
    const secondaryLinks = [
        { name: "Subscribers", path: "/admin/subscribers" },
        { name: "Newsletter", path: "/admin/newsletter" },
        { name: "Change Password", path: "/admin/change-password" },
    ];

    // All links combined for the mobile menu
    const allLinks = [...primaryLinks, ...secondaryLinks];

    // Highlight "More" button when any secondary route is active
    const isSecondaryActive = secondaryLinks.some((link) =>
        location.pathname === link.path
    );

    // Close the dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle user logout
    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
    };

    return (
        <nav className="fixed left-0 top-0 z-50 w-full border-b border-blue-800/50 bg-secondary/80 text-white backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Branding Logo */}
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
                <div className="hidden items-center gap-6 md:flex">
                    <ul className="flex items-center gap-6">
                        {/* Primary Navigation Links */}
                        {primaryLinks.map((link) => (
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

                        {/* Secondary Dropdown Navigation */}
                        <li className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
                                    isSecondaryActive
                                        ? "text-white"
                                        : "text-blue-100/60 hover:text-white"
                                }`}
                            >
                                <span>More</span>
                                <svg
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        isDropdownOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown Menu Overlay */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-52 rounded-xl border border-blue-800/50 bg-secondary/95 py-2 shadow-2xl backdrop-blur-xl">
                                    {secondaryLinks.map((link) => (
                                        <NavLink
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className={({ isActive }) =>
                                                `block px-4 py-2.5 text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? "bg-blue-900/40 text-white"
                                                        : "text-blue-100/70 hover:bg-blue-900/20 hover:text-white"
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </li>
                    </ul>

                    {/* Divider */}
                    <div className="h-6 w-px bg-blue-700/50" />

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="cursor-pointer rounded-lg border border-blue-700/50 bg-blue-900/20 px-4 py-2 text-sm font-medium text-blue-100 transition-all duration-300 hover:border-blue-400/50 hover:bg-blue-800/40 hover:text-white"
                    >
                        Logout
                    </button>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer flex flex-col gap-1.5 md:hidden"
                    aria-label="Toggle navigation menu"
                >
                    <span
                        className={`h-0.5 w-6 bg-white transition-transform duration-300 ${
                            isOpen ? "translate-y-2 rotate-45" : ""
                        }`}
                    />
                    <span
                        className={`h-0.5 w-6 bg-white transition-opacity duration-300 ${
                            isOpen ? "opacity-0" : ""
                        }`}
                    />
                    <span
                        className={`h-0.5 w-6 bg-white transition-transform duration-300 ${
                            isOpen ? "-translate-y-2 -rotate-45" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="border-t border-blue-800/50 bg-secondary/95 px-6 py-6 backdrop-blur-xl md:hidden">
                    <ul className="flex flex-col gap-4">
                        {allLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    end={link.path === "/admin"}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block text-base font-medium transition-colors ${
                                            isActive
                                                ? "text-white"
                                                : "text-blue-100/60 hover:text-white"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}

                        <li className="pt-2">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full cursor-pointer rounded-lg border border-blue-700/50 bg-blue-900/20 px-4 py-2.5 text-center text-sm font-medium text-blue-100 transition-colors hover:bg-blue-800/40 hover:text-white"
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