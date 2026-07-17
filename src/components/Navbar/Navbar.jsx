import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  })

  const links = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: "Gallery", path: "/gallery" },
    { name: "Merch", path: "https://tatemcrae.store/", isExternal: true },
  ];

  // styling links
  const linkStyles = ({ isActive }) =>
    `rounded-full px-4 text-center py-2 transition-all duration-300 hover:bg-primary/20 border hover:border-primary/20 ${
      isActive
        ? "bg-primary text-secondary border-primary/20"
        : "bg-transparent border-transparent"
    }`;

  // Shared classes for external links
  const externalLinkStyles =
    "rounded-full px-4 text-center py-2 transition-all duration-300 hover:bg-primary/20 border border-transparent hover:border-primary/20 bg-transparent";

  return (
    <div className="w-full flex justify-center text-primary text-md">
      {/* Desktop Navbar */}
      <nav className="max-md:hidden z-[9999] fixed top-5 py-6 px-6 flex justify-center rounded-full bg-[rgba(41,69,106,0.5)] border border-primary backdrop-blur-lg z-50">
        <ul className="flex justify-center gap-4">
          {links.map((link) => (
            <li key={link.name}>
              {link.isExternal ? (
                <a
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={externalLinkStyles}
                >
                  {link.name}
                </a>
              ) : (
                <NavLink to={link.path} className={linkStyles}>
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Burger Button (Mobile) */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer fixed top-6 right-5 flex flex-col justify-center gap-3 md:hidden z-50 p-2"
          aria-label="Toggle menu"
        >
        
          <span
            className={`h-[0.5px] w-10 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-[12.5px]" : ""
            }`}
          ></span>
          <span
            className={`h-[0.5px] w-10 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-0 scale-x-0" : ""
            }`}
          ></span>
          <span
            className={`h-[0.5px] w-10 bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-[12.5px]" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* 3. Mobile Menu Overlay) */}
      <div
        className={`fixed inset-0 bg-secondary/30 border-l border-primary/10 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 z-40 md:hidden ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
   
        <ul className="flex flex-col gap-6 w-3/4 max-w-[260px]">
          {links.map((link) => (
            <li key={link.name} className="w-full">
              {link.isExternal ? (
                <a
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`${externalLinkStyles} block text-lg py-3`}
                >
                  {link.name}
                </a>
              ) : (
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={(navState) => `${linkStyles(navState)} block text-lg py-3`}
                >
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;