import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const VideoUploadPage = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const CLOUDINARY_API_URL = "https://api.cloudinary.com/v1_1/drqf2lmep/upload";
  const UPLOAD_PRESET = "imagestor";

  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem("uploadedVideos")) || [];
    setUploadedVideos(savedVideos);
  }, []);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_API_URL);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.secure_url) {
          const newVideos = [...uploadedVideos, data.secure_url];
          setUploadedVideos(newVideos);
          localStorage.setItem("uploadedVideos", JSON.stringify(newVideos));
          alert("Video uploaded successfully!");
        }
      } else {
        setError("Failed to upload video. Please try again.");
      }
      setUploading(false);
      setUploadProgress(0);
    };

    xhr.onerror = () => {
      setError("An error occurred during the upload. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  const handleShareOnWhatsapp = (videoUrl) => {
    const shareText = `Check out this awesome video: ${videoUrl}`;
    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      style={{
        backgroundImage: "url('Templates & Apps - Copy.jpg')", // Add your image URL here
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Overlay for better visibility of text */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        style={{ zIndex: -1 }}
      ></div>

      {/* Navbar */}
      <nav className="w-full bg-gray-900 text-green-400 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-mono">Hacker Video Upload</h1>

        {/* Upload Progress as Water Tank */}
        {uploading && (
          <div className="relative h-10 w-10 bg-gray-200 border-2 border-gray-600 rounded-md overflow-hidden">
            <div
              className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-in-out"
              style={{ height: `${uploadProgress}%` }}
            ></div>
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
              {uploadProgress}%
            </p>
          </div>
        )}
      </nav>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center mt-4">{error}</div>
      )}

      {/* Page Content */}
      <div className="w-full max-w-2xl mt-6 mx-auto">
        <h2 className="text-xl font-semibold font-mono mb-2">Uploaded Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {uploadedVideos.length === 0 ? (
            <div className="col-span-2 text-center text-xl font-semibold text-gray-500">
              No videos uploaded yet. Upload now!
            </div>
          ) : (
            uploadedVideos.map((videoUrl, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-xl bg-black"
                style={{ width: "100%", aspectRatio: "16/9" }}
              >
                <video
                  controls
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "300px" }}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* WhatsApp Share Button */}
                <button
                  className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-full hover:bg-green-700 transition-all transform hover:scale-110 shadow-xl flex items-center space-x-2"
                  onClick={() => handleShareOnWhatsapp(videoUrl)}
                  title="Share on WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                  <span className="text-sm font-semibold">Share</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Video Button */}
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      <label
        htmlFor="video-upload"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-full shadow-xl cursor-pointer hover:bg-green-700 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16v-8m-4 4h8M20 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
          />
        </svg>
      </label>
    </div>
  );
};

export default VideoUploadPage;
