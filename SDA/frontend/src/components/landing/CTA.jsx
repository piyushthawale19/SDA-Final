import React from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const CTA = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-purple-600/20 to-transparent"></div>
      </div>

      <div
        ref={ref}
        className={`container mx-auto relative z-10 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight animate-gradient-shift bg-[length:200%_auto]">
            Ready to Transform Your
            <br />
            Development Workflow?
          </h2>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-500">
            Join developers worldwide who are building the future with Smart
            Developer Assistant. Start collaborating, coding, and creating
            today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md shadow-lg shadow-purple-500/50 group transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 flex items-center gap-2"
              onClick={() => navigate("/register")}
            >
              Start Building Now
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>

            <a
              href="https://github.com/piyushthawale19"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-purple-500/50 hover:bg-purple-500/10 px-8 py-3 rounded-md group transition-all duration-300 hover:scale-110 hover:border-purple-500 text-white flex items-center gap-2"
            >
              <i className="ri-github-fill group-hover:rotate-12 transition-transform duration-300"></i>
              View on GitHub
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/50">
              <div className="text-4xl font-bold text-purple-400 mb-2 transition-all duration-300">
                1000+
              </div>
              <div className="text-gray-400">Active Projects</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/50">
              <div className="text-4xl font-bold text-blue-400 mb-2 transition-all duration-300">
                5000+
              </div>
              <div className="text-gray-400">Happy Developers</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/50">
              <div className="text-4xl font-bold text-purple-400 mb-2 transition-all duration-300">
                99.9%
              </div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
