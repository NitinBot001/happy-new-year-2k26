
import React, { useState, useEffect, useRef } from 'react';
import MovingButton from './components/MovingButton';
import StaticButton from './components/StaticButton';
import BackgroundAnimation from './components/BackgroundAnimation';

const jokes = [
  { title: "Congrats! 😜", message: "You're now the CEO of Forever Alone Inc." },
  { title: "Excellent! 🛌", message: "Your bed now has 100% more space for activities." },
  { title: "Success! 😻", message: "You've successfully subscribed to 'Single & Sassy' for another year. Your cat is thrilled!" },
  { title: "Mission Accomplished! 📺", message: "Operation 'Avoid Sharing the Remote' is a go for 2026." },
  { title: "Welcome to the Club! 🍿", message: "We have snacks, and you never have to share them." },
  { title: "Lego Master! 🧱", message: "You can now buy the 7,000 piece Millennium Falcon and build it on the dining table for 3 months." },
  { title: "Blanket Burrito! 💤", message: "Every square inch of the duvet is yours. You are the burrito now." },
  { title: "Pizza Prophet! 🍕", message: "Large pizza for one? It's not a cry for help, it's a high-performance lifestyle choice." },
  { title: "Gamer God! 🎮", message: "Zero interruptions during boss fights. Your K/D ratio is about to skyrocket." },
  { title: "Plant Parent! 🌿", message: "Your plant collection is about to get a lot bigger. They listen better anyway." }
];

const App: React.FC = () => {
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isNoClicked, setIsNoClicked] = useState(false);
  const [isHacked, setIsHacked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedJoke, setSelectedJoke] = useState({ title: '', message: '' });
  
  // Heart hack state
  const [heartClicks, setHeartClicks] = useState(0);
  // Fix: Use ReturnType<typeof setTimeout> to avoid NodeJS namespace error in browser environments
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    setShowContent(true);
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleHeartClick = () => {
    if (isHacked || isYesClicked || isNoClicked) return;

    // Visual feedback
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);

    const nextClicks = heartClicks + 1;
    
    // Start timer on first click
    if (nextClicks === 1) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setHeartClicks(0);
      }, 10000);
    }

    setHeartClicks(nextClicks);

    if (nextClicks >= 5) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsHacked(true);
    }
  };

  const handleYesClick = () => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    setSelectedJoke(jokes[randomIndex]);

    setShowContent(false);
    setTimeout(() => {
      setIsYesClicked(true);
      setShowContent(true);
    }, 500);
  };
  
  const handleNoClick = () => {
    if (!isHacked) return;
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
            We respect the hustle! Your persistence is unmatched.
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
            Good luck out there, you persistent romantic! 😉
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
          <div className="pt-8">
            <button 
              onClick={() => { setShowContent(false); setTimeout(() => { setIsYesClicked(false); setShowContent(true); }, 500); }}
              className="text-gray-400 hover:text-gray-600 underline text-sm"
            >
              Wait, I changed my mind...
            </button>
          </div>
        </div>
      );
    }

    return (
       <div className="space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            Would you like to remain single for 2026?
          </h1>
          
          <div 
            onClick={handleHeartClick}
            className={`text-6xl md:text-8xl cursor-pointer select-none transition-all duration-300 ${isShaking ? 'scale-125 rotate-12' : 'hover:scale-110'} ${isHacked ? 'animate-none' : 'animate-pulse'}`}
          >
            {isHacked ? '❤️' : '❤️‍🩹'}
            {!isHacked && heartClicks > 0 && (
              <div className="text-sm font-bold text-rose-300 mt-2 animate-bounce">
                {5 - heartClicks} more...
              </div>
            )}
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
