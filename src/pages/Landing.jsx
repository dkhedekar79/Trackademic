import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  Smartphone,
  Laptop,
  Tablet
} from "lucide-react";

const Landing = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StudyFlow
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Login</Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <motion.div 
              className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
                variants={itemVariants}
              >
                A home designed to keep your{" "}
                <span className="text-cyan-300">studies organised</span> and you{" "}
                <span className="text-yellow-300">motivated</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl mb-8 text-blue-100"
                variants={itemVariants}
              >
                Transform your learning experience with AI-powered study tools that adapt to your needs.
              </motion.p>
              
              <motion.div variants={itemVariants}>
                <Link 
                  to="/signup"
                  className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get started for free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Device Mockup */}
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center" 
                  alt="StudyFlow Dashboard"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Study session completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">Achievement unlocked!</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature Panels */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Flashcards Panel */}
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 text-white flex items-center justify-between"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">
                  Create flashcards and notes in record time.
                </h3>
                <p className="text-purple-100 text-lg">
                  AI-powered content generation makes studying faster and more effective.
                </p>
              </div>
              <div className="ml-8">
                <div className="w-24 h-32 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Testing Panel */}
            <motion.div 
              className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-3xl p-8 text-white flex items-center justify-between"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="ml-8">
                <div className="w-24 h-32 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-3xl font-bold mb-4">
                  Test your knowledge. Get instant feedback.
                </h3>
                <p className="text-cyan-100 text-lg">
                  Smart quizzes adapt to your learning pace and identify weak areas.
                </p>
              </div>
            </motion.div>

            {/* Statistics Panel */}
            <motion.div 
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6">
                94% of users achieve better grades by using our smart learning platform.
              </h3>
              <Link 
                to="/signup"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Get started for free
              </Link>
            </motion.div>

            {/* AI Learning Panel */}
            <motion.div 
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Learn with the help of AI</h3>
              <a 
                href="#features" 
                className="inline-flex items-center text-white font-semibold hover:text-gray-200 transition-colors"
              >
                Learn more
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Video Panel */}
            <motion.div 
              className="relative bg-gray-900 rounded-3xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                {!isVideoPlaying ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <p className="text-white text-lg font-medium">Watch Demo</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <p className="text-lg">Video playing...</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* App Features */}
            <div className="space-y-8">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 text-white text-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Star className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-2xl font-bold mb-4">
                  Apple loved us so much that they made us App of the day!
                </h4>
              </motion.div>

              <motion.div 
                className="bg-gray-900 rounded-2xl p-6 text-white text-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-2xl font-bold mb-6">
                  Take us anywhere with the free StudyFlow app on iOS and Android.
                </h4>
                <div className="flex justify-center space-x-4">
                  <div className="bg-white/10 px-4 py-2 rounded-lg">
                    <Smartphone className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">iOS</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-lg">
                    <Smartphone className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">Android</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div 
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white flex items-center justify-between"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">
                  Generate explanations on any topic with AI.
                </h3>
                <p className="text-blue-100 text-lg">
                  Get instant, personalized explanations that match your learning style.
                </p>
              </div>
              <div className="ml-8">
                <div className="w-24 h-32 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-3xl p-8 text-white flex items-center justify-between"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="ml-8">
                <div className="w-24 h-32 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-3xl font-bold mb-4">
                  Scientifically-proven learning with Spaced Repetition.
                </h3>
                <p className="text-cyan-100 text-lg">
                  Optimize retention with evidence-based learning techniques.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <motion.div 
          className="max-w-7xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-bold mb-6">
                Learn on your phone, tablet, and laptop.
              </h2>
              <Link 
                to="/signup"
                className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Get started for free
              </Link>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <Tablet className="w-8 h-8" />
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <Laptop className="w-8 h-8" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", role: "Medical Student", text: "StudyFlow helped me organize my MCAT prep and I scored in the 95th percentile!" },
              { name: "James L.", role: "Engineering Student", text: "The AI explanations made complex calculus concepts finally click for me." },
              { name: "Maya P.", role: "High School Student", text: "I went from C's to A's using the spaced repetition system. It actually works!" }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">StudyFlow</span>
            </div>
            <p className="text-gray-400">
              Empowering students worldwide with AI-powered learning tools.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-gray-400">
              <div>Features</div>
              <div>Pricing</div>
              <div>Mobile App</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-gray-400">
              <div>About</div>
              <div>Careers</div>
              <div>Contact</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-gray-400">
              <div>Help Center</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 StudyFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
