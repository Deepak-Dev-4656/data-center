import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload } from 'react-icons/ai'; // For upload icon

const PdfUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please select a valid PDF file');
    }
  };

  // Handle file upload to Cloudinary
  const handleUpload = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file to upload');
      return;
    }

    setUploading(true);

    // Cloudinary API request
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('upload_preset', 'imagestor'); // Replace with your Cloudinary preset
    formData.append('folder', 'Pdfs'); // Folder in Cloudinary

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/drqf2lmep/upload', formData);
      setUploadUrl(response.data.secure_url); // Get the secure URL of the uploaded PDF
      setUploading(false);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* File input */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="border border-gray-300 p-2 mb-4 w-full"
      />

      {/* Upload button with image icon */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white p-2 rounded-md w-full flex items-center justify-center"
      >
        {uploading ? 'Uploading...' : <><AiOutlineCloudUpload className="mr-2" /> Upload PDF</>}
      </button>

      {/* PDF preview */}
      {uploadUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">PDF Preview:</h3>
          {/* Embed the PDF using an iframe */}
          <iframe
            src={uploadUrl}
            width="100%"
            height="600px"
            title="PDF Preview"
            className="border-2 border-gray-300"
          />
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-2 block"
          >
            View Uploaded PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
