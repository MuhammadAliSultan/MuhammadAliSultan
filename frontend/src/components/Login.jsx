import React, { useState, useEffect } from 'react';
import { userService } from '../api/userService';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentMessage, setCurrentMessage] = useState('Welcome Back');
  const [messageIndex, setMessageIndex] = useState(0);
  const [showFormTitle, setShowFormTitle] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let index = 0;
    const firstTimer = setInterval(() => {
      if (index <= currentMessage.length) {
        setDisplayText(currentMessage.slice(0, index));
        index++;
      } else {
        clearInterval(firstTimer);
        setTimeout(() => {
          setCurrentMessage('Sign In to Continue');
          setMessageIndex(0);
          setShowFormTitle(true);
        }, 1000);
      }
    }, 100);

    return () => clearInterval(firstTimer);
  }, []);

  useEffect(() => {
    if (currentMessage === 'Sign In to Continue' && messageIndex <= currentMessage.length) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email or Username is required';
    } 

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsLoading(true);
  setError('');
  
  try {
    const response = await userService.login(formData.email, formData.password);

  
    
    // ✅ Extract from response.message
    const { accessToken, refreshToken, user } = response.data;


    
    // ✅ Save tokens correctly
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    
    console.log("Tokens saved to localStorage");
    
    // Redirect to home/dashboard
    window.location.href = '/home';
    
  } catch (error) {
    console.error('Login error:', error);
    setError(error.response?.data?.data || 'Invalid email or password');
  } finally {
    setIsLoading(false);
  }
};


  const handleForgotPassword = () => {
    alert('Password reset functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex">
      {/* Left Side - Logo and Animated Text */}
      <div className="w-1/2 flex flex-col justify-between p-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        
        {/* Logo fixed at top */}
        <div className="w-full flex justify-center mb-8">
          <img 
            src={logo} 
            alt="Dev-Chat Logo" 
            className="w-24 h-24 rounded-full shadow-2xl border-4 border-white/20"
          />
        </div>

        {/* Welcome Message centered without scrolling */}
        <div className="flex-1 flex flex-col text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="block mb-2">{displayText}</span>
            <span className="inline-block w-1 h-8 bg-white animate-pulse ml-1"></span>
          </h1>
          <p className="text-purple-200 text-lg mt-2 opacity-80">
            Connect with developers worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md border border-slate-700/50">
          <div className="p-8">
            {showFormTitle && (
              <h2 className="text-3xl font-bold text-center mb-8 text-white">
                Sign In
              </h2>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address or Username
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email or username"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-300">Remember me</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                  isLoading
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200"
                    onClick={() => window.location.href = '/signup'}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-slate-700/50">
              <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} Dev-Chat. All rights reserved. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
