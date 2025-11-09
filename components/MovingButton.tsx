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

    // Clamp values to ensure the button stays within the viewport
    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - buttonWidth));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - buttonHeight));

    setPosition({ top: clampedY, left: clampedX });
  }, [isHacked]);

  const baseClasses = `px-6 py-3 font-bold text-white bg-red-500 rounded-lg shadow-md focus:outline-none transform transition-all duration-300 ease-in-out`;
  const finalClasses = `${baseClasses} ${isHacked 
    ? 'animate-pulse ring-4 ring-green-400 cursor-pointer hover:bg-red-600 hover:scale-105' 
    : 'hover:bg-red-600 hover:scale-105'}`;

  const eventHandlers = isHacked ? {} : {
    onMouseEnter: moveButton,
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      moveButton();
    },
  };

  // If position is set AND the button is not hacked, it becomes absolutely positioned.
  if (position && !isHacked) {
    return (
      <button
        ref={buttonRef}
        onClick={onClick}
        {...eventHandlers}
        className={finalClasses}
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {children}
      </button>
    );
  }

  // Initially, or if hacked, the button is rendered in the normal document flow.
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
