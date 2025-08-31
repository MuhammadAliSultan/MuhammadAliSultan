import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Interface = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "Welcome to the future of developer communication";

  useEffect(() => {
    // Fade in animation on load
    setIsVisible(true);
    
    // Typewriter effect for the subtitle
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/welcome');
  };

  const features = [
    { icon: "💬", title: "Real-time Chat", desc: "Instant messaging with developers worldwide" },
    { icon: "👥", title: "Group Collaboration", desc: "Create and manage development teams effortlessly" },
    { icon: "🚀", title: "Code Sharing", desc: "Share code snippets and technical discussions" },
    { icon: "🔒", title: "Secure Platform", desc: "End-to-end encrypted conversations" },
    { icon: "⚡", title: "Lightning Fast", desc: "Real-time synchronization across all devices" },
    { icon: "🎨", title: "Modern Design", desc: "Beautiful and intuitive user interface" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content with animations */}
      <div className={`relative z-10 max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="Dev-Chat Logo" 
            className="w-32 h-32 rounded-full shadow-2xl border-4 border-white/20 mx-auto transform hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Platform Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-4 animate-pulse">
          Dev-Chat Platform
        </h1>

        {/* Animated subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-8 h-8">
          {typedText}
          <span className="inline-block w-1 h-8 bg-purple-400 animate-pulse ml-1"></span>
        </p>

        {/* Button */}
        <button
          onClick={handleGetStarted}
          className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
        >
          Let's Get Started →
        </button>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 transform hover:scale-105 transition-all duration-300 hover:bg-slate-800/60 hover:border-purple-500/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 mb-24 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">10K+</div>
            <div className="text-sm text-slate-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">50K+</div>
            <div className="text-sm text-slate-400">Messages Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">100+</div>
            <div className="text-sm text-slate-400">Countries</div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-4 w-full text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Dev-Chat. All rights reserved. 
        </p>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Interface;
