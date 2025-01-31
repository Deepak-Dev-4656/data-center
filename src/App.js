import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Import the HomePage component
import ImageUpload from './components/ImageUpload';
import VideoUpload from './components/VideoUpload';
import PdfUpload from './components/PdfUpload';
import MusicUpload from './components/MusicUpload';
import TextEditor from './components/TextEditor';
import Resume from './components/Resume';
function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        
        <main className="p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />  {/* HomePage as the default route */}
            <Route path="/images" element={<ImageUpload />} />
            <Route path="/videos" element={<VideoUpload />} />
            <Route path="/pdfs" element={<PdfUpload />} />
            <Route path="/music" element={<MusicUpload />} />
            <Route path="/text" element={<TextEditor />} />
            <Route path='/resume' element={<Resume />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
