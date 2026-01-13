import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const Hero = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowDemo(false);
    };
    if (showDemo) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDemo]);

  const videoRef = useRef(null);

  useEffect(() => {
    if (showDemo && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Autoplay was likely blocked by the browser. Leave controls visible for user to start.
        });
      }
    } else if (!showDemo && videoRef.current) {
      // Pause when modal closes
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {
        // ignore errors when pausing/resetting video
      }
    }
  }, [showDemo]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800/50 rounded-full border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:bg-gray-800/70">
            <i className="ri-sparkling-line text-purple-400 animate-pulse"></i>
            <span className="text-sm text-gray-300">
              Revolutionary AI-Powered Development
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-400 to-purple-600 bg-clip-text text-transparent leading-tight animate-gradient-shift bg-[length:200%_auto]">
            Smart Developer
            <br />
            Assistant
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed transition-all duration-500">
            A sophisticated real-time collaborative development environment with
            AI-powered assistance. Build, collaborate, and execute code
            seamlessly with your team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md shadow-lg shadow-purple-500/50 group transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 flex items-center gap-2"
              onClick={() => navigate("/register")}
            >
              Get Started
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
            <button
              type="button"
              className="border border-purple-500/50 hover:bg-purple-500/10 px-8 py-3 rounded-md transition-all duration-300 hover:scale-110 hover:border-purple-500 text-white"
              onClick={() => setShowDemo(true)}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Animated feature cards */}
        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/50">
            <div className="text-4xl mb-3 transition-transform duration-300 hover:scale-125">
              ⚡
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Real-time Collaboration
            </h3>
            <p className="text-sm text-gray-400">
              Work together seamlessly with Socket.IO powered live updates
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/50">
            <div className="text-4xl mb-3 transition-transform duration-300 hover:scale-125">
              🤖
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              AI-Powered Assistant
            </h3>
            <p className="text-sm text-gray-400">
              Google Gemini AI generates code and solutions instantly
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/50">
            <div className="text-4xl mb-3 transition-transform duration-300 hover:scale-125">
              🚀
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              In-Browser Execution
            </h3>
            <p className="text-sm text-gray-400">
              Run Node.js code directly in the browser with WebContainer
            </p>
          </div>
        </div>
      </div>
      {/* Demo video modal */}
      {showDemo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowDemo(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setShowDemo(false)}
                className="absolute -top-6 right-0 text-white bg-gray-800/40 hover:bg-gray-800/60 rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="Close demo"
              >
                ×
              </button>
              <video
                ref={videoRef}
                src="/Demo-video/Demo.mp4"
                controls
                autoPlay
                className="w-full aspect-video rounded-lg bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
