import { NavLink } from "react-router-dom";

const Navbar = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 text-white backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink 
          to="/" 
          className="text-2xl font-bold text-white tracking-wide"
        >
          My<span className="text-purple-500">Gallery</span>
        </NavLink>

        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition duration-300
                  ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-white"
                  }
                  after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:bg-purple-500 after:transition-all
                  ${
                    isActive
                      ? "after:w-full"
                      : "after:w-0 hover:after:w-full"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;