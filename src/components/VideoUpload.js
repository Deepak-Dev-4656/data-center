import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [videos, setVideos] = useState([]); // Stores video URLs

  const CLOUDINARY_API_URL = "https://api.cloudinary.com/v1_1/drqf2lmep";
  const UPLOAD_PRESET = "imagestor";
  const API_KEY = "888151417773467";
  const API_SECRET = "k8JJJWypNfOamsgwJitOhsuu388";

  // Fetch all uploaded videos from Cloudinary
  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${CLOUDINARY_API_URL}/resources/video`, {
        params: {
          max_results: 50, // Adjust as needed to limit the number of videos fetched
        },
        headers: {
          Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
        },
      });
      const fetchedVideos = response.data.resources.map((video) => video.secure_url);
      setVideos(fetchedVideos); // Set videos in state
    } catch (error) {
      console.error("Error fetching videos from Cloudinary:", error);
    }
  };

  // Load videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileSelectAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.includes("video")) {
      setUploadError("Please select a valid video file.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `${CLOUDINARY_API_URL}/video/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedVideoUrl = response.data.secure_url;
      setVideos((prevVideos) => [...prevVideos, uploadedVideoUrl]); // Update state with new video
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Error uploading video, please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-6">Video Upload and Gallery</h1>

      {uploadError && <div className="text-red-500 mb-4">{uploadError}</div>}

      {/* Video Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {videos.map((videoUrl, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <video controls className="w-full rounded-md">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      {/* Floating Button for File Upload */}
      <div className="fixed bottom-4 right-4">
        <label
          htmlFor="video-upload"
          className={`flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <span className="text-sm">...</span>
          ) : (
            <FaPlus className="text-2xl" />
          )}
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleFileSelectAndUpload}
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default VideoUpload;
