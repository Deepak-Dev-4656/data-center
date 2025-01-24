import React, { useState } from 'react';
import { db } from '../services/firebase'; // Assuming Firebase service is set up

const TextEditor = () => {
  const [text, setText] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  // Handle changes to the text area
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Save text to Firebase Firestore
  const handleSave = async () => {
    if (text.trim() !== '') {
      try {
        await db.collection('TextEntries').add({
          content: text,
          createdAt: new Date(),
        });
        alert('Text saved successfully!');
      } catch (error) {
        console.error('Error saving text:', error);
        alert('Failed to save text!');
      }
    }
  };

  // Handle text highlighting
  const handleHighlight = (e) => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      setHighlightedText(selectedText);
      document.execCommand('backColor', false, 'yellow');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Text Editor</h2>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleHighlight}
        >
          Highlight Text
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Text
        </button>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Start writing here..."
        rows="10"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      {highlightedText && (
        <p className="mt-2 text-yellow-600">
          Highlighted text: <strong>{highlightedText}</strong>
        </p>
      )}
    </div>
  );
};

export default TextEditor;
