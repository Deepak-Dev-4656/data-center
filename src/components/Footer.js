// Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-8 text-center">
      <p className="text-sm opacity-70">
        &copy; {new Date().getFullYear()} Data Center Platform. All rights reserved.
      </p>
      <div className="mt-4 flex justify-center space-x-4">
        {["Facebook", "Twitter", "LinkedIn"].map((platform) => (
          <a
            key={platform}
            href={`https://www.${platform.toLowerCase()}.com`}
            className="text-cyan-400 text-lg font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {platform}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
