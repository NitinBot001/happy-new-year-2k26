
import React, { useState, useRef, useCallback } from 'react';

const MovingButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const moveButton = useCallback(() => {
    if (!buttonRef.current) return;

    const buttonWidth = buttonRef.current.offsetWidth;
    const buttonHeight = buttonRef.current.offsetHeight;

    const newX = Math.random() * (window.innerWidth - buttonWidth);
    const newY = Math.random() * (window.innerHeight - buttonHeight);

    // Clamp values to ensure the button stays within the viewport
    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - buttonWidth));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - buttonHeight));

    setPosition({ top: clampedY, left: clampedX });
  }, []);

  const baseClasses = `px-6 py-3 font-bold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transform hover:scale-105 transition-all duration-300 ease-in-out`;

  // If position is set, the button becomes absolutely positioned and "flees".
  if (position) {
    return (
      <button
        ref={buttonRef}
        onMouseEnter={moveButton}
        onTouchStart={(e) => {
          e.preventDefault(); // Prevent click and other touch behaviors
          moveButton();
        }}
        className={baseClasses}
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

  // Initially, the button is rendered in the normal document flow.
  return (
    <button
      ref={buttonRef}
      onMouseEnter={moveButton}
      onTouchStart={(e) => {
        e.preventDefault();
        moveButton();
      }}
      className={baseClasses}
    >
      {children}
    </button>
  );
};

export default MovingButton;
