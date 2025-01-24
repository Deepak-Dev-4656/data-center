import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [progress, setProgress] = useState(0); // To track upload progress
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

  // Function to handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('File size exceeds 1MB! Please select a smaller image.');
      } else {
        setSelectedImage(file);
      }
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    document.getElementById('image-input').click();
  };

  // Function to upload image to Cloudinary
  const uploadImage = async () => {
    if (!selectedImage) {
      alert('Please select an image first!');
      return;
    }

    setUploading(true);
    setProgress(0); // Reset progress

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('upload_preset', 'imagestor'); // Use your Cloudinary preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/drqf2lmep/image/upload', // Use your Cloudinary cloud name
        formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setProgress(percent); // Update progress state
          },
        }
      );

      const { url } = response.data;

      // Update the gallery with the new image without removing existing images
      setImageUrls((prevUrls) => {
        const updatedUrls = [...prevUrls, url]; // Add new image URL to the existing array
        localStorage.setItem('uploadedImages', JSON.stringify(updatedUrls)); // Save to localStorage
        return updatedUrls;
      });
      setSelectedImage(null); // Reset the selected image after upload
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image!');
    } finally {
      setUploading(false);
      setProgress(0); // Reset progress after upload
    }
  };

  // Load image URLs from localStorage on component mount
  useEffect(() => {
    const savedImageUrls = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    setImageUrls(savedImageUrls); // Load the saved image URLs
  }, []);

  // Function to open the modal with the full image
  const openModal = (url) => {
    setModalImageUrl(url);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl('');
  };

  // Handle image selection (for multi-select and actions like delete or share)
  const handleSelectImage = (url) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(url)) {
        return prevSelected.filter((image) => image !== url); // Deselect image
      } else {
        return [...prevSelected, url]; // Select image
      }
    });
  };

  // Delete selected images
  const handleDeleteSelected = () => {
    const newImageUrls = imageUrls.filter((url) => !selectedImages.includes(url));
    setImageUrls(newImageUrls);
    localStorage.setItem('uploadedImages', JSON.stringify(newImageUrls)); // Update localStorage
    setSelectedImages([]); // Clear selected images
    alert('Selected images deleted!');
  };

  // Share selected images on WhatsApp
  const handleShareSelected = () => {
    const shareLinks = selectedImages.join('\n');
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareLinks)}`;
    window.open(whatsappLink, '_blank');
  };

  // Function to download the selected image
  const handleDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop(); // Extract the image name from URL for download
    a.click();
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gray-50 min-h-screen overflow-hidden">
      {/* Flowing Water Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-30 z-0 animate-wave"></div>

      <h2 className="text-3xl font-semibold mb-6 text-white z-10">Upload Your Image</h2>

      {/* Hidden File Input */}
      <input
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Gallery of Uploaded Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-full z-10">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative group transition-all duration-300 transform hover:scale-105">
            <img
              src={url}
              alt={`Uploaded ${index}`}
              className="w-full h-auto rounded-xl shadow-lg cursor-pointer transform transition-all hover:shadow-xl"
              onClick={() => openModal(url)} // Open modal on image click
            />
            <input
              type="checkbox"
              className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100"
              checked={selectedImages.includes(url)}
              onChange={() => handleSelectImage(url)}
            />
            {selectedImages.includes(url) && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-2 rounded-md text-white text-xs">
                <button
                  onClick={() => handleDownload(url)}
                  className="text-white"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Button with Plus Icon at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-10">
        {uploading ? (
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="w-20 h-20 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="lightgray"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="blue"
                strokeWidth="10"
                strokeDasharray={`${(progress / 100) * Math.PI * 100} ${Math.PI * 100}`}
                fill="none"
              />
            </svg>
            <div className="text-blue-600 text-lg">{progress}%</div>
            <div className="text-blue-600 text-sm">Uploading...</div>
          </div>
        ) : (
          <button
            onClick={selectedImage ? uploadImage : triggerFileInput} // Toggle between file input and upload
            className="bg-blue-600 text-white p-6 rounded-full shadow-xl transform hover:scale-105 transition-all"
          >
            <span className="text-4xl">{selectedImage ? '✔' : '+'}</span> {/* Show check mark when file is selected */}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      {selectedImages.length > 0 && (
        <div className="flex space-x-6 mt-6 z-10">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            Delete Selected
          </button>
          <button
            onClick={handleShareSelected}
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            Share via WhatsApp
          </button>
        </div>
      )}

      {/* Modal for Full Image */}
      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal} // Close on clicking outside the modal
        >
          <div className="relative w-full max-w-4xl p-4 bg-white rounded-lg">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-red-600 p-2 rounded-full"
            >
              X
            </button>
            <img
              src={modalImageUrl}
              alt="Full-size"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
