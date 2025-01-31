import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaUpload, FaTrash, FaPause, FaPlay, FaStop, FaSearch, FaVolumeUp } from 'react-icons/fa';

const MusicUpload = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [playlist, setPlaylist] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle file selection with validation
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.every(file => file.type.includes('audio') && file.size <= 50 * 1024 * 1024)) { // Max 50MB
      setMusicFiles(prevFiles => [...prevFiles, ...files]);
    } else {
      toast.error('Please upload valid audio files (up to 50MB).');
    }
  };

  // Upload multiple music files to Cloudinary
  const handleUpload = async () => {
    if (isCancelled) return;

    setIsUploading(true);
    const newPlaylist = [...playlist];

    for (let i = 0; i < musicFiles.length; i++) {
      if (isCancelled) break;
      const file = musicFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'imagestor');
      formData.append('folder', 'Music');

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/drqf2lmep/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prevProgress => ({
              ...prevProgress,
              [file.name]: percent,
            }));
          },
        });

        newPlaylist.push({ 
          url: response.data.secure_url, 
          name: file.name, 
          duration: file.duration || 'Unknown', 
          artist: file.artist || 'Unknown',
        });
        localStorage.setItem('playlist', JSON.stringify(newPlaylist));
      } catch (error) {
        toast.error(`Upload failed for ${file.name}`);
        console.error(error);
      }
    }

    setPlaylist(newPlaylist);
    setIsUploading(false);
    setUploadProgress({});
    setMusicFiles([]); // Clear selected files after upload
    toast.success(`Uploaded ${newPlaylist.length} tracks successfully!`);
  };

  // Pause upload process
  const handlePauseUpload = () => {
    setIsPaused(true);
    toast.info('Upload Paused');
  };

  // Resume upload process
  const handleResumeUpload = () => {
    setIsPaused(false);
    toast.info('Upload Resumed');
  };

  // Cancel upload process
  const handleCancelUpload = () => {
    setIsCancelled(true);
    toast.info('Upload Cancelled');
  };

  // Remove a track from the playlist
  const removeFromPlaylist = (index) => {
    const updatedPlaylist = [...playlist];
    updatedPlaylist.splice(index, 1);
    setPlaylist(updatedPlaylist);
    localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
  };

  // Reorder the playlist
  const reorderPlaylist = (fromIndex, toIndex) => {
    const updatedPlaylist = [...playlist];
    const [movedItem] = updatedPlaylist.splice(fromIndex, 1);
    updatedPlaylist.splice(toIndex, 0, movedItem);
    setPlaylist(updatedPlaylist);
    localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
  };

  // Clear all playlist
  const clearPlaylist = () => {
    setPlaylist([]);
    localStorage.removeItem('playlist');
    toast.success('Playlist cleared!');
  };

  // Load playlist from localStorage on component mount
  useEffect(() => {
    const savedPlaylist = localStorage.getItem('playlist');
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  }, []);

  // Search/Filter Playlist with added validation to prevent 'undefined' errors
  const filteredPlaylist = playlist.filter(item => 
    item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg shadow-xl text-white relative">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload Your Music</h2>

      {/* File Upload Input */}
      <div className="border-dashed border-2 border-white p-8 text-center mb-6 rounded-lg hover:bg-gray-700 transition-all duration-300">
        <p className="text-lg">Drag & Drop your audio files here or click to select files</p>
        <input 
          type="file" 
          accept="audio/*" 
          multiple 
          onChange={handleFileChange} 
          className="hidden" 
          id="fileInput" 
        />
        <button 
          onClick={() => document.getElementById('fileInput').click()} 
          className="mt-4 px-6 py-2 bg-pink-600 rounded-full hover:bg-pink-700 transition-all"
        >
          <FaPlus /> Select Files
        </button>
      </div>

      {/* Upload Button */}
      <button 
        onClick={handleUpload} 
        disabled={isUploading || musicFiles.length === 0}
        className={`w-full py-3 bg-blue-600 text-white rounded-md flex justify-center items-center transition-all hover:bg-blue-700 ${isUploading && 'opacity-50 cursor-not-allowed'}`}
      >
        {isUploading ? <FaUpload className="animate-spin" /> : <FaUpload />} 
        {isUploading ? 'Uploading...' : 'Upload Music'}
      </button>

      {/* Upload Controls (Pause, Resume, Cancel) */}
      {isUploading && (
        <div className="flex justify-between mt-6">
          <button onClick={handlePauseUpload} className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-all">
            <FaPause /> Pause
          </button>
          <button onClick={handleResumeUpload} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all">
            <FaPlay /> Resume
          </button>
          <button onClick={handleCancelUpload} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all">
            <FaStop /> Cancel
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-6">
          {musicFiles.map(file => (
            <div key={file.name} className="mb-4">
              <div className="text-sm text-center">{file.name}</div>
              <div className="h-2 bg-gray-300 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${uploadProgress[file.name] || 0}%` }}></div>
              </div>
              <div className="text-xs text-center">{uploadProgress[file.name]}%</div>
            </div>
          ))}
        </div>
      )}

      {/* Playlist Search */}
      <div className="flex items-center justify-center mb-6 mt-8">
        <FaSearch className="text-lg" />
        <input 
          type="text" 
          placeholder="Search Playlist" 
          className="ml-3 p-2 rounded-full text-black focus:outline-none"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display Playlist */}
      {filteredPlaylist.length > 0 && (
        <div>
          <h3 className="font-semibold text-xl mb-4">Playlist:</h3>
          <ul className="space-y-4">
            {filteredPlaylist.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-all">
                <audio controls className="w-1/3">
                  <source src={item.url} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                <div className="ml-4 text-white">
                  <strong>{item.name}</strong>
                  <br />
                  <small>{item.artist} - {item.duration}</small>
                </div>
                <button onClick={() => removeFromPlaylist(index)} className="ml-4 text-red-600 hover:text-red-800 transition-all">
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clear Playlist */}
      <div className="mt-6 text-center">
        <button onClick={clearPlaylist} className="text-red-500 hover:text-red-700 transition-all">
          <FaTrash /> Clear Playlist
        </button>
      </div>
    </div>
  );
};

export default MusicUpload;
