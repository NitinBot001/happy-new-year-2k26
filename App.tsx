import React, { useState, useEffect } from 'react';
import MovingButton from './components/MovingButton';
import StaticButton from './components/StaticButton';
import BackgroundAnimation from './components/BackgroundAnimation';

const jokes = [
  { title: "Congrats! 😜", message: "You're now the CEO of Forever Alone Inc." },
  { title: "Excellent! 🛌", message: "Your bed now has 100% more space for activities." },
  { title: "Success! 😻", message: "You've successfully subscribed to 'Single & Sassy' for another year. Your cat is thrilled!" },
  { title: "Mission Accomplished! 📺", message: "Operation 'Avoid Sharing the Remote' is a go for 2026." },
  { title: "Welcome to the Club! 🍿", message: "We have snacks, and you never have to share them." }
];

const HACK_CODE = 'love';

const App: React.FC = () => {
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isNoClicked, setIsNoClicked] = useState(false);
  const [isHacked, setIsHacked] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [selectedJoke, setSelectedJoke] = useState({ title: '', message: '' });

  useEffect(() => {
    // Trigger the fade-in animation on mount
    setShowContent(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore if the game is already "won" in either way
        if (isYesClicked || isNoClicked) return;

        const newCode = (secretCode + e.key.toLowerCase()).slice(-HACK_CODE.length);
        setSecretCode(newCode);

        if (newCode === HACK_CODE) {
            setIsHacked(true);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [secretCode, isYesClicked, isNoClicked]);

  const handleYesClick = () => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    setSelectedJoke(jokes[randomIndex]);

    setShowContent(false); // Start fade-out
    setTimeout(() => {
      setIsYesClicked(true);
      setShowContent(true); // Start fade-in for the new content
    }, 500); // Match this duration with the transition duration
  };
  
  const handleNoClick = () => {
    if (!isHacked) return; // Only clickable if hacked
    setShowContent(false);
    setTimeout(() => {
      setIsNoClicked(true);
      setShowContent(true);
    }, 500);
  };

  const contentClasses = `transition-opacity duration-500 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`;

  const renderContent = () => {
    if (isNoClicked) {
      return (
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-500">
            You Cracked the Code! 🥳
          </h1>
          <p className="text-lg md:text-2xl">
            Looks like you're determined to find love in 2026. <br />
            We respect the hustle! Here are some places to start your quest:
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a href="https://tinder.com" target="_blank" rel="noopener noreferrer" className="px-8 py-3 w-48 text-center font-bold text-white bg-rose-500 rounded-lg shadow-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-200">
              Tinder
            </a>
            <a href="https://bumble.com" target="_blank" rel="noopener noreferrer" className="px-8 py-3 w-48 text-center font-bold text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-200">
              Bumble
            </a>
            <a href="https://hinge.co" target="_blank" rel="noopener noreferrer" className="px-8 py-3 w-48 text-center font-bold text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-200">
              Hinge
            </a>
          </div>
          <p className="text-md text-gray-500 pt-4">
            Good luck out there, you coding Casanova! 😉
          </p>
        </div>
      );
    }
    
    if (isYesClicked) {
      return (
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-rose-500">
            {selectedJoke.title}
          </h1>
          <p className="text-lg md:text-2xl">
            {selectedJoke.message}
          </p>
        </div>
      );
    }

    return (
       <div className="space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold">
            Would you like to remain single for 2026?
          </h1>
          <div className="text-6xl md:text-8xl animate-pulse">
            {isHacked ? '❤️' : '❤️‍🩹'}
          </div>
          <div className="flex justify-center items-center gap-4">
            <StaticButton onClick={handleYesClick}>
              YES
            </StaticButton>
            <MovingButton isHacked={isHacked} onClick={handleNoClick}>
              NO
            </MovingButton>
          </div>
        </div>
    );
  }

  return (
    <>
      <BackgroundAnimation />
      <main className="flex items-center justify-center min-h-screen text-gray-800 p-4 overflow-hidden">
        <div className={`text-center ${contentClasses}`}>
          {renderContent()}
        </div>
      </main>
    </>
  );
};

export default App;
