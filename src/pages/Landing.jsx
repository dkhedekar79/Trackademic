import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useInView from "../hooks/useInView";

const fadeIn = "animate-fade-in";
const slideUp = "animate-slide-up";
const scaleOnHover = "transition-transform duration-300 hover:scale-105";

// Study-related icons (more icons for denser effect)
const floatingIcons = [
  { icon: "📚", label: "books" },
  { icon: "📝", label: "notepad" },
  { icon: "⏰", label: "clock" },
  { icon: "📊", label: "chart" },
  { icon: "🧠", label: "brain" },
  { icon: "🖊️", label: "pen" },
  { icon: "📅", label: "calendar" },
  { icon: "🔬", label: "microscope" },
  { icon: "📓", label: "notebook" },
  { icon: "📖", label: "openbook" },
  { icon: "📚", label: "books2" },
  { icon: "📝", label: "notepad2" },
  { icon: "⏰", label: "clock2" },
  { icon: "📊", label: "chart2" },
  { icon: "🧠", label: "brain2" },
  { icon: "🖊️", label: "pen2" },
  { icon: "📅", label: "calendar2" },
  { icon: "🔬", label: "microscope2" },
  { icon: "📓", label: "notebook2" },
  { icon: "📖", label: "openbook2" },
];

function getRandomPositions(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 90 + 5, // 5% to 95% (vw)
    y: Math.random() * 60 + 10, // 10% to 70% (vh)
  }));
}

const ICON_NUDGE = 8; // px per frame
const FORBIDDEN_MARGIN = 24; // px extra margin around the card

const isInForbiddenZone = (x, y, box) =>
  x > box.left && x < box.right && y > box.top && y < box.bottom;

const FloatingIcons = () => {
  const [positions, setPositions] = useState(getRandomPositions(floatingIcons.length));
  const [dragging, setDragging] = useState(null); // { index, offsetX, offsetY }
  const containerRef = useRef();

  // Get white card bounding box for forbidden zone
  const getWhiteCardBox = () => {
    const el = document.getElementById("main-white-card");
    if (!el || !containerRef.current) return { left: 0, top: 0, right: 0, bottom: 0 };
    const rect = el.getBoundingClientRect();
    const cRect = containerRef.current.getBoundingClientRect();
    return {
      left: rect.left - cRect.left - FORBIDDEN_MARGIN,
      top: rect.top - cRect.top - FORBIDDEN_MARGIN,
      right: rect.right - cRect.left + FORBIDDEN_MARGIN,
      bottom: rect.bottom - cRect.top + FORBIDDEN_MARGIN,
    };
  };

  // Drag handlers
  useEffect(() => {
    if (dragging === null) return;
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = containerRef.current.getBoundingClientRect();
      let x = ((clientX - rect.left - dragging.offsetX) / containerRef.current.offsetWidth) * 100;
      let y = ((clientY - rect.top - dragging.offsetY) / containerRef.current.offsetHeight) * 100;
      // Clamp to container
      x = Math.max(5, Math.min(95, x));
      y = Math.max(10, Math.min(70, y));
      // Prevent dropping in forbidden zone
      const box = getWhiteCardBox();
      const px = (x / 100) * containerRef.current.offsetWidth;
      const py = (y / 100) * containerRef.current.offsetHeight;
      if (isInForbiddenZone(px, py, box)) return;
      setPositions((prev) => prev.map((pos, i) => i === dragging.index ? { x, y } : pos));
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragging]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      {positions.map((pos, i) => (
        <div
          key={i}
          id={`floating-icon-${i}`}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transition: dragging && dragging.index === i ? 'none' : 'left 0.2s, top 0.2s',
            cursor: 'grab',
            pointerEvents: 'auto',
            touchAction: 'none',
          }}
          onMouseDown={e => {
            const iconRect = e.currentTarget.getBoundingClientRect();
            setDragging({
              index: i,
              offsetX: e.clientX - iconRect.left - iconRect.width / 2,
              offsetY: e.clientY - iconRect.top - iconRect.height / 2,
            });
          }}
          onTouchStart={e => {
            const touch = e.touches[0];
            const iconRect = e.currentTarget.getBoundingClientRect();
            setDragging({
              index: i,
              offsetX: touch.clientX - iconRect.left - iconRect.width / 2,
              offsetY: touch.clientY - iconRect.top - iconRect.height / 2,
            });
          }}
        >
          {floatingIcons[i].icon}
        </div>
      ))}
    </div>
  );
};

