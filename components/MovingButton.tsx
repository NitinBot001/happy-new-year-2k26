
import React, { useState, useRef, useCallback } from 'react';

interface MovingButtonProps {
  children: React.ReactNode;
  isHacked: boolean;
  onClick: () => void;
}

const MovingButton: React.FC<MovingButtonProps> = ({ children, isHacked, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const moveButton = useCallback(() => {
    if (isHacked || !buttonRef.current) return;

    const buttonWidth = buttonRef.current.offsetWidth;
    const buttonHeight = buttonRef.current.offsetHeight;

    const newX = Math.random() * (window.innerWidth - buttonWidth);
    const newY = Math.random() * (window.innerHeight - buttonHeight);

    const clampedX = Math.max(20, Math.min(newX, window.innerWidth - buttonWidth - 20));
    const clampedY = Math.max(20, Math.min(newY, window.innerHeight - buttonHeight - 20));

    setPosition({ top: clampedY, left: clampedX });
  }, [isHacked]);

  const baseClasses = `px-10 py-4 font-black text-slate-950 bg-amber-400 rounded-xl shadow-[0_4px_0_0_#b45309] focus:outline-none transform transition-all duration-300 ease-in-out`;
  const finalClasses = `${baseClasses} ${isHacked 
    ? 'animate-pulse ring-4 ring-amber-500 cursor-pointer hover:bg-amber-300 hover:scale-110' 
    : 'hover:bg-amber-300'}`;

  const eventHandlers = isHacked ? {} : {
    onMouseEnter: moveButton,
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      moveButton();
    },
  };

  if (position && !isHacked) {
    return (
      <button
        ref={buttonRef}
        onClick={onClick}
        {...eventHandlers}
        className={finalClasses}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 50
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      {...eventHandlers}
      className={finalClasses}
    >
      {children}
    </button>
  );
};

export default MovingButton;
