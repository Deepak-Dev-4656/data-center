import React, { useState } from 'react';
import axios from 'axios';

const PdfUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [customName, setCustomName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState(
    JSON.parse(localStorage.getItem('pdfData')) || []
  );
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 10485760 && file.type === 'application/pdf') { // 10MB max size
      setPdfFile(file);
      setError('');
    } else {
      setError('Please select a valid PDF file under 10MB.');
    }
  };

  const handleNameChange = (event) => {
    setCustomName(event.target.value);
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file to upload.');
      return;
    }

    if (!customName) {
      setError('Please enter a name for the PDF.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('upload_preset', 'imagestor');
    formData.append('folder', 'Pdfs');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/drqf2lmep/upload',
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const uploadedPdfUrl = response.data.secure_url;
      const newPdfData = {
        url: uploadedPdfUrl,
        name: customName,
      };

      // Save uploaded PDF with custom name to local storage
      const updatedPdfData = [...uploadData, newPdfData];
      setUploadData(updatedPdfData);
      localStorage.setItem('pdfData', JSON.stringify(updatedPdfData));

      setPdfFile(null);
      setCustomName('');
    } catch (err) {
      setError('Upload failed. Please try again.');
    }

    setUploading(false);
  };

  const deletePdf = (url) => {
    const newPdfData = uploadData.filter((item) => item.url !== url);
    setUploadData(newPdfData);
    localStorage.setItem('pdfData', JSON.stringify(newPdfData));
  };

  const handleShare = (url) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 shadow-xl rounded-2xl">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">Advanced PDF Upload</h2>

      {error && <p className="text-red-600 text-lg text-center mb-6">{error}</p>}

      {/* File Upload Section */}
      <div className="text-center mb-6">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full max-w-md mx-auto py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Custom Name Input */}
      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Enter PDF name"
          value={customName}
          onChange={handleNameChange}
          className="w-full max-w-md mx-auto py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Upload Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full max-w-md mx-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          {uploading ? (
            <span>Uploading {uploadProgress}%</span>
          ) : (
            'Upload PDF'
          )}
        </button>
        {uploading && (
          <div className="mt-4">
            <progress value={uploadProgress} max="100" className="w-full h-2 rounded-lg" />
          </div>
        )}
      </div>

      {/* Display Uploaded PDFs */}
      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-center mb-8 text-blue-900">Uploaded PDFs</h3>

        {uploadData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {uploadData.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-medium">{item.name}</h4>
                </div>
                <div className="text-center">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mb-4 block"
                  >
                    View PDF
                  </a>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleShare(item.url)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => deletePdf(item.url)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No PDFs uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default PdfUpload;
