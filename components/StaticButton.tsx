
import React from 'react';

interface StaticButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const StaticButton: React.FC<StaticButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 font-black text-slate-400 bg-slate-900 border-2 border-slate-800 rounded-xl shadow-[0_4px_0_0_#1e293b] hover:bg-slate-800 hover:text-slate-200 focus:outline-none transform active:translate-y-1 active:shadow-none transition-all duration-150"
    >
      {children}
    </button>
  );
};

export default StaticButton;
