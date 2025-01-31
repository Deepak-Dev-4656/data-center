import { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // Use FaTimes instead of XCircle
import { motion } from 'framer-motion'; // Import motion from framer-motion

const ImageModal = ({ modalImageUrl, showModal, setShowModal }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const MAX_ZOOM = 3; // Maximum zoom level
  const MIN_ZOOM = 1; // Minimum zoom level

  // Close modal function
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle zoom change using the slider
  const handleZoomChange = (e) => {
    setZoomLevel(parseFloat(e.target.value));
  };

  return (
    showModal && (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-lg"
        onClick={closeModal}
      >
        <motion.div
          className="relative w-full max-w-3xl bg-[#1f1f1f] bg-opacity-90 rounded-xl shadow-2xl p-6 overflow-hidden ]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button for Desktop */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 hidden sm:block text-white bg-[#ff007f] hover:bg-[#ff3385] p-2 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* Title Area */}
          <div className="flex justify-between items-center sm:justify-center mb-4">
            <h2 className="text-2xl font-bold text-[#00ff00] tracking-wider text-center font-mono">
              Image Preview
            </h2>
            {/* Close Icon for Mobile */}
            <button
              onClick={closeModal}
              className="sm:hidden text-white bg-[#ff007f] hover:bg-[#ff3385] p-2 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <span className="text-[#00ff00] text-lg font-mono">Zoom</span>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.1}
              value={zoomLevel}
              onChange={handleZoomChange}
              className="w-64 bg-[#444] appearance-none h-2 rounded-lg"
            />
            <span className="text-[#00ff00] text-lg">{zoomLevel.toFixed(1)}</span>
          </div>

          {/* Image Display */}
          <div className="flex justify-center items-center mt-4">
            <motion.img
              src={modalImageUrl}
              alt="Full-size"
              className="object-contain rounded-lg shadow-lg transition-all duration-300 ease-in-out transform"
              style={{ width: `${600 * zoomLevel}px`, height: `${400 * zoomLevel}px` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
          </div>

          
        </motion.div>
      </div>
    )
  );
};

export default ImageModal;
