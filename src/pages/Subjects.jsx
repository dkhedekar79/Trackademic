import React from "react";
import Sidebar from "../components/Sidebar";
export default function Subjects() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] mt-20 flex">
      <Sidebar />
      <div className="flex-1 ml-16 transition-all duration-300 ease-in-out [body>div>aside:hover_+_div&]:ml-64">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Your Subjects</h1>
          <p className="text-white/80 mb-4">This is the Subjects page. Add your subjects UI here.</p>
        </div>
      </div>
    </div>
  );
} 