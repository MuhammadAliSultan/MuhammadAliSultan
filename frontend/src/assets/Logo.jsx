import React from 'react';
import logo from './logo.png';

const Logo = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom right, #0f172a, #581c87, #1e293b)',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <img 
        src={logo} 
        alt="Dev Chat Logo"
        style={{
          width: '150px',
          height: '150px',
          animation: 'growAndDisappear 2s ease-in-out forwards'
        }}
      />
      <style>{`
        @keyframes growAndDisappear {
          0% {
            transform: translateY(-100vh) scale(0.8);
            opacity: 0;
          }
          10% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          20% {
            transform: translateY(-30px) scale(1.1);
            opacity: 1;
          }
          30% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          40% {
            transform: translateY(-15px) scale(1.05);
            opacity: 1;
          }
          50% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          60% {
            transform: translateY(-8px) scale(1.02);
            opacity: 1;
          }
          70% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateY(-4px) scale(1.01);
            opacity: 1;
          }
          90% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Logo;
