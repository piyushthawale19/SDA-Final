import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gray-900/80 backdrop-blur-lg border-b border-purple-500/20 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-transform hover:scale-110">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Smart Developer Assistant
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Features
          </a>
          <a
            href="#tech"
            className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Technology
          </a>
          <button
            className="border border-purple-500/50 hover:bg-purple-500/10 px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 text-white"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 bg-gray-800/90 backdrop-blur-md rounded-lg p-4">
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#tech"
            className="text-gray-300 hover:text-white transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Technology
          </a>
          <button
            className="border border-purple-500/50 hover:bg-purple-500/10 px-4 py-2 rounded-md transition-all duration-300 text-white"
            onClick={() => {
              navigate("/login");
              setIsMobileMenuOpen(false);
            }}
          >
            Sign In
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-lg shadow-purple-500/50 transition-all duration-300"
            onClick={() => {
              navigate("/register");
              setIsMobileMenuOpen(false);
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
