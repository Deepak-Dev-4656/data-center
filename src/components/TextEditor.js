import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FaTrash, FaSave, FaArrowLeft, FaDownload, FaImage, FaUndo, FaRedo, FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrawingCanvas from './DrawingCanvas';

const TextEditor = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const editorRef = useRef(null);

  const filesCollection = collection(db, 'TextFiles');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const snapshot = await getDocs(filesCollection);
      const filesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error.message);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setFileName('');
    setFileDate('');
  };

  const closeModal = () => setIsModalOpen(false);

  const saveNewFile = async () => {
    if (fileName.trim() && fileDate.trim()) {
      try {
        const newFile = { name: fileName, date: fileDate, content: editorContent };
        const docRef = await addDoc(filesCollection, newFile);
        setFiles((prevFiles) => [...prevFiles, { id: docRef.id, ...newFile }]);
        closeModal();
        toast.success('File created successfully!');
      } catch (error) {
        toast.error('Failed to create file!');
      }
    } else {
      toast.error('Please provide a file name and date.');
    }
  };

  const openFile = (file) => {
    setSelectedFile(file);
    setEditorContent(file.content);
  };

  const saveFile = async () => {
    if (selectedFile) {
      try {
        const fileRef = doc(db, 'TextFiles', selectedFile.id);
        await updateDoc(fileRef, { content: editorContent });
        toast.success('File saved successfully!');
        fetchFiles();
      } catch (error) {
        toast.error('Failed to save file!');
      }
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await deleteDoc(doc(db, 'TextFiles', fileId));
      setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
      toast.success('File deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete file!');
    }
  };

  const handleEditorChange = (e) => {
    setEditorContent(e.target.value);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        document.execCommand('insertImage', false, reader.result);  // Insert Image into editor
      };
      if (file) reader.readAsDataURL(file);
    };
    input.click();
  };

  const downloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([editorRef.current.innerHTML], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedFile.name}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-6 transition-colors duration-300`}>
      <ToastContainer />

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white p-6 flex justify-between rounded-b-xl shadow-lg`}>
        <h1 className="text-2xl font-bold">Text Editor</h1>
        <div className="flex items-center space-x-4">
          <button
            className={`${darkMode ? 'bg-gray-700' : 'bg-white'} text-blue-600 px-4 py-2 rounded hover:bg-opacity-90 transition-all`}
            onClick={openModal}
          >
            + Add File
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'} text-blue-600 hover:bg-opacity-90 transition-all`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {selectedFile ? (
          // Editor View
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded shadow-lg transition-colors duration-300`}>
            <h2 className="text-xl font-semibold">{selectedFile.name}</h2>
            <div className="flex flex-wrap gap-2 my-4">
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-all" onClick={handleImageUpload}><FaImage /> Insert Image</button>
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-all" onClick={downloadFile}><FaDownload /> Download</button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all" onClick={() => document.execCommand('undo')}><FaUndo /> Undo</button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all" onClick={() => document.execCommand('redo')}><FaRedo /> Redo</button>
            </div>

            <textarea
  ref={editorRef}
  value={editorContent}
  onChange={handleEditorChange}
  onInput={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newText =
        editorContent.substring(0, start) + "\n" + editorContent.substring(end);
      handleEditorChange({ target: { value: newText } });

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }, 0);
    }
  }}
  className={`w-full p-4 border resize-y overflow-hidden ${
    darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 bg-gray-50"
  } rounded min-h-screen md:h-auto md:max-h-[80vh] transition-colors duration-300`}
/>


            <div className="flex justify-between mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all" onClick={() => setSelectedFile(null)}><FaArrowLeft /> Back</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all" onClick={saveFile}><FaSave /> Save</button>
            </div>
          </div>
        ) : (
          // File List View
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`p-2 pl-10 w-64 rounded border ${darkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                  onClick={() => openFile(file)}
                >
                  <h2 className="text-lg font-semibold">{file.name}</h2>
                  <p className="text-gray-500">{file.date}</p>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-600 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
<DrawingCanvas/>
      {/* Modal for creating a new file */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded shadow-lg w-96 transition-colors duration-300`}>
            <h2 className="text-xl font-semibold mb-4">Create New File</h2>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File Name"
              className={`w-full p-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            <input
              type="date"
              value={fileDate}
              onChange={(e) => setFileDate(e.target.value)}
              className={`w-full p-2 mb-4 border ${darkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all" onClick={closeModal}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all" onClick={saveNewFile}>Save File</button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default TextEditor;
