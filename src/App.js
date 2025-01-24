import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Import the HomePage component
import ImageUpload from './components/ImageUpload';
import VideoUpload from './components/VideoUpload';
import PdfUpload from './components/PdfUpload';
import MusicUpload from './components/MusicUpload';
import TextEditor from './components/TextEditor';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Media Management Platform</h1>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />  {/* HomePage as the default route */}
            <Route path="/images" element={<ImageUpload />} />
            <Route path="/videos" element={<VideoUpload />} />
            <Route path="/pdfs" element={<PdfUpload />} />
            <Route path="/music" element={<MusicUpload />} />
            <Route path="/text" element={<TextEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
