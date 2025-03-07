import React, { useState } from "react";
import HeroSection from "./HeroSection";
import UploadOptions from "./UploadOptions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = "4656";

  // Function to handle login on clicking the button
  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("⚠️ ACCESS DENIED! Wrong Password.");
    }
  };

  // Function to handle "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative">
      {/* Animated hacker-style background */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(#0f0_10%,#000)] opacity-20"></div>
      </div>

      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
          <h2 className="text-4xl font-bold mb-6 glitch text-green-400">
            🔓 ACCESS REQUIRED
          </h2>

          {/* Password Input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}  // Add keydown event to listen for "Enter"
            className="p-3 text-black bg-green-200 rounded-md w-72 text-center 
                      border border-green-500 focus:ring-2 focus:ring-green-400 
                      focus:outline-none transition duration-300 ease-in-out"
            placeholder="ENTER PASSWORD"
          />

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            className="mt-4 px-6 py-2 rounded-lg bg-green-600 text-black font-bold 
                      hover:bg-green-700 transition duration-300 shadow-lg 
                      border border-green-400"
          >
            AUTHENTICATE
          </button>

          <p className="mt-4 text-sm opacity-50">Hint: Think like a dev 😉</p>
        </div>
      ) : (
        <>
          <Navbar />
          <HeroSection />
          <UploadOptions />
          <Footer />
        </>
      )}
    </div>
  );
};

export default HomePage;
