import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const UploadOptions = () => {
  const uploadOptions = [
    {
      path: "/images",
      title: "Image Upload",
      description:
        "Our Image Upload service leverages advanced algorithms to ensure high-speed processing while maintaining the integrity of your image files. Whether you're uploading JPEG, PNG, or TIFF formats, our platform ensures quick compression, automatic format optimization, and secure storage, making it easy for you to access and manage your image collection from anywhere.",
      image: "Blue Textured Space Landscape Hello World Desktop Wallpaper.png", // Replace with your image URL
    },
    {
      path: "/videos",
      title: "Video Upload",
      description:
        "The Video Upload feature is designed to handle large video files effortlessly, supporting formats such as MP4, AVI, and MOV. With optimized transcoding algorithms, our platform ensures that your videos are uploaded and processed swiftly, without compromising quality. You can also manage resolution settings, apply watermarks, and store your content securely in a cloud-based infrastructure that is accessible globally.",
      image: "ey-digital-display-of-industry-data-and-analytics.webp", // Replace with your image URL
    },
    {
      path: "/pdfs",
      title: "PDF Upload",
      description:
        "Our PDF Upload solution guarantees seamless uploading of multiple documents simultaneously, with robust security measures in place to protect your sensitive data. Whether it's large-sized PDFs, scanned documents, or interactive forms, our platform supports full-text indexing and encryption. We also offer metadata extraction for efficient file organization, allowing you to manage your PDFs with ease and ensuring that every document is easily retrievable when needed.",
      image: "6604d3e2a03d9.png", // Replace with your image URL
    },
    {
      path: "/music",
      title: "Music Upload",
      description:
        "With our Music Upload feature, you can store your audio files, such as MP3, WAV, and FLAC formats, securely and access them across devices. Our platform automatically tags your music with metadata such as track name, artist, and album, ensuring your collection is well-organized. Additionally, we support batch uploads, and our system performs automatic audio compression for faster uploads while maintaining high audio quality, making your music management effortless and scalable.",
      image: "pnml343o7geyjdgd0o2b.jpg", // Replace with your image URL
    },
    {
      path: "/text",
      title: "Text Editor",
      description:
        "Our Text Editor allows you to write, edit, and save your text easily. Whether it's notes, articles, or simple drafts, the editor provides a smooth writing experience with real-time save functionality.",
      image: "nlp-tutorial-text-classification-60b609c0b7a2622d2b0d6122f2b27f97.png", // Replace with your image URL
    },
  ];

  useEffect(() => {
    const cards = document.querySelectorAll(".upload-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-up"); // Trigger animation
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the card is in view
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="py-16 bg-gray-900">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-green-400">
        Choose an Upload Option
      </h2>
      <div className="max-w-6xl mx-auto px-6">
        {uploadOptions.map(({ path, title, description, image }, index) => (
          <div
            key={title}
            className={`upload-card flex flex-col items-center bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl mb-8 ${
              index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* Left Side: Image */}
            <div className="flex-1 flex justify-center mb-4 md:mb-0">
              <img
                src={image}
                alt={title}
                className="w-full md:w-105 lg:w-[920px] max-w-full h-auto rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Right Side: Text and Button */}
            <div className="flex-1 text-center md:text-left md:ml-6">
              <h3 className="text-2xl font-extrabold text-white glitch-effect">{title}</h3>
              <p className="mt-2 text-sm opacity-80 leading-relaxed text-gray-300">{description}</p>
              <div className="mt-4">
                <Link
                  to={path}
                  className="upload-btn px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full text-white font-semibold shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Upload
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UploadOptions;
