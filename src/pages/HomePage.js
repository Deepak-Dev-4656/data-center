// HomePage.js
import React from "react";
import HeroSection from "./HeroSection";
import UploadOptions from "./UploadOptions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import the Footer component

const HomePage = () => {
  return (
    <div className="min-h-screen text-white bg-gray-900">
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Upload Options Section */}
      <UploadOptions />

      {/* Footer */}

      <Footer /> {/* Now the footer is a separate component */}
      
    </div>
  );
};

export default HomePage;
