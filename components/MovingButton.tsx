
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

  const baseClasses = `px-10 py-4 font-black text-white bg-sky-500 rounded-2xl shadow-[0_4px_0_0_#0284c7] focus:outline-none transform transition-all duration-300 ease-in-out border border-sky-300/30`;
  const finalClasses = `${baseClasses} ${isHacked 
    ? 'animate-pulse ring-4 ring-cyan-400 cursor-pointer hover:bg-cyan-400 hover:scale-110 shadow-[0_0_20px_rgba(34,211,238,0.6)]' 
    : 'hover:bg-sky-400'}`;

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
