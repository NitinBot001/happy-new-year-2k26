
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface MovingButtonProps {
  children: React.ReactNode;
  isHacked: boolean;
  theme: 'gold' | 'ice';
  onClick: () => void;
  onMove?: () => void;
}

const MovingButton: React.FC<MovingButtonProps> = ({ children, isHacked, theme, onClick, onMove }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // Reset position if window is resized to prevent getting "stuck" outside bounds
  useEffect(() => {
    const handleResize = () => {
      if (position && !isHacked) {
        setPosition(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, isHacked]);

  const moveButton = useCallback(() => {
    if (isHacked || !buttonRef.current) return;
    
    onMove?.();
    const buttonWidth = buttonRef.current.offsetWidth;
    const buttonHeight = buttonRef.current.offsetHeight;
    
    // Calculate boundaries with safe padding (40px)
    const padding = 40;
    const availableWidth = window.innerWidth - buttonWidth - padding * 2;
    const availableHeight = window.innerHeight - buttonHeight - padding * 2;
    
    const newX = padding + Math.random() * availableWidth;
    const newY = padding + Math.random() * availableHeight;
    
    setPosition({ 
      top: newY, 
      left: newX 
    });
  }, [isHacked, onMove]);

  const colorClass = theme === 'gold' ? 'bg-amber-500 shadow-amber-900' : 'bg-cyan-500 shadow-cyan-900';
  const ringClass = theme === 'gold' ? 'ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)]' : 'ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]';

  const baseClasses = `px-8 sm:px-12 py-4 sm:py-5 font-syne font-extrabold text-white rounded-xl sm:rounded-2xl shadow-[0_6px_0_0_var(--tw-shadow-color)] focus:outline-none transform transition-all duration-300 ease-in-out border border-white/20 tracking-[0.1em] sm:tracking-[0.15em] uppercase text-xs sm:text-sm ${colorClass}`;
  const finalClasses = `${baseClasses} ${isHacked ? `animate-pulse ring-4 cursor-pointer hover:scale-110 ${ringClass}` : 'hover:opacity-90'}`;

  const eventHandlers = isHacked ? {} : {
    onMouseEnter: moveButton,
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => { 
        // Prevent default only if we are still in "moving" mode
        if (!isHacked) {
            e.preventDefault(); 
            moveButton(); 
        }
    },
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      {...eventHandlers}
      className={finalClasses}
      style={position && !isHacked ? { 
        position: 'fixed', 
        top: position.top, 
        left: position.left, 
        zIndex: 100,
        margin: 0
      } : {}}
    >
      {children}
    </button>
  );
};

export default MovingButton;
