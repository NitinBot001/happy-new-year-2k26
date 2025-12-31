
import React from 'react';

interface Props {
  theme: 'gold' | 'ice' | 'none';
}

const BackgroundAnimation: React.FC<Props> = ({ theme }) => {
  const numParticles = 40;
  const particles = Array.from({ length: numParticles }).map((_, i) => {
    const isYear = Math.random() > 0.9;
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}vw`,
      fontSize: isYear ? '0.8rem' : `${Math.random() * 1.5 + 0.5}rem`,
      animationDuration: `${Math.random() * 15 + 10}s`,
      animationDelay: `${Math.random() * -20}s`,
      color: theme === 'gold' ? (i % 2 === 0 ? '#fbbf24' : '#ffffff') : (i % 2 === 0 ? '#7dd3fc' : '#ffffff'),
      filter: 'blur(0.5px)',
    };
    
    const icons = theme === 'gold' ? ['✨', '•', '✧', '★'] : ['❄', '❅', '❆', '•'];
    const icon = icons[i % icons.length];

    return (
      <span key={i} className="sparkle font-black select-none opacity-30" style={style} aria-hidden="true">
        {isYear ? '2026' : icon}
      </span>
    );
  });

  return (
    <div className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden transition-colors duration-1000 ${theme === 'gold' ? 'bg-[#020617]' : 'bg-[#082f49]'}`}>
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40"></div>
      {particles}
    </div>
  );
};

export default BackgroundAnimation;
