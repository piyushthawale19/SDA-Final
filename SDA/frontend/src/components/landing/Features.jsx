import React from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const features = [
  {
    icon: "ri-team-line",
    title: "Team Collaboration",
    description:
      "Real-time collaborative editing with JWT authentication and project-based room management through Socket.IO",
  },
  {
    icon: "ri-code-s-slash-line",
    title: "Smart Code Editor",
    description:
      "Collaborative file tree management with persistent MongoDB storage and instant synchronization across all team members",
  },
  {
    icon: "ri-cpu-line",
    title: "WebContainer Technology",
    description:
      "Execute Node.js code directly in the browser with a fully sandboxed environment for safe and instant prototyping",
  },
  {
    icon: "ri-message-3-line",
    title: "AI Code Generation",
    description:
      "Type @ai in chat to trigger Google Gemini AI that generates structured code and automatically mounts it to your project",
  },
  {
    icon: "ri-lock-line",
    title: "Secure Authentication",
    description:
      "JWT-based authentication with Redis token blacklisting ensures secure sessions and protected project access",
  },
  {
    icon: "ri-database-2-line",
    title: "Persistent Storage",
    description:
      "MongoDB backend stores all your projects, file trees, and user data with reliable cloud-based persistence",
  },
];

const Features = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="features"
      className="py-24 px-6 bg-gray-900 relative overflow-hidden scroll-mt-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent transition-all duration-500">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-500">
            Everything you need for modern team development with intelligent AI
            support
          </p>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/50"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="mb-4 inline-flex p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110">
                <i
                  className={`${feature.icon} text-2xl text-purple-400 transition-transform duration-300 group-hover:rotate-12`}
                ></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 transition-colors duration-300 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
