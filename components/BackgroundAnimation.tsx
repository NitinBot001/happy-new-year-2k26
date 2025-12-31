
import React from 'react';

const NUM_PARTICLES = 30;

const BackgroundAnimation: React.FC = () => {
  const particles = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
    const isYear = Math.random() > 0.8;
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}vw`,
      fontSize: isYear ? `${Math.random() * 0.5 + 0.8}rem` : `${Math.random() * 1.5 + 0.5}rem`,
      animationDuration: `${Math.random() * 10 + 5}s`,
      animationDelay: `${Math.random() * 10}s`,
      color: i % 2 === 0 ? '#fbbf24' : '#f8fafc', // Amber or Slate
    };
    
    return (
      <span key={i} className="sparkle font-bold" style={style} aria-hidden="true">
        {isYear ? '2026' : (i % 3 === 0 ? '✦' : '⭐')}
      </span>
    );
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      {particles}
    </div>
  );
};

export default BackgroundAnimation;
