import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [opacity, setOpacity] = useState(1);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Fade out as user scrolls down, fade in as user scrolls up
      const scrollY = window.scrollY;
      // Fade out between 0 and 60px, clamp between 1 and 0
      const newOpacity = Math.max(0, 1 - scrollY / 60);
      setOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-4 bg-[#6C5DD3] shadow-md fixed top-0 left-0 z-50 h-20 transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* Left: Logo */}
      <div className="flex-1 min-w-0">
        <Link to="/dashboard" className="text-2xl font-extrabold text-white whitespace-nowrap">
          Trackademic
        </Link>
      </div>
      {/* Center: DASHBOARD if on dashboard */}
      <div className="flex-1 flex justify-center min-w-0">
        {(["/dashboard","/tasks","/schedule","/subjects","/study","/settings"].includes(location.pathname)) && (
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold tracking-widest bg-[linear-gradient(135deg,_#E0BBE4,_white)] text-transparent bg-clip-text">
              {location.pathname === "/dashboard" && "DASHBOARD"}
              {location.pathname === "/tasks" && "TASKS"}
              {location.pathname === "/schedule" && "SCHEDULE"}
              {location.pathname === "/subjects" && "SUBJECTS"}
              {location.pathname === "/study" && "STUDY"}
              {location.pathname === "/settings" && "SETTINGS"}
            </span>
            <span className="text-sm font-medium text-[#EDE9FE] mt-1">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        )}
      </div>
      {/* Right: Auth links/buttons */}
      <div className="flex-1 flex justify-end gap-4 min-w-0">
        {!user && (
          <>
            <Link to="/login" className="px-4 py-2 rounded-lg text-[#6C5DD3] font-semibold hover:bg-[#EDE9FE] transition">Login</Link>
            <Link to="/signup" className="px-4 py-2 rounded-lg text-[#6C5DD3] font-semibold hover:bg-[#EDE9FE] transition">Sign Up</Link>
          </>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white bg-[#6C5DD3] font-semibold hover:bg-[#7A6AD9] transition"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 