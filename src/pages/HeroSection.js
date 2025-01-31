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
      
    </div>
  );
};

export default HeroSection;
