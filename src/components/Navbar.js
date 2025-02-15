import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolling
          ? "bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Fixed Solid Neon Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-cyan-400 drop-shadow-lg"
        >
          ✨ Data Center Platform ✨
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg font-semibold text-white">
          <li>
            <Link
              to="/resume"
              className="relative transition-all duration-300 hover:text-cyan-400 hover:after:w-full after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 after:transition-all after:duration-300"
            >
              Resume
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cyan-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900/90 backdrop-blur-xl shadow-2xl transition-transform duration-500 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <button
          className="absolute top-5 right-5 text-cyan-400"
          onClick={() => setIsOpen(false)}
        >
          <X size={32} />
        </button>
        <ul className="flex flex-col items-center justify-center h-full space-y-8 text-xl text-white font-semibold">
          <li>
            <Link
              to="/resume"
              className="hover:text-cyan-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Resume
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
