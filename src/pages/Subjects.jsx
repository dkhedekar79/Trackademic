import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Edit, Trash2, Clock, Play } from "lucide-react";
import { useTimer } from "../context/TimerContext";
import { useNavigate } from "react-router-dom";

const defaultColors = [
  "#6C5DD3", "#B6E4CF", "#FEC260", "#FF6B6B", 
  "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE"
];

function getTextColor(backgroundColor) {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(d.setDate(diff));
}

function formatLastStudied(ts) {
  if (!ts) return "Never";
  const now = new Date();
  const last = new Date(ts);
  const diffMs = now - last;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return last.toLocaleDateString();
}

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    color: "#6C5DD3",
    goalHours: ""
  });
  const [formError, setFormError] = useState("");
  const [editId, setEditId] = useState(null);
  const [studySessions, setStudySessions] = useState([]);
  const { setTimerSubject, startTimer } = useTimer();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("subjects");
    if (saved) {
      setSubjects(JSON.parse(saved));
    } else {
      const defaultSubjects = [
        { id: 1, name: "Math", color: "#6C5DD3", goalHours: 5 },
        { id: 2, name: "English", color: "#B6E4CF", goalHours: 4 },
        { id: 3, name: "Biology", color: "#FEC260", goalHours: 6 },
        { id: 4, name: "History", color: "#FF6B6B", goalHours: 3 }
      ];
      setSubjects(defaultSubjects);
      localStorage.setItem("subjects", JSON.stringify(defaultSubjects));
    }
    // Load study sessions
    const sessions = localStorage.getItem("studySessions");
    if (sessions) setStudySessions(JSON.parse(sessions));
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (!form.name.trim()) {
      setFormError("Please enter a subject name.");
      return;
    }
    if (!form.goalHours || form.goalHours <= 0) {
      setFormError("Please enter a valid goal hours per week.");
      return;
    }
    if (editId) {
      setSubjects(subjects.map(s => s.id === editId ? { ...s, ...form, goalHours: Number(form.goalHours) } : s));
    } else {
      setSubjects([...subjects, { 
        ...form, 
        id: Date.now(), 
        goalHours: Number(form.goalHours) 
      }]);
    }
    setForm({ name: "", color: "#6C5DD3", goalHours: "" });
    setFormError("");
    setShowModal(false);
    setEditId(null);
  };

  const handleEdit = (subject) => {
    setForm({
      name: subject.name,
      color: subject.color,
      goalHours: subject.goalHours.toString()
    });
    setEditId(subject.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const resetForm = () => {
    setForm({ name: "", color: "#6C5DD3", goalHours: "" });
    setFormError("");
    setEditId(null);
  };

  const handleAddTask = (subjectName) => {
    // Navigate to tasks page with subject pre-selected
    // Store the subject name in localStorage for the tasks page to pick up
    localStorage.setItem("preSelectedSubject", subjectName);
    window.location.href = "/tasks";
  };

  const handleStartTimer = (subjectName) => {
    // Set the subject in the timer context
    setTimerSubject(subjectName);
    // Navigate to study page with subject as URL parameter
    navigate(`/study?subject=${encodeURIComponent(subjectName)}`);
  };

  // --- Calculate study stats for each subject ---
  const now = new Date();
  const weekStart = getStartOfWeek(now);

  function getSubjectStats(subjectName) {
    const sessions = studySessions.filter(s => s.subjectName === subjectName);
    const weekSessions = sessions.filter(s => new Date(s.timestamp) >= weekStart);
    const minutesThisWeek = weekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const hoursThisWeek = minutesThisWeek / 60;
    const lastSession = sessions.length > 0 ? Math.max(...sessions.map(s => s.timestamp)) : null;
    return {
      hoursThisWeek,
      minutesThisWeek,
      lastSession
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] mt-20 flex">
      <Sidebar />
      <div className="flex-1 ml-16 transition-all duration-300 ease-in-out [body>div>aside:hover_+_div&]:ml-64">
        <div className="p-8">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">Your Subjects</h1>
              <button
                className="rounded-2xl bg-[#6C5DD3] text-white px-4 py-2 font-semibold shadow hover:bg-[#7A6AD9] transition flex items-center gap-2"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const textColor = getTextColor(subject.color);
                const stats = getSubjectStats(subject.name);
                const percent = Math.min(100, (stats.hoursThisWeek / subject.goalHours) * 100);
                return (
                  <div
                    key={subject.id}
                    className="rounded-xl p-6 transition-transform duration-200 hover:scale-105 shadow-lg flex flex-col"
                    style={{ 
                      backgroundColor: subject.color,
                      color: textColor
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold" style={{ color: textColor }}>
                        {subject.name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="p-1 rounded hover:bg-black/10 transition"
                          title="Edit"
                          style={{ color: textColor }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id)}
                          className="p-1 rounded hover:bg-red-600/20 transition"
                          title="Delete"
                          style={{ color: textColor }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-white/30 rounded-full mb-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${percent}%`,
                          background: textColor === '#000000' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)'
                        }}
                      ></div>
                    </div>
                    
                    <div className="text-sm font-semibold mb-1" style={{ color: textColor }}>
                      {stats.hoursThisWeek.toFixed(2)} hours studied this week
                    </div>
                    <div className="text-xs opacity-80 mb-1" style={{ color: textColor }}>
                      Goal: {subject.goalHours} hours/week
                    </div>
                    <div className="text-xs opacity-80 mb-4" style={{ color: textColor }}>
                      Last studied: {formatLastStudied(stats.lastSession)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleAddTask(subject.name)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor: textColor === '#000000' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                          color: textColor
                        }}
                      >
                        <Plus className="w-3 h-3" />
                        Add Task
                      </button>
                      <button
                        onClick={() => handleStartTimer(subject.name)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor: textColor === '#000000' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                          color: textColor
                        }}
                      >
                        <Play className="w-3 h-3" />
                        Start Timer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {subjects.length === 0 && (
              <div className="text-center text-white/60 py-12">
                <p className="text-lg mb-2">No subjects yet!</p>
                <p className="text-sm">Click "Add Subject" to get started.</p>
              </div>
            )}

            {/* Add/Edit Subject Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-[#23234a] p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-white">
                      {editId ? "Edit Subject" : "Add New Subject"}
                    </span>
                    <button 
                      className="text-white text-xl" 
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      &times;
                    </button>
                  </div>
                  {formError && (
                    <div className="bg-red-500/80 text-white text-sm rounded px-3 py-2 mb-2">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-white mb-1">Subject Name</label>
                    <input
                      className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-4"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g., Physics"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Goal Hours per Week</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-4"
                      value={form.goalHours}
                      onChange={(e) => setForm({ ...form, goalHours: e.target.value })}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <label className="text-white mb-1">Color</label>
                    <div className="grid grid-cols-6 gap-2 mb-4">
                      {defaultColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 transition ${
                            form.color === color ? "border-white" : "border-white/20"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setForm({ ...form, color })}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    className="w-full rounded-2xl bg-[#6C5DD3] text-white px-4 py-2 font-semibold shadow hover:bg-[#7A6AD9] transition"
                    onClick={addSubject}
                  >
                    {editId ? "Update Subject" : "Add Subject"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 