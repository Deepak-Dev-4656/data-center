import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash, Share2, Download, Image, CheckCircle, XCircle, Loader2, Plus } from 'lucide-react';
import { motion } from "framer-motion";
import ImageModal from "./ImageModal"; // Make sure ImageModal is imported correctly

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]); // Store multiple images
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]); // Array to store uploaded image URLs
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [selectedForActions, setSelectedForActions] = useState([]); // Selected images for actions
  const [progress, setProgress] = useState(0);
  const MAX_FILE_SIZE = 7 * 1024 * 1024; // 1MB
  const MAX_FILES = 25; // Maximum number of files allowed

  // Function to handle multiple file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} images.`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} exceeds 1MB! Skipping this file.`);
        return false;
      }
      return true;
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    document.getElementById('image-input').click();
  };

  // Upload multiple images to Cloudinary
  const uploadImages = async () => {
    if (selectedImages.length === 0) {
      alert('Please select images to upload!');
      return;
    }

    setUploading(true);
    setProgress(0);

    const uploadedUrls = [];
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const formData = new FormData();
        formData.append('file', selectedImages[i]);
        formData.append('upload_preset', 'imagestor');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/drqf2lmep/image/upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                ((progressEvent.loaded + i * progressEvent.total) /
                  (selectedImages.length * progressEvent.total)) *
                  100
              );
              setProgress(percent);
            },
          }
        );

        uploadedUrls.push(response.data.url);
      }

      setImageUrls((prevUrls) => {
        const updatedUrls = [...prevUrls, ...uploadedUrls];
        localStorage.setItem('uploadedImages', JSON.stringify(updatedUrls));
        return updatedUrls;
      });

      alert('Images uploaded successfully!');
      setSelectedImages([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images!');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Load image URLs from localStorage on component mount
  useEffect(() => {
    const savedImageUrls = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    setImageUrls(savedImageUrls);
  }, []);

  // Open modal to view full image
  const openModal = (url) => {
    setModalImageUrl(url);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl('');
  };

  // Select or deselect image for actions
  const handleSelectImage = (url) => {
    setSelectedForActions((prev) => {
      if (prev.includes(url)) {
        return prev.filter((image) => image !== url);
      } else {
        return [...prev, url];
      }
    });
  };

  // Delete selected images
  const handleDeleteSelected = () => {
    const newImageUrls = imageUrls.filter((url) => !selectedForActions.includes(url));
    setImageUrls(newImageUrls);
    localStorage.setItem('uploadedImages', JSON.stringify(newImageUrls));
    setSelectedForActions([]);
    alert('Selected images deleted!');
  };

  // Share selected images on WhatsApp
  const handleShareSelected = () => {
    const shareLinks = selectedForActions.join('\n');
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareLinks)}`;
    window.open(whatsappLink, '_blank');
  };

  // Download selected image
  const handleDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    a.click();
  };

  // Set background image
  const handleSetBackground = (url) => {
    const backgroundContainer = document.getElementById('background-container');
    if (backgroundContainer) {
      backgroundContainer.style.backgroundImage = `url(${url})`;
      backgroundContainer.style.backgroundSize = 'cover';
      backgroundContainer.style.backgroundPosition = 'center';
      backgroundContainer.style.backgroundAttachment = 'fixed';
      alert('Background image set!');
    } else {
      console.error('Background container not found!');
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-black min-h-screen overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-black shadow-md z-20 flex justify-between items-center px-6 py-4 text-green-400">
        <h1 className="text-3xl font-bold">Image Upload</h1>
        {selectedForActions.length > 0 && (
          <div className="flex space-x-4">
            <button
              onClick={handleDeleteSelected}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Trash className="mr-2" /> Delete
            </button>
            <button
              onClick={handleShareSelected}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Share2 className="mr-2" /> Share
            </button>
            <button
              onClick={() => handleDownload(selectedForActions[0])}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Download className="mr-2" /> Download
            </button>
            <button
              onClick={() => handleSetBackground(selectedForActions[0])}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Image className="mr-2" /> Set Background
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        id="image-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 w-full px-6">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Uploaded ${index}`}
              className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => openModal(url)}
            />
            <input
              type="checkbox"
              className="absolute top-2 left-2 w-5 h-5 text-green-400 cursor-pointer"
              checked={selectedForActions.includes(url)}
              onChange={() => handleSelectImage(url)}
            />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <ImageModal showModal={showModal} setShowModal={setShowModal} modalImageUrl={modalImageUrl} />

      {/* Upload Button */}
      <div className="mt-24 flex justify-center relative">
        <motion.button
          onClick={selectedImages.length > 0 ? uploadImages : triggerFileInput}
          className="relative flex items-center justify-center bg-gradient-to-r from-green-400 to-teal-500 text-white px-8 py-4 rounded-full shadow-xl hover:from-teal-500 hover:to-green-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-3 w-6 h-6" />
              <span className="font-semibold text-lg">Uploading...</span>
            </>
          ) : selectedImages.length > 0 ? (
            <>
              <CheckCircle className="mr-3 w-6 h-6" />
              <span className="font-semibold text-lg">
                Upload {selectedImages.length} Images
              </span>
            </>
          ) : (
            <>
              <Plus className="mr-3 w-6 h-6" />
              <span className="font-semibold text-lg">Select Images</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4 w-full max-w-md bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div
            className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 text-xs font-semibold text-white text-center p-1 leading-none rounded-full shadow-inner"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
