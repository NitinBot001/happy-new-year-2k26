
import React, { useState, useEffect } from 'react';
import MovingButton from './components/MovingButton';
import StaticButton from './components/StaticButton';

const App: React.FC = () => {
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger the fade-in animation on mount
    setShowContent(true);
  }, []);

  const handleYesClick = () => {
    setShowContent(false); // Start fade-out
    setTimeout(() => {
      setIsYesClicked(true);
      setShowContent(true); // Start fade-in for the new content
    }, 500); // Match this duration with the transition duration
  };

  const contentClasses = `transition-opacity duration-500 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`;

  return (
    <main className="flex items-center justify-center min-h-screen bg-rose-50 text-gray-800 p-4 overflow-hidden">
      <div className={`text-center ${contentClasses}`}>
        {isYesClicked ? (
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-rose-500">
              Congrats! 😜
            </h1>
            <p className="text-lg md:text-2xl">
              You're now the CEO of Forever Alone Inc.
            </p>
            <p className="text-md md:text-xl">
              Your cat is very happy to hear this news! 😻
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-3xl md:text-5xl font-bold">
              Would you like to remain single for 2026?
            </h1>
            <div className="text-6xl md:text-8xl animate-pulse">❤️‍🩹</div>
            <div className="flex justify-center items-center gap-4">
              <StaticButton onClick={handleYesClick}>
                YES
              </StaticButton>
              <MovingButton>
                NO
              </MovingButton>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
