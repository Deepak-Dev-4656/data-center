import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload, AiOutlineFilePdf } from 'react-icons/ai';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

const PdfUpload = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadUrls, setUploadUrls] = useState(
    JSON.parse(localStorage.getItem('pdfUrls')) || []
  );
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfLoadingError, setPdfLoadingError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfPerPage] = useState(3);  // You can adjust the number of PDFs shown per page

  const onDrop = (acceptedFiles) => {
    const newPdfFiles = acceptedFiles.filter((file) => {
      if (file.size > 10485760) { // 10MB in bytes
        setError('File size exceeds 10MB');
        return false;
      }
      if (file.type !== 'application/pdf') {
        setError('Please select valid PDF files');
        return false;
      }
      return true;
    });

    if (newPdfFiles.length > 0) {
      setPdfFiles((prevFiles) => [...prevFiles, ...newPdfFiles]);
      setError('');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf',
  });

  const handleUpload = async () => {
    if (pdfFiles.length === 0) {
      setError('Please select at least one PDF file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < pdfFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', pdfFiles[i]);
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

        setUploadUrls((prevUrls) => [
          ...prevUrls,
          response.data.secure_url,
        ]);
        localStorage.setItem(
          'pdfUrls',
          JSON.stringify([...uploadUrls, response.data.secure_url])
        );
      } catch (err) {
        setError('Upload failed. Please try again.');
      }
    }

    setUploading(false);
    setPdfFiles([]);
  };

  const extractFileName = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const onLoadError = (error) => {
    setPdfLoadingError('Failed to load PDF file.');
  };

  const deletePdf = (url) => {
    const newUrls = uploadUrls.filter((item) => item !== url);
    setUploadUrls(newUrls);
    localStorage.setItem('pdfUrls', JSON.stringify(newUrls));
  };

  const totalPages = Math.ceil(uploadUrls.length / pdfPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedPdfs = uploadUrls.slice(
    (currentPage - 1) * pdfPerPage,
    currentPage * pdfPerPage
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-teal-100 via-blue-100 to-indigo-100 shadow-xl rounded-2xl">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">
        Advanced PDF Upload with Smooth Interactions
      </h2>

      {error && <p className="text-red-600 text-lg text-center mb-6">{error}</p>}

      <div
        {...getRootProps()}
        className="border-4 border-dashed border-teal-600 p-12 mb-8 text-center rounded-xl cursor-pointer hover:bg-teal-50 transition-all transform hover:scale-105"
      >
        <input {...getInputProps()} />
        <div className="text-2xl font-semibold text-teal-800">
          <AiOutlineCloudUpload className="inline-block mr-4 text-5xl animate-pulse" />
          Drag & Drop PDFs here, or click to select files
        </div>
        <div className="mt-2 text-gray-600">Max file size: 10MB</div>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-800 text-white py-4 rounded-lg flex items-center justify-center hover:from-teal-700 hover:to-teal-900 transition-all transform hover:scale-105"
      >
        {uploading ? (
          <div className="flex items-center space-x-4">
            <div className="loader mr-2"></div>
            <span>Uploading {uploadProgress}%</span>
          </div>
        ) : (
          <>
            <AiOutlineCloudUpload className="mr-4" /> Upload PDFs
          </>
        )}
      </button>

      {uploading && (
        <div className="w-full bg-gray-200 mt-6 rounded-full h-2.5">
          <div
            className="bg-teal-600 h-2.5 rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-center mb-8 text-teal-900">
          Uploaded PDFs
        </h3>
        {displayedPdfs.length > 0 ? (
          displayedPdfs.map((url, index) => (
            <div
              key={index}
              className="mb-8 p-6 bg-white rounded-lg shadow-xl transform hover:scale-105 transition-all flex items-center space-x-8"
            >
              <div className="flex-shrink-0">
                <Document
                  file={url}
                  onLoadError={onLoadError}
                  className="pdf-preview"
                >
                  <Page pageNumber={1} width={100} />
                </Document>
                {pdfLoadingError && (
                  <div className="text-red-600 text-center">{pdfLoadingError}</div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-4">
                  <AiOutlineFilePdf className="text-teal-500 text-4xl" />
                  <span className="text-xl font-medium text-gray-800">
                    {extractFileName(url)}
                  </span>
                </div>
                <div className="text-center mt-4">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline"
                  >
                    View Uploaded PDF
                  </a>
                </div>
                <button
                  onClick={() => deletePdf(url)}
                  className="mt-4 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No PDFs uploaded yet.</p>
        )}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-xl">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfUpload;
