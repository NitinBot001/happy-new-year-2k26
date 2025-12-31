
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
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

const celebrationSets = [
  {
    top: "The calendar resets — and so can you. Here’s to fresh courage, kinder days, and dreams that finally take shape.",
    boxes: [
      { value: "365", label: "NEW OPPORTUNITIES" },
      { value: "52", label: "WEEKS OF GROWTH" },
      { value: "1", label: "BRAND-NEW YOU" }
    ],
    bottom: "Keep moving — the magic is in the effort ✨"
  },
  {
    top: "May the year ahead bring quiet peace, loud laughter, and moments you’ll always remember.",
    boxes: [
      { value: "12", label: "NEW BEGINNINGS" },
      { value: "1000+", label: "SMILES TO SHARE" },
      { value: "∞", label: "POSSIBILITIES TO EXPLORE" }
    ],
    bottom: "Be gentle with yourself — you’re still becoming 🌙"
  },
  {
    top: "This year belongs to bold ideas, brave actions, and unstoppable discipline.",
    boxes: [
      { value: "1%", label: "BETTER EVERY DAY" },
      { value: "24/7", label: "COMMITMENT" },
      { value: "0", label: "EXCUSES" }
    ],
    bottom: "Show up. Build. Repeat. 💪"
  },
  {
    top: "Cheers to new memories, new adventures, and the people who make them special.",
    boxes: [
      { value: "365", label: "DAYS TO CELEBRATE" },
      { value: "12", label: "MONTHS OF JOY" },
      { value: "4", label: "SEASONS OF HAPPINESS" }
    ],
    bottom: "Let’s make this unforgettable 🎇"
  },
  {
    top: "Wishing you days filled with kindness, chances to grow, and reasons to smile.",
    boxes: [
      { value: "3", label: "HOPE, COURAGE, GRATITUDE" },
      { value: "0", label: "REGRETS" },
      { value: "100%", label: "HEART" }
    ],
    bottom: "You’ve got this 🌟"
  }
];

const App: React.FC = () => {
  const [isNoClicked, setIsNoClicked] = useState(false);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isHacked, setIsHacked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedJoke, setSelectedJoke] = useState({ title: '', message: '' });
  const [selectedCelebration, setSelectedCelebration] = useState(celebrationSets[0]);
  const [showHint, setShowHint] = useState(false);
  
  const [starClicks, setStarClicks] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    setShowContent(true);
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerSmallConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f8fafc', '#ffffff'],
      scale: 0.8
    });
  };

  const triggerBigConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

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
      setShowHint(false);
      triggerSmallConfetti();
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
    const randomSet = celebrationSets[Math.floor(Math.random() * celebrationSets.length)];
    setSelectedCelebration(randomSet);
    
    setShowContent(false);
    setTimeout(() => {
      setIsYesClicked(true);
      setShowContent(true);
      triggerBigConfetti();
    }, 500);
  };

  const contentClasses = `transition-opacity duration-700 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`;

  const renderContent = () => {
    if (isYesClicked) {
      return (
        <div className="space-y-8 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-8xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce mb-8">
            HAPPY 2026! 🎇
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto italic">
            "{selectedCelebration.top}"
          </p>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 py-8">
            {selectedCelebration.boxes.map((box, idx) => (
              <div 
                key={idx} 
                className="flex-1 p-6 bg-slate-900/60 border border-amber-500/30 rounded-2xl backdrop-blur-md shadow-xl hover:border-amber-400 transition-colors flex flex-col justify-center"
              >
                <span className="block text-amber-400 text-4xl md:text-5xl font-black mb-2 tracking-tighter">
                  {box.value}
                </span>
                <span className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest leading-tight">
                  {box.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-lg md:text-xl text-amber-500/80 font-semibold tracking-wide">
              {selectedCelebration.bottom}
            </p>
            <div className="text-slate-500 text-sm mt-8">
              Legendary Status: <span className="text-amber-400 underline decoration-amber-500/50">UNLOCKED</span>
            </div>
          </div>
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
            {!isHacked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-slate-950 pointer-events-none">
                26
              </div>
            )}
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
      <main className="flex items-center justify-center min-h-screen text-slate-100 p-4 overflow-hidden relative">
        <div className={`text-center ${contentClasses}`}>
          {renderContent()}
        </div>

        {/* Hint Button */}
        {!isHacked && !isYesClicked && !isNoClicked && (
          <div className="fixed bottom-6 left-6 flex items-center gap-3 group z-20">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-10 h-10 rounded-full bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-500 hover:bg-slate-800 hover:border-amber-400 transition-all duration-300 shadow-lg shadow-black/50"
              aria-label="Hint"
            >
              <span className="font-serif italic font-bold text-lg">i</span>
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${showHint ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'} whitespace-nowrap`}>
              <div className="bg-slate-900/90 border border-amber-500/20 px-4 py-2 rounded-lg text-xs text-amber-200 backdrop-blur-sm">
                Psst... Poke the <span className="text-amber-400 font-bold underline">2026 Star</span> 5 times to catch the vibe!
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default App;
