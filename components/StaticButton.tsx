
import React from 'react';

interface StaticButtonProps {
  onClick: () => void;
  theme: 'gold' | 'ice';
  children: React.ReactNode;
}

const StaticButton: React.FC<StaticButtonProps> = ({ onClick, theme, children }) => {
  const colorClasses = theme === 'gold' 
    ? 'text-amber-500 bg-amber-950/20 border-amber-900/50 shadow-amber-950 hover:text-amber-400' 
    : 'text-cyan-500 bg-sky-950/20 border-sky-900/50 shadow-sky-950 hover:text-cyan-400';

  return (
    <button
      onClick={onClick}
      className={`px-8 sm:px-10 py-4 sm:py-5 font-jakarta font-bold border-2 rounded-xl sm:rounded-2xl shadow-[0_6px_0_0_var(--tw-shadow-color)] focus:outline-none transform active:translate-y-1 active:shadow-none transition-all duration-150 backdrop-blur-sm tracking-widest uppercase text-[10px] sm:text-xs md:text-sm ${colorClasses}`}
    >
      {children}
    </button>
  );
};

export default StaticButton;
