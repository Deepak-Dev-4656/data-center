import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const uploadOptions = [
    {
      path: "/images",
      title: "Image Upload",
      description: "Easily upload and manage your images with high-speed processing.",
      image: "Blue Textured Space Landscape Hello World Desktop Wallpaper.png", // Replace with your image URL
    },
    {
      path: "/videos",
      title: "Video Upload",
      description: "Efficiently handle your video uploads with optimized performance.",
      image: "https://example.com/video-upload.jpg", // Replace with your image URL
    },
    {
      path: "/pdfs",
      title: "PDF Upload",
      description: "Organize your PDFs and documents securely on the cloud.",
      image: "https://example.com/pdf-upload.jpg", // Replace with your image URL
    },
    {
      path: "/music",
      title: "Music Upload",
      description: "Upload and manage your music files effortlessly.",
      image: "https://example.com/music-upload.jpg", // Replace with your image URL
    },
  ];

  return (
    <div className="min-h-screen text-white bg-gray-900">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('https://example.com/data-center-bg.jpg')", // Replace with your hero image
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Data Center Media Management
          </h1>
          <p className="mt-6 text-lg md:text-2xl font-medium opacity-90">
            Securely upload, organize, and manage your data
          </p>
          <p className="mt-2 text-sm md:text-md font-light opacity-70">
            Your trusted platform for seamless media handling
          </p>
        </div>
      </div>

      {/* Upload Options Section */}
      <section className="py-16 bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          Choose an Upload Option
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6">
          {uploadOptions.map(({ path, title, description, image }) => (
            <div
              key={title}
              className="flex flex-col md:flex-row items-center bg-white bg-opacity-10 rounded-lg p-6 shadow-lg"
            >
              {/* Left Side: Image and Text */}
              <div className="flex-1 flex flex-col items-start">
                <img
                  src={image}
                  alt={title}
                  className="w-full md:w-48 h-auto rounded-lg mb-4 md:mb-0"
                />
                <h3 className="text-xl font-bold text-cyan-400">{title}</h3>
                <p className="mt-2 text-sm opacity-80">{description}</p>
              </div>

              {/* Right Side: Button */}
              <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6">
                <Link
                  to={path}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  Upload
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default HomePage;
