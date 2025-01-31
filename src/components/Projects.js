import React from "react";

const Projects = () => {
    return(
        <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-600">Projects</h2>
        <div className="mt-2 text-gray-800">
          <div className="mb-4">
            <h3 className="text-xl font-medium">Personal Portfolio Website</h3>
            <p>Built a responsive portfolio website using HTML, CSS, and JavaScript showcasing my skills and projects.</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-medium">To-Do List App</h3>
            <p>Developed a task management application using React and Node.js with user authentication and task tracking features.</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-medium">Weather App</h3>
            <p>Created a weather forecast app using React and integrated APIs to display real-time weather data.</p>
          </div>
        </div>
      </section>
    );
};

export default Projects ;