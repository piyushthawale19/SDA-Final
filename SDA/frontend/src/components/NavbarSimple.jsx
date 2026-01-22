import React from "react";

const NavbarSimple = () => {
  return (
    <nav className="w-full px-6 py-2 flex justify-between items-center border-b bg-white dark:bg-gray-900 shadow">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-transform hover:scale-110">
          <span className="text-lg font-bold text-white">S</span>
        </div>
        <span
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 dark:from-purple-300 dark:via-pink-300 dark:to-indigo-500 animate-gradient-shift"
          style={{ backgroundSize: "200% 200%" }}
        >
          Smart Developer Assistant
        </span>
      </div>

      {/* Empty right side - profile moved to sidebar */}
      <div></div>
    </nav>
  );
};

export default NavbarSimple;
