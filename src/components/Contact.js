import React from "react";

const Contact = () => {
    return(
        <section className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-cyan-600 mb-6">Contact Information</h2>
            <ul className="space-y-4">
                <li className="text-lg">
                    <span className="font-medium text-gray-700">LinkedIn:</span>
                    <a 
                        href="https://www.linkedin.com/in/your-profile" 
                        className="text-cyan-500 hover:text-cyan-700 transition duration-300 ease-in-out"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        your-profile
                    </a>
                </li>
                <li className="text-lg">
                    <span className="font-medium text-gray-700">GitHub:</span>
                    <a 
                        href="https://github.com/your-profile" 
                        className="text-cyan-500 hover:text-cyan-700 transition duration-300 ease-in-out"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        your-profile
                    </a>
                </li>
            </ul>
        </section>
    );
};

export default Contact;
