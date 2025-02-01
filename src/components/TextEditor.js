import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FaBold, FaItalic, FaUnderline, FaTrash, FaSave, FaArrowLeft, FaDownload, FaHeading, FaImage, FaHighlighter, FaPaintBrush, FaUndo, FaRedo } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrawingCanvas from './DrawingCanvas';

const TextEditor = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [fontSize, setFontSize] = useState('16px');
  const [pageSize, setPageSize] = useState('A4');
  const [editorContent, setEditorContent] = useState('');
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

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        document.execCommand('insertImage', false, reader.result);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />

      <header className="bg-blue-600 text-white p-6 flex justify-between rounded-b-xl">
        <h1 className="text-2xl font-bold">Text Editor</h1>
        <button className="bg-white text-blue-600 px-4 py-2 rounded" onClick={openModal}>+ Add File</button>
      </header>

      <main className="p-6">
        {selectedFile ? (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">{selectedFile.name}</h2>
            <div className="flex space-x-4 my-4">
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('bold')}><FaBold /></button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('italic')}><FaItalic /></button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('underline')}><FaUnderline /></button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('formatBlock', '<h1>')}><FaHeading /></button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleImageUpload}><FaImage /></button>
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={downloadFile}><FaDownload /></button>
              <input
                type="color"
                value={highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-8 h-8"
              />
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('hiliteColor', highlightColor)}><FaHighlighter /></button>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8"
              />
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('backColor', bgColor)}><FaPaintBrush /></button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => document.execCommand('undo')}><FaUndo /></button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => document.execCommand('redo')}><FaRedo /></button>
            </div>

            <textarea
              ref={editorRef}
              value={editorContent}
              onChange={handleEditorChange}
              className="w-full p-4 border border-gray-300 rounded min-h-[600px] bg-gray-50"
            />

            <div className="flex justify-between mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setSelectedFile(null)}><FaArrowLeft /> Back</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={saveFile}><FaSave /> Save</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div key={file.id} className="bg-white p-4 rounded shadow cursor-pointer">
                <h2 className="text-lg font-semibold" onClick={() => openFile(file)}>{file.name}</h2>
                <p className="text-gray-500">{file.date}</p>
                <button className="bg-red-500 text-white px-3 py-1 rounded mt-2" onClick={() => deleteFile(file.id)}><FaTrash /> Delete</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-semibold mb-4">Create New File</h2>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={fileDate}
              onChange={(e) => setFileDate(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveNewFile}>Save File</button>
            </div>
          </div>
        </div>
      )}
<DrawingCanvas/>
    </div>
  );      
};

export default TextEditor;
