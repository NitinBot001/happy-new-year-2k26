
import React from 'react';

const NUM_PARTICLES = 40;

const BackgroundAnimation: React.FC = () => {
  const particles = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
    const isYear = Math.random() > 0.85;
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}vw`,
      fontSize: isYear ? `${Math.random() * 0.4 + 0.6}rem` : `${Math.random() * 1.8 + 0.6}rem`,
      animationDuration: `${Math.random() * 12 + 8}s`,
      animationDelay: `${Math.random() * -15}s`,
      color: i % 2 === 0 ? '#bae6fd' : '#ffffff', // Sky 200 or White
      filter: 'blur(0.5px)',
    };
    
    // Snowflake variants
    const snowflake = ['❄', '❅', '❆', '•'][i % 4];

    return (
      <span key={i} className="sparkle font-black select-none opacity-40" style={style} aria-hidden="true">
        {isYear ? '2026' : snowflake}
      </span>
    );
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      {particles}
    </div>
  );
};

export default BackgroundAnimation;
