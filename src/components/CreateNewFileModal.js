import React, { useState } from 'react';

const CreateNewFileModal = ({ isModalOpen, closeModal, saveNewFile }) => {
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-xl w-96">
          <h2 className="text-2xl font-semibold mb-4">Create New File</h2>
          <div className="mb-4">
            <label className="block text-lg font-medium">File Name:</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">File Date:</label>
            <input
              type="date"
              value={fileDate}
              onChange={(e) => setFileDate(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-6 flex justify-between">
            <button
              onClick={() => saveNewFile(fileName, fileDate)}
              className="bg-blue-600 text-white px-6 py-3 rounded-full"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-600 text-white px-6 py-3 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateNewFileModal;
