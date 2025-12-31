
import React, { useState, useEffect, useRef } from 'react';
import MovingButton from './components/MovingButton';
import StaticButton from './components/StaticButton';
import BackgroundAnimation from './components/BackgroundAnimation';

const failJokes = [
  { title: "Honesty is Key! 😴", message: "Fair enough. 2025 was a lot. We'll just nap until 2027." },
  { title: "Understood! 📉", message: "Lowering expectations to 'Just Survived' mode. Coffee is on the left." },
  { title: "Safe Choice! 🛋️", message: "A 'Mediocre but Comfy' 2026 it is. More time for Netflix!" },
  { title: "Realist Alert! 🍕", message: "Who needs legendary when you have leftover pizza and a stable internet connection?" },
  { title: "Zen Master! 🧘", message: "You've reached the level of 'Not Giving a Hoot'. 2026 is shaking in its boots." }
];

const App: React.FC = () => {
  const [isNoClicked, setIsNoClicked] = useState(false);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isHacked, setIsHacked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedJoke, setSelectedJoke] = useState({ title: '', message: '' });
  
  const [starClicks, setStarClicks] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    setShowContent(true);
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStarClick = () => {
    if (isHacked || isNoClicked || isYesClicked) return;

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);

    const nextClicks = starClicks + 1;
    
    if (nextClicks === 1) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStarClicks(0);
      }, 10000);
    }

    setStarClicks(nextClicks);

    if (nextClicks >= 5) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsHacked(true);
    }
  };

  const handleNoClick = () => {
    const randomIndex = Math.floor(Math.random() * failJokes.length);
    setSelectedJoke(failJokes[randomIndex]);

    setShowContent(false);
    setTimeout(() => {
      setIsNoClicked(true);
      setShowContent(true);
    }, 500);
  };
  
  const handleYesClick = () => {
    setShowContent(false);
    setTimeout(() => {
      setIsYesClicked(true);
      setShowContent(true);
    }, 500);
  };

  const contentClasses = `transition-opacity duration-700 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`;

  const renderContent = () => {
    if (isYesClicked) {
      return (
        <div className="space-y-6 max-w-2xl mx-auto px-4">
          <h1 className="text-5xl md:text-8xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce">
            HAPPY 2026! 🎇
          </h1>
          <div className="text-3xl md:text-4xl text-white font-bold tracking-widest uppercase">
            Legendary Status: UNLOCKED
          </div>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
            The stars have aligned! This is officially going to be your year. 
            May your 2026 be filled with unexpected joy, massive wins, 
            and zero forgotten resolutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
            <div className="p-4 bg-slate-900/50 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
              <span className="block text-amber-400 text-3xl font-bold">365</span>
              <span className="text-xs text-slate-400 uppercase tracking-tighter">New Chances</span>
            </div>
            <div className="p-4 bg-slate-900/50 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
              <span className="block text-amber-400 text-3xl font-bold">12</span>
              <span className="text-xs text-slate-400 uppercase tracking-tighter">New Chapters</span>
            </div>
            <div className="p-4 bg-slate-900/50 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
              <span className="block text-amber-400 text-3xl font-bold">∞</span>
              <span className="text-xs text-slate-400 uppercase tracking-tighter">Possibilities</span>
            </div>
          </div>
          <p className="text-slate-500 italic pt-8">
            Go out there and shine! ✨
          </p>
        </div>
      );
    }
    
    if (isNoClicked) {
      return (
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-400">
            {selectedJoke.title}
          </h1>
          <p className="text-lg md:text-2xl text-slate-300">
            {selectedJoke.message}
          </p>
          <div className="pt-8">
            <button 
              onClick={() => { setShowContent(false); setTimeout(() => { setIsNoClicked(false); setShowContent(true); }, 500); }}
              className="text-amber-500/50 hover:text-amber-500 underline text-sm transition-colors"
            >
              Wait, I'm ready for greatness now...
            </button>
          </div>
        </div>
      );
    }

    return (
       <div className="space-y-12">
          <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight">
            Are you ready to make <span className="text-amber-400">2026</span> <br/>
            your most <span className="italic underline decoration-amber-500">legendary</span> year?
          </h1>
          
          <div 
            onClick={handleStarClick}
            className={`relative inline-block text-7xl md:text-9xl cursor-pointer select-none transition-all duration-300 ${isShaking ? 'scale-125 rotate-45' : 'hover:scale-110'} ${isHacked ? 'animate-none' : 'animate-pulse'}`}
          >
            <span className="drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                {isHacked ? '✨' : '⭐'}
            </span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-slate-950 pointer-events-none">
                26
            </div>
            {!isHacked && starClicks > 0 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-amber-500 whitespace-nowrap animate-bounce">
                Click {5 - starClicks}x to ignite
              </div>
            )}
          </div>

          <div className="flex justify-center items-center gap-6">
            <MovingButton isHacked={isHacked} onClick={handleYesClick}>
              YES!
            </MovingButton>
            <StaticButton onClick={handleNoClick}>
              NOT REALLY
            </StaticButton>
          </div>
          
          <p className="text-slate-500 text-sm">
            {isHacked ? "The path to 2026 is now open." : "Legendary status requires catching the ambition."}
          </p>
        </div>
    );
  }

  return (
    <>
      <BackgroundAnimation />
      <main className="flex items-center justify-center min-h-screen text-slate-100 p-4 overflow-hidden">
        <div className={`text-center ${contentClasses}`}>
          {renderContent()}
        </div>
      </main>
    </>
  );
};

export default App;
