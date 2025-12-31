
import React, { useState, useRef, useCallback } from 'react';

interface MovingButtonProps {
  children: React.ReactNode;
  isHacked: boolean;
  theme: 'gold' | 'ice';
  onClick: () => void;
}

const MovingButton: React.FC<MovingButtonProps> = ({ children, isHacked, theme, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const moveButton = useCallback(() => {
    if (isHacked || !buttonRef.current) return;
    const buttonWidth = buttonRef.current.offsetWidth;
    const buttonHeight = buttonRef.current.offsetHeight;
    const newX = Math.random() * (window.innerWidth - buttonWidth);
    const newY = Math.random() * (window.innerHeight - buttonHeight);
    setPosition({ 
      top: Math.max(20, Math.min(newY, window.innerHeight - buttonHeight - 20)), 
      left: Math.max(20, Math.min(newX, window.innerWidth - buttonWidth - 20)) 
    });
  }, [isHacked]);

  const colorClass = theme === 'gold' ? 'bg-amber-500 shadow-amber-900' : 'bg-cyan-500 shadow-cyan-900';
  const ringClass = theme === 'gold' ? 'ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)]' : 'ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]';

  const baseClasses = `px-12 py-5 font-syne font-extrabold text-white rounded-2xl shadow-[0_6px_0_0_var(--tw-shadow-color)] focus:outline-none transform transition-all duration-300 ease-in-out border border-white/20 tracking-[0.15em] uppercase text-sm ${colorClass}`;
  const finalClasses = `${baseClasses} ${isHacked ? `animate-pulse ring-4 cursor-pointer hover:scale-110 ${ringClass}` : 'hover:opacity-90'}`;

  const eventHandlers = isHacked ? {} : {
    onMouseEnter: moveButton,
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => { e.preventDefault(); moveButton(); },
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      {...eventHandlers}
      className={finalClasses}
      style={position && !isHacked ? { position: 'fixed', top: position.top, left: position.left, zIndex: 50 } : undefined}
    >
      {children}
    </button>
  );
};

export default MovingButton;
