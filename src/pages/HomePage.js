import React, { useState } from "react";
import HeroSection from "./HeroSection";
import UploadOptions from "./UploadOptions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  const correctPassword = "@deepakdev4656";

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("⛔ ACCESS DENIED: Incorrect Password");
    }
  };

  const handleCommandInput = (e) => {
    setInputText(e.target.value);
    setShowResponse(false);

    // Fake AI interaction: It will simulate some response based on the text entered
    if (e.target.value.includes("connect") || e.target.value.includes("server")) {
      setShowResponse("💻 Connecting to server... Please wait.");
    } else if (e.target.value.includes("authenticate")) {
      setShowResponse("🔐 Authentication in progress...");
    } else {
      setShowResponse("🤖 AI is thinking...");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix Effect & Glowing Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-black opacity-30 animate-glitch"></div>
        <div className="absolute w-full h-full opacity-20 animate-flicker"></div>
      </div>

      {/* Terminal Login Area */}
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
          <h2 className="text-5xl font-extrabold mb-6 glitch text-green-400 tracking-wider animate-pulse">
            SYSTEM ACCESS REQUIRED
          </h2>

          {/* Terminal Input */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-green-500">root@hacker:~$</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-28 p-3 text-green-300 bg-black border border-green-500 rounded-lg 
                        w-80 text-center focus:ring-2 focus:ring-green-400 
                        focus:outline-none transition duration-300 ease-in-out
                        font-mono"
              placeholder="Enter password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="mt-6 px-8 py-3 rounded-lg bg-green-600 text-black font-bold text-lg 
                      hover:bg-green-700 transition duration-300 shadow-lg 
                      border border-green-400 uppercase tracking-wider animate-pulse"
          >
            Authenticate 🚀
          </button>

          <p className="mt-4 text-sm opacity-50">Unauthorized access will be logged ⚠️</p>
        </div>
      ) : (
        <>
          {/* 3D Console Effect */}
          <div className="flex flex-col items-center justify-center min-h-screen relative z-10 text-white">
            <h3 className="text-3xl font-bold text-center mb-4 animate-glitch">Welcome, Hacker!</h3>

            {/* Command Input Simulation */}
            <div className="relative w-3/4 mb-4 p-4 border border-green-400 bg-black rounded-md text-green-300">
              <span className="absolute top-0 left-0 text-green-500">root@user:~$</span>
              <input
                type="text"
                value={inputText}
                onChange={handleCommandInput}
                className="w-full pl-14 p-3 text-white bg-transparent border-none 
                          focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-mono"
                placeholder="Type command here..."
              />
            </div>

            {/* Simulated AI Response */}
            {showResponse && (
              <div className="mt-4 text-xl text-green-300 animate-pulse">
                {showResponse}
              </div>
            )}
          </div>

          {/* Content after authentication */}
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
