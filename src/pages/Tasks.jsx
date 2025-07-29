import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Pencil, Trash2 } from "lucide-react";
import { jsonrepair } from "jsonrepair";


const priorities = [
  { label: "Low", color: "border-blue-500" },
  { label: "Medium", color: "border-yellow-500" },
  { label: "High", color: "border-red-500" },
];

const subjects = ["Math", "English", "Biology", "History"];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ name: "", subject: "", time: "", priority: "Low", scheduledDate: "" });
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInstructions, setAiInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tab, setTab] = useState("todo");
  const [popTaskId, setPopTaskId] = useState(null);
  const [sortBy, setSortBy] = useState("subject");
  const [editId, setEditId] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!form.name.trim() || !form.subject.trim() || !form.time.trim()) {
      setFormError("Please enter a task name, subject, and duration.");
      return;
    }
    if (editId) {
      setTasks(tasks.map(t => t.id === editId ? { ...t, ...form } : t));
    } else {
      setTasks([...tasks, { ...form, id: Date.now(), done: false }]);
    }
    setForm({ name: "", subject: "", time: "", priority: "Low", scheduledDate: "" });
    setFormError("");
    setShowModal(false);
    setEditId(null);
  };

  const toggleDone = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? t.done
            ? { ...t, done: false, doneAt: undefined }
            : { ...t, done: true, doneAt: Date.now() }
          : t
      )
    );
    setPopTaskId(id);
    setTimeout(() => setPopTaskId(null), 350);
  };

  const priorityColor = (priority) => {
    return priorities.find((p) => p.label === priority)?.color || "border-gray-300";
  };

  // Helper to get scheduling status
  const getScheduleStatus = (scheduledDate) => {
    if (!scheduledDate) return null;
    const today = new Date();
    const sched = new Date(scheduledDate);
    const isToday = sched.toDateString() === today.toDateString();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const isTomorrow = sched.toDateString() === tomorrow.toDateString();
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    if (sched < today.setHours(0,0,0,0)) return "Overdue";
    return sched.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Sorting logic
  const getSortedTasks = (tasksArr) => {
    let sorted = [...tasksArr];
    if (sortBy === "subject") {
      sorted.sort((a, b) => (a.subject || "").localeCompare(b.subject || ""));
    } else if (sortBy === "difficulty") {
      const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
      sorted.sort((a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3));
    } else if (sortBy === "schedule") {
      sorted.sort((a, b) => {
        if (!a.scheduledDate && !b.scheduledDate) return 0;
        if (!a.scheduledDate) return 1;
        if (!b.scheduledDate) return -1;
        return new Date(a.scheduledDate) - new Date(b.scheduledDate);
      });
    }
    return sorted;
  };

  // Calculate summary stats
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

  const toDoCount = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.filter((t) => t.done).length;
  const scheduledTodayCount = tasks.filter((t) => {
    if (!t.time) return false;
    const taskDate = new Date(`${now.toISOString().slice(0,10)}T${t.time}`);
    return taskDate >= startOfToday && taskDate < new Date(startOfToday.getTime() + 24*60*60*1000);
  }).length;

  // Auto-delete done tasks after 7 days
  React.useEffect(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const filtered = tasks.filter(
      (t) => !t.done || !t.doneAt || now - t.doneAt < sevenDays
    );
    if (filtered.length !== tasks.length) setTasks(filtered);
    // eslint-disable-next-line
  }, [tasks]);

  const handleEdit = (task) => {
    setForm({
      name: task.name,
      subject: task.subject,
      time: task.time,
      priority: task.priority,
      scheduledDate: task.scheduledDate || ""
    });
    setEditId(task.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Example topics for AI generation
  const subjectTopics = {
    Math: ["Algebra", "Geometry", "Calculus", "Statistics", "Trigonometry", "Probability", "Graphs", "Equations", "Word Problems", "Functions"],
    English: ["Essay Writing", "Poetry Analysis", "Reading Comprehension", "Grammar", "Literature Review", "Creative Writing", "Vocabulary", "Book Report", "Speech Prep", "Drama"],
    Biology: ["Cell Structure", "Genetics", "Photosynthesis", "Human Body", "Ecology", "Evolution", "Enzymes", "Respiration", "Osmosis", "Plant Biology"],
    History: ["World War I", "World War II", "Cold War", "Industrial Revolution", "Ancient Rome", "Civil Rights", "French Revolution", "Medieval Europe", "Renaissance", "Exploration"],
  };

  // AI Generate Tasks with Hugging Face
  const handleAIGenerate = async () => {
    if (!aiInstructions.trim()) return;
  
    setIsGenerating(true);
  
    try {
      console.log("Using Groq Key:", import.meta.env.VITE_GROQ_API_KEY); // TEMP: for debugging
  
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
                role: "system",
                content: `
              You are a helpful assistant that generates detailed study tasks based on user instructions. 
              Always respond with a valid JSON object containing an array of at least 3 task objects under the key "tasks".
              
              Each task object must include:
              - "name" (string)
              - "subject" (string)
              - "time" (string, in minutes)
              - "priority" ("High", "Medium", or "Low")
              
              DO NOT include explanations, markdown, or anything outside the JSON object.
              Respond ONLY with the JSON object.`
              },
            
            {
              role: "user",
              content: aiInstructions,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API Error:", response.status, errText);
        throw new Error(`API returned ${response.status}: ${errText}`);
      }
  
      const result = await response.json();
      const message = result.choices?.[0]?.message?.content;
  
      console.log("Groq response:", message);
  
      const jsonMatch = message.match(/\{[\s\S]*?\}/);
      let parsed = null;
      try {
        const jsonText = jsonMatch?.[0];
        if (jsonText) {
          parsed = JSON.parse(jsonrepair(jsonText));
        }
      } catch (e) {
        console.error("JSON parse/repair failed:", e);
        throw new Error("AI returned malformed data. Could not fix.");
      }
  
      if (!parsed || !Array.isArray(parsed.tasks)) throw new Error("Invalid JSON format");
  
      const newTasks = parsed.tasks.map(task => ({
        ...task,
        id: Date.now() + Math.random(),
        done: false,
      }));
  
      setTasks(prev => [...prev, ...newTasks]);
  
    } catch (error) {
      console.error("Error generating tasks from Groq:", error);
      alert("Failed to generate tasks. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
      setShowAIModal(false);
      setAiInstructions('');
    }
  };
  
     




  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] mt-20 flex">
      <Sidebar />
      <div className="flex-1 ml-16 transition-all duration-300 ease-in-out [body>div>aside:hover_+_div&]:ml-64">
        <div className="p-8">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Your Tasks</h1>
              <div className="flex gap-2">
                <button
                  className="rounded-2xl bg-[#6C5DD3] text-white px-4 py-2 font-semibold shadow hover:bg-[#7A6AD9] transition"
                  onClick={() => setShowModal(true)}
                >
                  + Add Task
                </button>
                <button
                  className="rounded-2xl bg-[#B6E4CF] text-[#23234a] px-4 py-2 font-semibold shadow hover:bg-[#A0D9C2] transition"
                  onClick={() => setShowAIModal(true)}
                >
                  🤖 AI Generate Tasks
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-white font-semibold">Sort by:</label>
              <select
                className="rounded bg-[#23234a] text-white px-3 py-1 border border-[#6C5DD3]"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="subject">Subject</option>
                <option value="difficulty">Hardest</option>
                <option value="schedule">Earliest Due</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="bg-[#23234a] rounded-xl px-4 py-2 text-white text-sm font-semibold shadow">
                To Do: <span className="text-[#FEC260] font-bold">{toDoCount}</span>
              </div>
              <div className="bg-[#23234a] rounded-xl px-4 py-2 text-white text-sm font-semibold shadow">
                Done: <span className="text-[#B6E4CF] font-bold">{doneCount}</span>
              </div>
              <div className="bg-[#23234a] rounded-xl px-4 py-2 text-white text-sm font-semibold shadow">
                Scheduled Today: <span className="text-[#6C5DD3] font-bold">{scheduledTodayCount}</span>
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-[#23234a] p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-white">Add Task</span>
                    <button className="text-white text-xl" onClick={() => { setShowModal(false); setFormError(""); }}>&times;</button>
                  </div>
                  {formError && (
                    <div className="bg-red-500/80 text-white text-sm rounded px-3 py-2 mb-2">{formError}</div>
                  )}
                  <label className="block text-white mb-1">Task Name</label>
                  <input
                    className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <label className="block text-white mb-1">Subject</label>
                  <select
                    className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-2"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <label className="block text-white mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-2"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="e.g. 25"
                  />
                  <label className="block text-white mb-1">Importance</label>
                  <select
                    className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-4"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    {priorities.map((p) => (
                      <option key={p.label} value={p.label}>{p.label}</option>
                    ))}
                  </select>
                  <label className="block text-white mb-1">Scheduled Date (optional)</label>
                  <input
                    type="date"
                    className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-4"
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  />
                  <button
                    className="w-full rounded-2xl bg-[#6C5DD3] text-white px-4 py-2 font-semibold shadow hover:bg-[#7A6AD9] transition"
                    onClick={addTask}
                  >
                    Save Task
                  </button>
                </div>
              </div>
            )}

            {/* AI Generate Tasks Modal */}
            {showAIModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-[#23234a] p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-white">AI Generate Tasks</span>
                    <button className="text-white text-xl" onClick={() => setShowAIModal(false)}>&times;</button>
                  </div>
                  <label className="block text-white mb-1">Instructions</label>
                  <textarea
                    className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] mb-4"
                    value={aiInstructions}
                    onChange={e => setAiInstructions(e.target.value)}
                    placeholder="e.g., 'Generate 3 tasks for my upcoming biology test on cell division.'"
                  />
                  <button
                    className="w-full rounded-2xl bg-[#6C5DD3] text-white px-4 py-2 font-semibold shadow hover:bg-[#7A6AD9] transition disabled:opacity-50"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Tasks'}
                  </button>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-4">
              <div className="grid grid-cols-2 w-1/2 mx-auto bg-[#23234a] rounded-xl overflow-hidden">
                <button
                  className={`py-2 font-semibold transition ${tab === "todo" ? "bg-[#6C5DD3] text-white" : "text-white/70"}`}
                  onClick={() => setTab("todo")}
                >
                  To Do
                </button>
                <button
                  className={`py-2 font-semibold transition ${tab === "done" ? "bg-[#6C5DD3] text-white" : "text-white/70"}`}
                  onClick={() => setTab("done")}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Tasks List */}
            {tab === "todo" && (
              <div className="space-y-4">
                {getSortedTasks(tasks.filter((t) => !t.done)).map((task) => (
                  <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl bg-[#23234a] border-l-8 ${priorityColor(task.priority)} transition-transform duration-200 hover:scale-105 ${popTaskId === task.id ? 'animate-pop' : ''}`}>
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg text-white">{task.name}</h2>
                      <p className="text-sm text-gray-400">{task.subject}{task.time ? ` | ${task.time} min` : ""}</p>
                    </div>
                    <div className="flex flex-col items-center mx-4">
                      {task.scheduledDate ? (() => {
                        const status = getScheduleStatus(task.scheduledDate);
                        let color = "bg-[#23234a] text-white/80";
                        if (status === "Overdue") color = "bg-red-600 text-white border border-red-600";
                        else if (status === "Today") color = "bg-orange-500 text-white border border-orange-500";
                        else if (status === "Tomorrow") color = "bg-green-500 text-white border border-green-500";
                        return (
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${color}`}>
                            {status}
                          </span>
                        );
                      })() : (
                        <a href="/schedule" className="inline-block text-xs font-semibold px-2 py-1 rounded bg-[#6C5DD3] text-white hover:bg-[#7A6AD9] transition">Schedule</a>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2 mx-2">
                      <button onClick={() => handleEdit(task)} className="p-1 rounded hover:bg-[#6C5DD3] transition" title="Edit"><Pencil className="w-4 h-4 text-white" /></button>
                      <button onClick={() => handleDelete(task.id)} className="p-1 rounded hover:bg-red-600 transition" title="Delete"><Trash2 className="w-4 h-4 text-white" /></button>
                    </div>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleDone(task.id)}
                      className="w-5 h-5 accent-[#6C5DD3]"
                    />
                  </div>
                ))}
                {tasks.filter((t) => !t.done).length === 0 && (
                  <div className="text-center text-gray-400">No tasks to do!</div>
                )}
              </div>
            )}
            {tab === "done" && (
              <div className="space-y-4">
                {getSortedTasks(tasks.filter((t) => t.done)).map((task) => (
                  <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl bg-[#23234a] border-l-8 ${priorityColor(task.priority)} opacity-60 transition-transform duration-200 hover:scale-105`}>
                    <div className="flex-1">
                      <h2 className="line-through font-medium text-white">{task.name}</h2>
                      <p className="text-sm text-gray-400">{task.subject}{task.time ? ` | ${task.time} min` : ""}</p>
                    </div>
                    <div className="flex flex-col items-center mx-4">
                      {task.scheduledDate ? (() => {
                        const status = getScheduleStatus(task.scheduledDate);
                        let color = "bg-[#23234a] text-white/80";
                        if (status === "Overdue") color = "bg-red-600 text-white border border-red-600";
                        else if (status === "Today") color = "bg-orange-500 text-white border border-orange-500";
                        else if (status === "Tomorrow") color = "bg-green-500 text-white border border-green-500";
                        return (
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${color}`}>
                            {status}
                          </span>
                        );
                      })() : (
                        <a href="/schedule" className="inline-block text-xs font-semibold px-2 py-1 rounded bg-[#6C5DD3] text-white hover:bg-[#7A6AD9] transition">Schedule</a>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2 mx-2">
                      <button onClick={() => handleEdit(task)} className="p-1 rounded hover:bg-[#6C5DD3] transition" title="Edit"><Pencil className="w-4 h-4 text-white" /></button>
                      <button onClick={() => handleDelete(task.id)} className="p-1 rounded hover:bg-red-600 transition" title="Delete"><Trash2 className="w-4 h-4 text-white" /></button>
                    </div>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleDone(task.id)}
                      className="w-5 h-5 accent-[#6C5DD3]"
                    />
                  </div>
                ))}
                {tasks.filter((t) => t.done).length === 0 && (
                  <div className="text-center text-gray-400">No completed tasks yet!</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 