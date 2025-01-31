import React from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaGithub,
  FaGit,
  FaCode,
  FaJava,
} from "react-icons/fa";

const Skills = () => {
  return (
    <section className="mb-12">
      {/* Skills Heading */}
      <h2 className="text-4xl font-bold text-cyan-600 text-center mb-10 relative">
        Skills
        <span className="block w-16 h-1 mt-2 mx-auto bg-cyan-600 rounded"></span>
      </h2>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 justify-items-center">
        {/* Individual Skill */}
        {[
          { icon: <FaHtml5 />, color: "text-orange-500", name: "HTML" },
          { icon: <FaCss3Alt />, color: "text-blue-500", name: "CSS" },
          { icon: <FaJs />, color: "text-yellow-500", name: "JavaScript" },
          { icon: <FaJava />, color: "text-red-500", name: "Java" },
          { icon: <FaReact />, color: "text-cyan-500", name: "React" },
          { icon: <FaNodeJs />, color: "text-green-500", name: "Node.js" },
          { icon: <FaPython />, color: "text-blue-600", name: "Python" },
          { icon: <FaGit />, color: "text-orange-600", name: "Git" },
          { icon: <FaGithub />, color: "text-gray-800", name: "GitHub" },
          { icon: <FaCode />, color: "text-blue-800", name: "VS Code" },
        ].map((skill, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center text-center"
          >
            <div
              className={`relative w-28 h-28 rounded-full shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-xl`}
              style={{
                perspective: "1500px", /* Adds perspective to parent container */
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${skill.color} via-pink-500 to-purple-600 rounded-full group-hover:rotate-12 transition-transform duration-500`}
                style={{
                  transform: "rotateY(0deg) translateZ(20px)", /* Creates 3D effect */
                }}
              />
              <div
                className={`flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-inner group-hover:scale-110 transition-transform duration-500`}
              >
                {React.cloneElement(skill.icon, {
                  className: `${skill.color} group-hover:scale-125 transition-all duration-500`,
                  size: 70,
                })}
              </div>
            </div>
            <span className="mt-4 text-lg font-medium text-gray-200 group-hover:text-white transition-all duration-500">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
