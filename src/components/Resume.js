import React from "react";
import Header from "./header";
import Objective from "./Objective";
import Education from "./Education";
import Skills from "./Skills";
import Projects from "./Projects";
import Certifications from "./Certifications";
import Extracurricular from "./Extracurricular";
import Contact from "./Contact";

const Resume = () => {
  return (
    <div 
      className="bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('Templates & Apps.png')" }} 
    >
      <div >
        {/* Header Section */}
        <Header />

        {/* Objective Section */}
        <Objective />
        
        {/* Education Section */}
        <Education />

        {/* Skills Section */}
        <Skills />

        {/* Projects Section */}
        <Projects />

        {/* Certifications Section */}
        <Certifications />

        {/* Extracurricular Section */}
        <Extracurricular />

        {/* Contact Section */}
        <Contact />

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Deepak. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Resume;
