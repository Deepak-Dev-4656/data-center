import React from "react";

const Education = () => {
  return (
    <section className="mb-8">
      <h2 className="text-3xl font-semibold text-cyan-600 border-b-4 border-cyan-500 pb-2 mb-6">
        Education
      </h2>
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 p-6 rounded-lg shadow-2xl backdrop-blur-md bg-opacity-40">
        <h3 className="text-2xl font-semibold text-yellow-400 mb-2">
          Class 12 (Science)
        </h3>
        <p className="text-lg text-gray-200 mb-2">
          <span className="font-bold text-cyan-300 text-xl">Institution: </span>
          <span className="text-white">H/S Jamni Paharpur, Godda, Jharkhand</span>
        </p>
        <p className="text-lg text-gray-200 mb-2">
          <span className="font-bold text-cyan-300 text-xl">Subjects: </span>
          <span className="text-white">
            Physics, Chemistry, Mathematics, Computer Science, English
          </span>
        </p>
        <p className="text-lg text-gray-200 mb-2">
          <span className="font-bold text-cyan-300 text-xl">Completion Year: </span>
          <span className="text-white">[2025-2026]</span>
        </p>
      </div>
    </section>
  );
};

export default Education;
