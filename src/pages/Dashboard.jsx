// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { FlameIcon } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Card component
  const Card = ({ title, icon, children, className = "" }) => (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className={`rounded-xl bg-white/5 p-5 border border-white/10 backdrop-blur shadow-xl ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-purple-400 text-2xl">{icon}</div>}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  // Example progress data
  const studyHours = 12.5;
  const studyGoal = 20;
  const studyProgress = Math.min((studyHours / studyGoal) * 100, 100);

  return (
     
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] mt-20 flex">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 ml-16 transition-all duration-300 ease-in-out [body>div>aside:hover_+_div&]:ml-64">
        {/* Header Section */}
        {/* Summary & Streak */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-8 bg-#F8F9FC">
          <Card title="This Week's Study">
            <span className="text-3xl font-bold text-white">{studyHours} <small className="text-base font-normal text-gray-300">hrs</small></span>
            <div className="w-full bg-white/10 rounded-full h-3 my-3 overflow-hidden">
              <div className="bg-[#6C5DD3] h-3 rounded-full" style={{ width: `${studyProgress}%` }} />
            </div>
            <small className="block text-gray-300 mb-2">{Math.round(studyProgress)}% of your {studyGoal} hr goal</small>
            {studyProgress >= 100 ? (
              <p className="text-[#B6E4CF] mt-2">🎯 Goal met!</p>
            ) : (
              <p className="text-[#FEC260] mt-2">Keep going!</p>
            )}
          </Card>
          <Card title="Streak" icon={null}>
            <div className="flex flex-col">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FlameIcon className="w-7 h-7 text-orange-400" />
                  <span className="text-3xl font-bold text-orange-400">5 <small className="text-base font-normal text-gray-300">days in a row</small></span>
                </div>
              </div>
              <div className="flex-1" />
              <p className="text-sm text-gray-300 mt-4">Keep up the great work!</p>
            </div>
          </Card>
          <Card title="Flashcards This Week" icon={null}>
            <div className="mb-6">
              <span className="block text-4xl font-extrabold text-white mb-2">12</span>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition"
              onClick={() => window.location.hash = '#flashcards'}
            >
              <span className="text-xl">🧠</span> Go to Flashcards
            </button>
          </Card>
        </section>
        {/* Today's Tasks & Timer */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-8">
          <Card title="Today's Tasks" icon={"📘"}>
            <ul className="pl-5 list-disc space-y-1 text-[#2D2D2D]">
              <li>📘 Biology – 45 mins – <span className="text-[#B6E4CF]">✅</span></li>
              <li>📗 Chemistry – 30 mins – <span className="text-[#FEC260]">⏳</span></li>
              <li>📕 History – 20 mins – <span className="text-red-500">❌</span></li>
            </ul>
            <button className="mt-4 px-5 py-2 rounded-lg bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">+ Add Task</button>
          </Card>
          <Card title="Smart Timer" icon={"⏱️"}>
            <p className="text-[#2D2D2D]">📚 Subject: Maths</p>
            <p className="text-[#2D2D2D]">⏱️ Time Left: 20:00</p>
            <div className="mt-3 flex gap-3">
              <button className="px-5 py-2 rounded-lg bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">Start</button>
              <button className="px-5 py-2 rounded-lg bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">Stop</button>
            </div>
          </Card>
        </section>
        {/* Flashcard Reminder */}
        <section className="px-6 py-8 max-w-3xl mx-auto">
          <Card title="Flashcards" icon={"🧠"}>
            <p className="text-white">🧠 You have 12 cards to revise today</p>
            <p className="text-white">🔁 Last set: Photosynthesis – 3 days ago</p>
            <button className="mt-4 px-5 py-2 rounded-lg bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">Revise Now</button>
          </Card>
        </section>
        {/* Insights */}
        <section className="px-6 py-8 max-w-3xl mx-auto">
          <h3 className="font-semibold text-lg mb-2 text-[#2D2D2D]">Insights</h3>
          <p className="text-[#2D2D2D]">📊 Most productive time: 4–6 PM</p>
          <p className="text-[#2D2D2D]">📘 Top subject: Biology</p>
          <p className="text-[#717385]">📅 Productivity Heatmap: <span className="italic text-gray-400">(Coming soon)</span></p>
        </section>
        {/* Gamification */}
        <section className="px-6 py-8 max-w-3xl mx-auto">
          <Card title="Achievements" icon={"🏅"}>
            <p className="text-[#2D2D2D]">🏅 Memory Master – 84% complete</p>
            <p className="text-[#2D2D2D]">🎮 Level 3 – 250 XP</p>
            <button className="mt-4 px-5 py-2 rounded-lg bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">Share Achievement</button>
          </Card>
        </section>
        {/* Quick Access */}
        <section className="px-6 py-8 flex flex-wrap gap-4">
          <button className="flex-1 min-w-[200px] px-6 py-4 rounded-2xl bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">+ Add Subject</button>
          <button className="flex-1 min-w-[200px] px-6 py-4 rounded-2xl bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">+ Add Flashcard Set</button>
          <button className="flex-1 min-w-[200px] px-6 py-4 rounded-2xl bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">+ Set New Goal</button>
          <button className="flex-1 min-w-[200px] px-6 py-4 rounded-2xl bg-[#6C5DD3] text-white font-semibold shadow hover:bg-[#7A6AD9] transition">📆 Sync Calendar</button>
        </section>
        {/* Footer */}
        <footer className="py-6 text-center bg-[#3F3D56] text-white mt-10">
          <p>© 2025 Trackviso. Keep learning, keep growing!</p>
        </footer>
      </div>
    </div>
  );
}
