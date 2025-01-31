import React from "react";

const Objective = () => {
  return (
    <section className="mb-8 p-8 max-w-4xl mx-auto rounded-lg shadow-xl bg-gradient-to-r from-cyan-100 to-blue-100 bg-opacity-50 backdrop-blur-lg">
      <h2 className="text-3xl font-semibold text-cyan-600 mb-6 border-b-4 border-cyan-600 pb-2">
        Objective
      </h2>
      <p className="text-lg text-gray-800 leading-relaxed tracking-wide">
        <span className="bg-gradient-to-r from-yellow-300 to-pink-300 text-transparent bg-clip-text font-semibold">
          Passionate and highly motivated Class 12 student specializing in Science with a keen interest in Web Development and Software Engineering.
        </span>{" "}
        Looking for an opportunity to apply my skills in 
        <span className="font-semibold text-cyan-600"> HTML, JavaScript, CSS, React, Python, and Node.js</span> 
        in real-world projects and contribute to innovative solutions.
      </p>
    </section>
  );
};

export default Objective;
