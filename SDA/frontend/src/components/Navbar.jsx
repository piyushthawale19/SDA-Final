// import React, { createContext, useContext, useState } from "react";

// // Create the context
// export const UserContext = createContext();

// // Provider component
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/user.context";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <nav className="w-full px-6 py-2 flex justify-between items-center border-b bg-white dark:bg-gray-900 shadow">
      {/* Left: Logo */}
      {/* <div className="cursor-pointer">
  App Logo
 <img
  src="/Logo/LogoBlackR.png"
  alt="logo"
  className="hidden dark:block w-16 h-16 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500 object-contain"
/>
<img
  src="/Logo/LogoBV.png"
  alt="logo"
  className="block dark:hidden w-16 h-16 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500 object-contain"
/>
</div> */}
<div
          className="flex items-center gap-2 cursor-pointer"
          // onClick={() => navigate("/")}
        >
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


      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        <button
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-700 dark:to-gray-600 text-white hover:scale-105 transform transition-shadow duration-150 shadow-md hover:shadow-lg ring-0 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
          title="Publish to GitHub"
          aria-label="Publish to GitHub"
          onClick={() => document.dispatchEvent(new CustomEvent("push-to-github"))}
        >
          <i className="ri-github-fill text-lg" aria-hidden="true" />
          <span className="hidden md:inline text-sm font-medium">Publish</span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src={user?.avatar || "/avatars/default1.png"}
              alt="avatar"
              className="w-8 h-8 rounded-md object-cover border"
            />
            <span className="hidden sm:block text-sm font-medium dark:text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                : user?.email
                ? user.email.split("@")[0].charAt(0).toUpperCase() +
                  user.email.split("@")[0].slice(1)
                : "Guest"}
            </span>
          </button>
          {menuOpen && <ProfileMenu user={user} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
