
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import MovingButton from './components/MovingButton';
import StaticButton from './components/StaticButton';
import BackgroundAnimation from './components/BackgroundAnimation';

const failJokes = [
  { title: "Frozen Heart? 🧊", message: "Looks like you're still in hibernation mode. 2025 was a long winter, huh?" },
  { title: "Ice Cold! 🥶", message: "Expectations set to 'Absolute Zero'. We'll just stay inside and drink hot cocoa." },
  { title: "Still Thawing... 🕯️", message: "A 'Chilly but Cozy' 2026 it is. More time for fuzzy socks and gaming." },
  { title: "Snow Joke! ⛄", message: "Who needs legendary when you have a warm blanket and zero responsibilities?" },
  { title: "Glacier Speed! 🏔️", message: "You've reached peak chill. 2026 is waiting for you to melt the ice." }
];

const celebrationSets = [
  {
    top: "The ice breaks — and so can your limits. Here’s to crisp courage, frosty mornings, and dreams that crystallize into reality.",
    boxes: [
      { value: "365", label: "NEW OPPORTUNITIES" },
      { value: "52", label: "WEEKS OF GROWTH" },
      { value: "1", label: "BRAND-NEW YOU" }
    ],
    bottom: "Keep sliding — the magic is in the journey ❄️"
  },
  {
    top: "May the year ahead bring quiet peace like a fresh snowfall and moments that sparkle like ice.",
    boxes: [
      { value: "12", label: "NEW BEGINNINGS" },
      { value: "1000+", label: "CHILL MOMENTS" },
      { value: "∞", label: "POSSIBILITIES" }
    ],
    bottom: "Stay cool — you're making history 🌙"
  },
  {
    top: "This year belongs to cold focus, sharp ideas, and an unstoppable winter spirit.",
    boxes: [
      { value: "1%", label: "SHARPER EVERY DAY" },
      { value: "24/7", label: "ICE-COLD DRIVE" },
      { value: "0", label: "MELTDOWNS" }
    ],
    bottom: "Build your empire on solid ground. 🧊"
  },
  {
    top: "Cheers to new arctic adventures and the people who make the cold feel warm.",
    boxes: [
      { value: "365", label: "DAYS TO SHINE" },
      { value: "12", label: "MONTHS OF JOY" },
      { value: "4", label: "SEASONS OF MAGIC" }
    ],
    bottom: "Let’s make this legendary ❆"
  },
  {
    top: "Wishing you days filled with clarity, the strength of a blizzard, and reasons to glow.",
    boxes: [
      { value: "3", label: "STRENGTH, CLARITY, PEACE" },
      { value: "0", label: "SHIVERS" },
      { value: "100%", label: "COOL" }
    ],
    bottom: "You’ve got the power 🌟"
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
      colors: ['#7dd3fc', '#e0f2fe', '#ffffff'],
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
      confetti({ ...defaults, particleCount, colors: ['#bae6fd', '#f0f9ff', '#ffffff'], origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, colors: ['#7dd3fc', '#ffffff'], origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
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
          <h1 className="text-5xl md:text-8xl font-black text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.8)] animate-bounce mb-8 uppercase tracking-tighter">
            COOL 2026! ❄️
          </h1>
          
          <p className="text-xl md:text-2xl text-sky-100 font-light leading-relaxed max-w-2xl mx-auto italic">
            "{selectedCelebration.top}"
          </p>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 py-8">
            {selectedCelebration.boxes.map((box, idx) => (
              <div 
                key={idx} 
                className="flex-1 p-6 bg-sky-950/40 border border-sky-400/40 rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:border-sky-300 transition-all duration-500 group flex flex-col justify-center"
              >
                <span className="block text-white text-4xl md:text-5xl font-black mb-2 tracking-tighter group-hover:scale-110 transition-transform">
                  {box.value}
                </span>
                <span className="text-xs md:text-sm text-sky-300 font-bold uppercase tracking-widest leading-tight">
                  {box.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-lg md:text-xl text-sky-300 font-semibold tracking-wide">
              {selectedCelebration.bottom}
            </p>
            <div className="text-sky-700 text-sm mt-8 font-bold">
              Arctic Legend: <span className="text-sky-300 underline decoration-sky-300/50">ACTIVE</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (isNoClicked) {
      return (
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-sky-800">
            {selectedJoke.title}
          </h1>
          <p className="text-lg md:text-2xl text-sky-200 font-light">
            {selectedJoke.message}
          </p>
          <div className="pt-8">
            <button 
              onClick={() => { setShowContent(false); setTimeout(() => { setIsNoClicked(false); setShowContent(true); }, 500); }}
              className="text-sky-500 hover:text-sky-300 underline text-sm transition-colors font-medium"
            >
              Wait, the ice is melting... I'm ready!
            </button>
          </div>
        </div>
      );
    }

    return (
       <div className="space-y-12">
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight">
            Ready to <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">CHILL</span> in 2026? <br/>
            Make it your <span className="italic underline decoration-cyan-500">coolest</span> year yet.
          </h1>
          
          <div 
            onClick={handleStarClick}
            className={`relative inline-block text-7xl md:text-9xl cursor-pointer select-none transition-all duration-300 ${isShaking ? 'scale-125 rotate-12' : 'hover:scale-110'} ${isHacked ? 'animate-none' : 'animate-pulse'}`}
          >
            <span className="drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] filter brightness-125">
                {isHacked ? '❆' : '❄'}
            </span>
            {!isHacked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-sky-950 pointer-events-none">
                26
              </div>
            )}
            {!isHacked && starClicks > 0 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-sky-400 whitespace-nowrap animate-bounce">
                Tap {5 - starClicks}x to freeze the flow
              </div>
            )}
          </div>

          <div className="flex justify-center items-center gap-6">
            <MovingButton isHacked={isHacked} onClick={handleYesClick}>
              ABSOLUTELY!
            </MovingButton>
            <StaticButton onClick={handleNoClick}>
              STAY FROZEN
            </StaticButton>
          </div>
          
          <p className="text-sky-800 font-bold text-sm tracking-widest uppercase">
            {isHacked ? "The arctic gate is open." : "Catch the breeze of ambition."}
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
              className="w-10 h-10 rounded-full bg-sky-950/80 border border-sky-400/30 flex items-center justify-center text-sky-300 hover:bg-sky-900 hover:border-sky-300 transition-all duration-300 shadow-xl shadow-cyan-500/10 backdrop-blur-sm"
              aria-label="Hint"
            >
              <span className="font-serif italic font-bold text-lg">i</span>
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${showHint ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'} whitespace-nowrap`}>
              <div className="bg-sky-950/90 border border-sky-400/20 px-4 py-2 rounded-xl text-xs text-sky-200 backdrop-blur-md shadow-2xl">
                Psst... Tap the <span className="text-sky-300 font-bold underline">Ice Snowflake</span> 5 times to thaw the luck!
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default App;
