import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FaBold, FaItalic, FaUnderline, FaTrash, FaSave, FaArrowLeft, FaDownload, FaHeading, FaFileAlt } from 'react-icons/fa';
import DrawingCanvas from './DrawingCanvas';
const TextEditor = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('16px');
  const [pageSize, setPageSize] = useState('A4');
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
        const newFile = { name: fileName, date: fileDate, content: '' };
        const docRef = await addDoc(filesCollection, newFile);
        setFiles([...files, { id: docRef.id, ...newFile }]);
        closeModal();
        alert('File created successfully!');
      } catch (error) {
        alert('Failed to create file!');
      }
    } else {
      alert('Please provide a file name and date.');
    }
  };

  const openFile = (file) => {
    setSelectedFile(file);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = file.content;
      }
    }, 0);
  };

  const saveFile = async () => {
    if (selectedFile) {
      try {
        const fileRef = doc(db, 'TextFiles', selectedFile.id);
        await updateDoc(fileRef, { content: editorRef.current.innerHTML });
        alert('File saved successfully!');
        fetchFiles();
      } catch (error) {
        alert('Failed to save file!');
      }
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await deleteDoc(doc(db, 'TextFiles', fileId));
      setFiles(files.filter(file => file.id !== fileId));
      alert('File deleted successfully!');
    } catch (error) {
      alert('Failed to delete file!');
    }
  };

  const applyStyle = (command) => {
    document.execCommand(command, false, null);
  };

  const applyColors = () => {
    document.execCommand('foreColor', false, textColor);
    document.execCommand('hiliteColor', false, bgColor);
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
      <header className="bg-blue-600 text-white p-6 flex justify-between rounded-b-xl">
        <h1 className="text-2xl font-bold">Text Editor</h1>
        <button className="bg-white text-blue-600 px-4 py-2 rounded" onClick={openModal}>+ Add File</button>
      </header>

      <main className="p-6">
        {selectedFile ? (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">{selectedFile.name}</h2>
            <div className="flex space-x-4 my-4">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={applyColors}>Apply Color</button>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
              <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('bold')}><FaBold /></button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('italic')}><FaItalic /></button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => applyStyle('underline')}><FaUnderline /></button>
              <button className="bg-gray-700 text-white px-3 py-1 rounded" onClick={() => applyStyle('formatBlock', '<h1>')}><FaHeading /></button>
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={downloadFile}><FaDownload /></button>
            </div>
            <div ref={editorRef} contentEditable className="w-full p-4 border border-gray-300 rounded min-h-[600px] bg-gray-50"></div>
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
      <DrawingCanvas/>
    </div>
  );
};

export default TextEditor;
