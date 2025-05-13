import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { setTheme } from "../utils/themeUtils";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDarkMode(theme === "dark");
  }, []);

  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    setTheme(newTheme);
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-xl font-bold">
            Creator Dashboard
          </Link>
          <div className="hidden md:flex gap-4 items-center">
            {user && <Link to="/dashboard">Dashboard</Link>}
            {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-white dark:text-black hover:text-gray-300 dark:hover:text-gray-700"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
              >
                <FaUserCircle size={24} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg w-40 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/update-password"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Update Password
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/"
                className="hover:text-gray-300 dark:hover:text-gray-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-300 dark:hover:text-gray-700"
              >
                Register
              </Link>
            </>
          )}

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 px-4 space-y-2">
          {user && (
            <>
              <Link to="/dashboard" className="block hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/profile" className="block hover:text-gray-300">
                Profile
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="block hover:text-gray-300">
              Admin
            </Link>
          )}
          {!user && (
            <>
              <Link to="/" className="block hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="block hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
