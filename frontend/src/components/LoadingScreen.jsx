import React, { useState, useEffect } from 'react';
import { theme } from '../theme';

const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const t = theme.dark;

  return (
    <div
      className="w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${t.background} 0%, rgba(16, 163, 127, 0.05) 100%)`
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ backgroundColor: t.primary }}
        />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-5 blur-3xl animate-pulse animation-delay-2000"
          style={{ backgroundColor: t.accent }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8">
        {/* Animated Loader */}
        <div className="mb-8">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
              style={{
                borderTopColor: t.primary,
                borderRightColor: t.accent,
                animationDuration: '2s'
              }}
            />
            
            {/* Middle pulsing ring */}
            <div
              className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderBottomColor: t.primary,
                borderLeftColor: t.accent,
                animationDuration: '3s',
                animationDirection: 'reverse'
              }}
            />

            {/* Inner glow */}
            <div
              className="absolute inset-4 rounded-full opacity-40 animate-pulse blur"
              style={{ backgroundColor: t.primary }}
            />

            {/* Center dot */}
            <div
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: t.primary }}
              />
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1
          className="text-2xl sm:text-4xl  mb-3 animate-fade-in"
          style={{ color: t.text }}
        >
          Initializing
          <span className="inline-block w-8 text-left">{dots}</span>
        </h1>

        {/* Subtitle */}
        {/* <p
          className="text-sm sm:text-base font-medium mb-2 animate-fade-in animation-delay-300"
          style={{ color: t.secondary }}
        >
          Backend Server
        </p> */}

        {/* Description */}
        <p
          className="text-xs sm:text-sm mb-8 max-w-md animate-fade-in animation-delay-500"
          style={{ color: `${t.secondary}99` }}
        >
            Server is being prepared. This typically takes a few moments on first load.
        </p>

        {/* Status indicator */}
        {/* <div
          className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-lg backdrop-blur-md border animate-fade-in animation-delay-700"
          style={{
            backgroundColor: `${t.primary}15`,
            borderColor: `${t.primary}40`
          }}
        >
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: t.primary,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
          <span
            className="text-xs sm:text-sm font-medium"
            style={{ color: t.primary }}
          >
            Connecting
          </span>
        </div> */}

        {/* Bottom hint */}
        <p
          className="text-xs mt-8 opacity-60 animate-fade-in animation-delay-1000 underline"
          style={{ color: t.secondary }}
        >
          Please don't refresh the page
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          40% {
            transform: translateY(-10px);
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
