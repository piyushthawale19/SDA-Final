import React from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const techStack = [
  { name: "MongoDB", icon: "ri-database-2-line" },
  { name: "Express.js", icon: "ri-server-line" },
  { name: "React", icon: "ri-reactjs-line" },
  { name: "Node.js", icon: "ri-nodejs-line" },
  { name: "Socket.IO", icon: "ri-radio-line" },
  { name: "WebContainer", icon: "ri-container-line" },
  { name: "Google Gemini AI", icon: "ri-brain-line" },
  { name: "JWT & Redis", icon: "ri-shield-check-line" },
];

const TechStack = () => {
  const { ref: techRef, isVisible: techVisible } = useScrollAnimation(0.1);
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="tech"
      className="py-24 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
            Technology Stack
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto transition-all duration-500">
            Built with cutting-edge technologies to deliver unparalleled
            performance and reliability
          </p>
        </div>

        <div
          ref={techRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16 transition-all duration-1000 ${
            techVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/50 text-center"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="mb-3 inline-flex p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110">
                <i
                  className={`${tech.icon} text-3xl text-purple-400 transition-transform duration-300 group-hover:rotate-12`}
                ></i>
              </div>
              <h3 className="font-semibold text-white">{tech.name}</h3>
            </div>
          ))}
        </div>

        <div
          ref={contentRef}
          className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 ${
            contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="p-8 rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/50">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">
              The Problem
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Modern industries and educational environments demand efficient
              team collaboration, problem solving, and rapid prototyping. While
              existing platforms like Slack or Microsoft Teams enable
              communication, they lack intelligent AI support and the ability to
              execute solutions directly. On the other hand, AI tools such as
              ChatGPT provide smart responses but fail to support real-time team
              collaboration or hands-on code execution.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/50">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Our Solution
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Smart Developer Assistant (SDA) bridges this gap by combining
              real-time collaborative editing, AI-powered code generation, and
              in-browser code execution in a single, unified platform. With SDA,
              teams can collaborate seamlessly, leverage AI for instant code
              solutions, and execute their projects directly in the browser—all
              while maintaining secure, persistent project storage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
