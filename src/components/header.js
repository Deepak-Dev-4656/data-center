import React, { useEffect, useRef } from "react";

const Header = () => {
  const imageRef = useRef(null);

  // Rotating image effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const mouseX = (clientX / window.innerWidth) * 2 - 1; // Normalize mouseX
      const mouseY = -(clientY / window.innerHeight) * 2 + 1; // Normalize mouseY
      if (imageRef.current) {
        imageRef.current.style.transform = `rotateX(${mouseY * 15}deg) rotateY(${mouseX * 15}deg)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header className="flex justify-between items-center py-16 px-8 bg-black text-white">
      {/* Left Side - Text with typing effect */}
      <div className="w-1/2">
        <h1 className="text-4xl font-bold text-cyan-600">
          <span className="typing-effect">Hello, I am Deepak</span>
        </h1>
                    <p className="mt-4 text-lg text-gray-300">
              Email: <a href="mailto:developerdev4656@gmail.com" className="text-cyan-500 hover:text-cyan-400">developerdev4656@gmail.com</a>
            </p>
            <p className="mt-4 text-lg text-gray-300">
              Phone: <span className="text-cyan-500">7250642910</span>
            </p>
            <p className="mt-4 text-lg text-gray-300">
              Location: <span className="text-cyan-500">Godda, Jharkhand</span>
            </p>

      </div>

      {/* Right Side - Image with 3D effect */}
      <div className="w-1/2 flex justify-center">
        <img
          ref={imageRef}
          src="x.png" // Replace with your 3D image URL
          alt="Deepak"
          className="w-60 h-60 object-cover rounded-full shadow-xl transition-transform duration-300 ease-out"
        />
      </div>
    </header>
  );
};

export default Header;
