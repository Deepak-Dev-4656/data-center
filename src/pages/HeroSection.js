import React from "react";

const HeroSection = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video autoPlay loop muted className="object-cover w-full h-full z-0">
          <source src="White Simple Programming Course Video (1).mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6">
       
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
