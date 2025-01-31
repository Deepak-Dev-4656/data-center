import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-xl font-bold text-cyan-400">
          Data Center Platform
        </Link>
        <ul className="flex space-x-6">
         
          {/* Add the Resume Button */}
          <li>
            <Link
              to="/resume"
              className="hover:text-cyan-400 transition duration-300 font-semibold"
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
