import React, { useState } from "react";
import HeroSection from "./HeroSection";
import UploadOptions from "./UploadOptions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputText, setInputText] = useState("");
  const [systemResponse, setSystemResponse] = useState("");
  const [showConsole, setShowConsole] = useState(false);

  const correctPassword = "@deepakdev4656";

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowConsole(true);
      setSystemResponse("🔓 SYSTEM ACCESS GRANTED");
    } else {
      setSystemResponse("⛔ ERROR: Invalid Password");
      setTimeout(() => setSystemResponse(""), 2000);
    }
  };

  const handleCommandInput = (e) => {
    setInputText(e.target.value);
    if (e.target.value.includes("connect") || e.target.value.includes("server")) {
      setSystemResponse("💻 Connecting to server... Please wait.");
    } else if (e.target.value.includes("authenticate")) {
      setSystemResponse("🔐 Authenticating user...");
    } else if (e.target.value.includes("init")) {
      setSystemResponse("🔧 Initializing system...");
    } else {
      setSystemResponse("🤖 Processing...");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* 3D Animated Matrix Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-black opacity-30 animate-glitch"></div>
        <div className="absolute w-full h-full opacity-20 animate-flicker"></div>
        <div className="absolute w-full h-full opacity-50 animate-flicker-2"></div>
      </div>

      {/* Terminal Authentication */}
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
          <h2 className="text-5xl font-extrabold glitch text-green-400 tracking-wider animate-pulse">
            SYSTEM ACCESS REQUIRED
          </h2>

          <div className="relative mb-6">
            <span className="absolute left-3 top-3 text-green-500">root@hacker:~$</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-28 p-3 text-green-300 bg-black border border-green-500 rounded-lg 
                        w-80 text-center focus:ring-2 focus:ring-green-400 
                        focus:outline-none transition duration-300 ease-in-out
                        font-mono text-xl"
              placeholder="Enter Password"
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

          {systemResponse && (
            <div className="mt-4 text-lg text-red-500 animate-flicker">{systemResponse}</div>
          )}
        </div>
      ) : (
        <>
          {/* 3D Holographic Console */}
          {showConsole && (
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80 z-10 flex flex-col items-center justify-center text-green-400">
              <div className="p-4 border-2 border-green-500 rounded-lg shadow-lg bg-black w-96 text-lg">
                <div className="text-center mb-6 animate-glitch">System Booting...</div>
                <div className="text-green-300 text-sm">
                  {systemResponse}
                </div>
              </div>

              <div className="mt-6 w-full max-w-3xl">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleCommandInput}
                    className="w-full pl-16 p-3 text-white bg-transparent border-none 
                              focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-mono 
                              border border-green-500 rounded-md shadow-xl"
                    placeholder="Enter Command..."
                  />
                  <span className="absolute top-1 left-4 text-green-500">root@user:~$</span>
                </div>
                {systemResponse && (
                  <div className="mt-4 text-lg text-green-300">{systemResponse}</div>
                )}
              </div>
            </div>
          )}

          {/* Main Content after Authentication */}
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
