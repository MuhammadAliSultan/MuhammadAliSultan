import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentMessage, setCurrentMessage] = useState('Welcome to Dev-Chat');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const firstTimer = setInterval(() => {
      if (index <= currentMessage.length) {
        setDisplayText(currentMessage.slice(0, index));
        index++;
      } else {
        clearInterval(firstTimer);
        setTimeout(() => {
          setCurrentMessage('Connect with developers worldwide');
          setMessageIndex(0);
        }, 1000);
      }
    }, 100);

    return () => clearInterval(firstTimer);
  }, []);

  useEffect(() => {
    if (currentMessage === 'Connect with developers worldwide' && messageIndex <= currentMessage.length) {
      const secondTimer = setInterval(() => {
        if (messageIndex <= currentMessage.length) {
          setDisplayText(currentMessage.slice(0, messageIndex));
          setMessageIndex(prev => prev + 1);
        } else {
          clearInterval(secondTimer);
        }
      }, 100);

      return () => clearInterval(secondTimer);
    }
  }, [currentMessage, messageIndex]);

  // Page load animations
  useEffect(() => {
    // Fade in entire page
    setTimeout(() => setIsVisible(true), 100);
    // Show logo with slide-in
    setTimeout(() => setShowLogo(true), 500);
    // Show text with slide-in
    setTimeout(() => setShowText(true), 800);
  }, []);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Left Side - Logo and Animated Text */}
      <div className={`w-1/2 flex flex-col justify-between p-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm transition-all duration-1000 ${showLogo ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-10 opacity-0'}`}>

        {/* Logo fixed at top */}
        <div className="w-full flex justify-center mb-8">
          <img
            src={logo}
            alt="Dev-Chat Logo"
            className={`w-24 h-24 rounded-full shadow-2xl border-4 border-white/20 transition-all duration-1000 hover:scale-110 hover:rotate-3 ${showLogo ? 'transform scale-100 opacity-100' : 'transform scale-75 opacity-0'}`}
          />
        </div>

        {/* Welcome Message centered without scrolling */}
        <div className={`flex-1 flex flex-col text-center transition-all duration-1000 ${showText ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="block mb-2">{displayText}</span>
            <span className="inline-block w-1 h-8 bg-white animate-pulse ml-1"></span>
          </h1>
          <p className="text-purple-200 text-lg mt-2 opacity-80">
            Connect with developers worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className={`w-1/2 flex items-center justify-center p-8 transition-all duration-1000 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-10 opacity-0'}`}>
        <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Get Started
            </h2>

            <div className="space-y-6">
              <button
                onClick={handleSignIn}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 hover:from-purple-700 hover:to-pink-700"
              >
                Sign In
              </button>

              <button
                onClick={handleSignUp}
                className="w-full py-3 px-4 bg-slate-700/50 text-white font-semibold rounded-lg border border-slate-600 hover:bg-slate-600/50 hover:border-purple-500 transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Sign Up
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Join the conversation and build amazing things together
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Dev-Chat. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
