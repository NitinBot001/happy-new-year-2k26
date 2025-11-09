
import React from 'react';

interface StaticButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const StaticButton: React.FC<StaticButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 font-bold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-200"
    >
      {children}
    </button>
  );
};

export default StaticButton;