const AnimatedCard = ({ icon, title, desc, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 ${scaleOnHover} transition-all duration-700 ${
        inView ? "animate-slide-up" : "opacity-0 translate-y-10"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-5xl mb-4">{icon}</span>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-gray-600 text-center text-sm">{desc}</p>
    </div>
  );
};

const AnimatedStep = ({ num, color, title, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 min-w-[260px] ${scaleOnHover} transition-all duration-700 ${
        inView ? "animate-slide-up" : "opacity-0 translate-y-10"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-4 text-3xl font-bold border-2 ${color.bg} ${color.text} ${color.border}`}>
        {num}
      </div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
    </div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 relative overflow-x-hidden">
      {/* Navigation Bar */}
      
      {/* Main Content with Card */}
      <div id="central-content" className="relative flex flex-col items-center justify-start min-h-screen pt-32 pb-10 mt-20">
        {/* Large White Card */}
        <div id="main-white-card" className={`absolute left-1/2 -translate-x-1/2 top-1/2 mt-8 w-full max-w-xl min-h-[40vh] bg-white rounded-3xl shadow-2xl z-0 ${fadeIn}`} style={{ minHeight: '60vh' }}></div>
        {/* Main Text Content */}
        <div className={`relative z-10 flex flex-col items-center w-full max-w-3xl ${slideUp}`} style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl md:text-5xl font-semibold text-center mb-8 leading-tight">
            Track <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600">your</span> progress<br className="hidden md:block" />
            up to <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-500 to-purple-700">3x</span> more efficiently!
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-10 text-center font-medium max-w-2xl">
            Stay organized, motivated, and efficient.<br />Track your revision progress and achieve your academic goals with ease.
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center max-w-md">
            <Link
              to="/login"
              className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition-transform duration-300 hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="w-full md:w-auto px-8 py-3 rounded-lg bg-green-500 text-white font-semibold text-lg shadow hover:bg-green-600 transition-transform duration-300 hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      {/* Switch to plain white background for the rest of the page */}
      <div className="bg-gradient-to-b from-white to-blue-50 w-full">
        {/* Feature Highlights Section */}
        <section className={`w-full flex flex-col items-center justify-center py-16 ${fadeIn}`} style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">Feature Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
            <AnimatedCard icon="⏰" title="Smart Study Timer" desc="Custom timers to boost focus and track study hours effortlessly." delay={0.1} />
            <AnimatedCard icon="📊" title="Insightful Analytics" desc="Understand your productivity and subject strengths at a glance." delay={0.2} />
            <AnimatedCard icon="🗒️" title="Task Planner" desc="Organize exams, homework, and daily goals in one place." delay={0.3} />
          </div>
        </section>
        {/* How It Works Section */}
        <section className={`w-full flex flex-col items-center justify-center py-16 ${fadeIn}`} style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">How It Works</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl w-full px-4 overflow-x-auto pb-24">
            <AnimatedStep num={1} color={{ bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300" }} title="Set your subjects and goals" delay={0.1} />
            <AnimatedStep num={2} color={{ bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-300" }} title="Track your sessions with the smart timer" delay={0.2} />
            <AnimatedStep num={3} color={{ bg: "bg-green-100", text: "text-green-600", border: "border-green-300" }} title="Improve with insights and revision reminders" delay={0.3} />
          </div>
        </section>

        <section id="testimonials" className="py-16 bg-gradient-to-b from-purple-100 to-purple-50 overflow-hidden px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Students Say</h2>
          <div className="whitespace-nowrap overflow-hidden">
            <div className="inline-block animate-carousel" style={{ animation: 'scrollTestimonials 2400s linear infinite' }}>
              {/* Render many sets of testimonials for a truly infinite loop effect */}
              {Array(100).fill(null).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="inline-block w-[680px] bg-white p-5 mr-8 rounded-xl box-border align-top">
                    <p>"I finally stuck to my revision plan thanks to this app. I actually know what to do every day!"</p>
                    <strong>- Maya S., A-Level Biology</strong>
                  </div>
                  <div className="inline-block w-[650px] bg-white p-5 mr-8 rounded-xl box-border align-top">
                    <p>"The analytics showed me my most productive hours—super helpful for exam prep!"</p>
                    <strong>- Daniel K., GCSE Maths</strong>
                  </div>
                  <div className="inline-block w-[470px] bg-white p-5 mr-8 rounded-xl box-border align-top">
                    <p>"Best revision app I've used. Clean, simple, and motivating!"</p>
                    <strong>- Priya M., IB Student</strong>
                  </div>
                  <div className="inline-block w-[600px] bg-white p-5 mr-8 rounded-xl box-border align-top">
                    <p>"It's like having a personal study coach. Keeps me on track and stress-free."</p>
                    <strong>- Omar J., Year 11</strong>
                  </div>
                  <div className="inline-block w-[620px] bg-white p-5 mr-8 rounded-xl box-border align-top">
                    <p>"I love the flashcard system—it's helped me memorize so much more in less time."</p>
                    <strong>- Emily R., A-Level Psychology</strong>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="w-full flex flex-col items-center justify-center py-16 bg-gradient-to-b from-white to-blue-50 px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Trackademic vs Other Apps</h3>
          <div className="w-full max-w-2xl p-0 rounded-2xl shadow-2xl bg-white overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-blue-100 sticky top-0">
                <tr>
                  <th className="py-3 px-6 text-left font-bold text-lg break-words">Feature</th>
                  <th className="py-3 px-6 text-center font-bold text-lg break-words">Trackademic</th>
                  <th className="py-3 px-6 text-center font-bold text-lg break-words">Other Apps</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-4 px-6 font-medium break-words">Unlimited Tracking Capabilities</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold break-words">✅ Yes</td>
                  <td className="py-4 px-6 text-center text-red-500 font-bold break-words">❌ No</td>
                </tr>
                <tr className="border-t">
                  <td className="py-4 px-6 font-medium break-words">Inbuilt revision system</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold break-words">✅ Yes</td>
                  <td className="py-4 px-6 text-center text-yellow-500 font-bold break-words">⚠️ Limited</td>
                </tr>
                <tr className="border-t">
                  <td className="py-4 px-6 font-medium break-words">Analytics Dashboard</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold break-words">✅ Visual</td>
                  <td className="py-4 px-6 text-center text-red-500 font-bold break-words">❌ Basic</td>
                </tr>
                <tr className="border-t">
                  <td className="py-4 px-6 font-medium break-words">All-in-One Planner</td>
                  <td className="py-4 px-6 text-center text-green-600 font-bold break-words">✅ Yes</td>
                  <td className="py-4 px-6 text-center text-red-500 font-bold break-words">❌ No</td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </section>
        <section id="cta" className="py-16 bg-gradient-to-b from-purple-400 via-blue-500 to-blue-300 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Get Started for Free</h2>
            <p className="text-lg md:text-xl mb-10">Free to use. No credit card required. Optional Pro upgrade available.</p>
            <Link to="/dashboard" className="px-8 py-3 rounded-lg bg-white text-white bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-blue-600 font-semibold text-lg shadow hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-blue-700 transition-transform duration-300 hover:scale-105 border border-blue-100 inline-block">
                Let's go!
            </Link>
        </section>

        <section id="footer" className="py-16 bg-white text-black">
            <div className="flex flex-wrap justify-around">
                <div>
                    <h4>Quick Links</h4>
                    <ul className="list-none p-0">
                        <li><a href="#" className="text-black no-underline">About</a></li>
                        <li><a href="#" className="text-black no-underline">FAQ</a></li>
                        <li><a href="#" className="text-black no-underline">Privacy</a></li>
                        <li><a href="#" className="text-black no-underline">Terms</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Follow Us</h4>
                    <p>
                        <a href="#" className="text-black mr-4">Twitter</a>
                        <a href="#" className="text-black mr-4">Instagram</a>
                        <a href="#" className="text-black">TikTok</a>
                    </p>
            </div>
                <div>
                    <h4>Newsletter</h4>
                    <input type="email" placeholder="Your email" className="p-2 rounded-md border-none mt-2" />
                    <button className="p-2 ml-2 rounded-md bg-blue-500 text-white">Subscribe</button>
                </div>
            </div>
            <p className="text-center mt-8 text-sm">© 2025 Trackademic. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
};

export default Landing; 
