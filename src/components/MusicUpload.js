import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Optional for notifications
import { FaPlus } from 'react-icons/fa'; // Plus icon for the upload button

const MusicUpload = () => {
  const [musicFile, setMusicFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.includes('audio')) {
      setMusicFile(file);
    } else {
      toast.error('Please upload a valid audio file.');
    }
  };

  // Upload music to Cloudinary
  const handleUpload = async () => {
    if (!musicFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', musicFile);
    formData.append('upload_preset', 'imagestor'); // Cloudinary preset
    formData.append('folder', 'Music'); // Optional folder structure in Cloudinary

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/drqf2lmep/upload', formData);
      setUploadUrl(response.data.secure_url);
      toast.success('Upload successful!');
    } catch (error) {
      toast.error('Upload failed, please try again later.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Upload Music</h2>
      <div>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
          className="block mb-4 border border-gray-300 p-2 rounded"
        />
        {musicFile && (
          <p className="text-gray-600">{musicFile.name}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center"
        >
          {isUploading ? 'Uploading...' : <><FaPlus className="mr-2" /> Upload Music</>}
        </button>
      </div>

      {uploadUrl && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg">Uploaded Music:</h3>
          <audio controls>
            <source src={uploadUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default MusicUpload;
