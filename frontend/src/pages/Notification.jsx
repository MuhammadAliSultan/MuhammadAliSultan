import React, { useState, useEffect } from 'react';

const Notification = ({ message, duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300); // Wait for fade-out animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`
      fixed bottom-4 left-1/2 transform -translate-x-1/2
      bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-lg
      shadow-lg z-50 transition-all duration-300
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
    `}>
      <div className="flex items-center justify-center">
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
