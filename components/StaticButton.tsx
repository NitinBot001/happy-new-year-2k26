
import React from 'react';

interface StaticButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const StaticButton: React.FC<StaticButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 font-black text-sky-700 bg-sky-950/20 border-2 border-sky-900/50 rounded-2xl shadow-[0_4px_0_0_#0c4a6e] hover:bg-sky-900/40 hover:text-sky-400 focus:outline-none transform active:translate-y-1 active:shadow-none transition-all duration-150 backdrop-blur-sm"
    >
      {children}
    </button>
  );
};

export default StaticButton;
