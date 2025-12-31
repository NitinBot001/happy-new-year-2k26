
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
    bottom: "Let’s make this unforgettable ❆"
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
        <div className="space-y-12 max-w-5xl mx-auto px-4">
          <h1 className="text-6xl md:text-9xl font-syne font-black text-cyan-300 drop-shadow-[0_0_20px_rgba(103,232,249,0.9)] animate-bounce mb-8 uppercase tracking-tighter">
            COOL 2026! ❄️
          </h1>
          
          <p className="text-xl md:text-3xl text-sky-100 font-outfit font-light leading-relaxed max-w-3xl mx-auto italic">
            "{selectedCelebration.top}"
          </p>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 py-8">
            {selectedCelebration.boxes.map((box, idx) => (
              <div 
                key={idx} 
                className="flex-1 p-8 bg-sky-950/40 border border-sky-400/30 rounded-[2rem] backdrop-blur-2xl shadow-[0_0_40px_rgba(56,189,248,0.15)] hover:border-sky-300 hover:shadow-[0_0_50px_rgba(56,189,248,0.3)] transition-all duration-500 group flex flex-col justify-center items-center text-center"
              >
                <span className="block text-white text-5xl md:text-6xl font-unbounded font-black mb-4 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                  {box.value}
                </span>
                <span className="text-xs md:text-sm text-sky-300 font-jakarta font-bold uppercase tracking-[0.2em] leading-tight">
                  {box.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-sky-300 font-outfit font-semibold tracking-wide">
              {selectedCelebration.bottom}
            </p>
            <div className="text-sky-800 font-jakarta font-bold text-sm mt-8 tracking-widest uppercase flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
              Arctic Legend: <span className="text-sky-300 underline decoration-sky-300/50">ACTIVE</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (isNoClicked) {
      return (
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-syne font-bold text-sky-800 tracking-tight">
            {selectedJoke.title}
          </h1>
          <p className="text-xl md:text-3xl text-sky-200 font-outfit font-light max-w-2xl mx-auto">
            {selectedJoke.message}
          </p>
          <div className="pt-12">
            <button 
              onClick={() => { setShowContent(false); setTimeout(() => { setIsNoClicked(false); setShowContent(true); }, 500); }}
              className="font-jakarta text-sky-500 hover:text-sky-300 underline text-lg transition-colors font-medium decoration-sky-500/30 underline-offset-8"
            >
              Wait, the ice is melting... I'm ready!
            </button>
          </div>
        </div>
      );
    }

    return (
       <div className="space-y-16">
          <h1 className="text-5xl md:text-8xl font-syne font-black text-white tracking-tight leading-[1.1]">
            Ready to <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">CHILL</span> in 2026? <br/>
            Make it your <span className="italic underline decoration-cyan-500/50 decoration-4 underline-offset-8">coolest</span> year yet.
          </h1>
          
          <div 
            onClick={handleStarClick}
            className={`relative inline-block text-8xl md:text-[12rem] cursor-pointer select-none transition-all duration-500 ${isShaking ? 'scale-125 rotate-12' : 'hover:scale-105'} ${isHacked ? 'animate-none' : 'animate-pulse'}`}
          >
            <span className="drop-shadow-[0_0_30px_rgba(34,211,238,0.9)] filter brightness-125">
                {isHacked ? '❆' : '❄'}
            </span>
            {!isHacked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-unbounded font-black text-sky-950 pointer-events-none opacity-80">
                26
              </div>
            )}
            {!isHacked && starClicks > 0 && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm font-jakarta font-bold text-sky-400 whitespace-nowrap animate-bounce tracking-widest uppercase">
                Tap {5 - starClicks}x to freeze the flow
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <MovingButton isHacked={isHacked} onClick={handleYesClick}>
              ABSOLUTELY!
            </MovingButton>
            <StaticButton onClick={handleNoClick}>
              STAY FROZEN
            </StaticButton>
          </div>
          
          <p className="text-sky-800 font-jakarta font-bold text-sm tracking-[0.3em] uppercase">
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
          <div className="fixed bottom-8 left-8 flex items-center gap-4 group z-20">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-12 h-12 rounded-2xl bg-sky-950/80 border border-sky-400/40 flex items-center justify-center text-sky-300 hover:bg-sky-900 hover:border-sky-300 transition-all duration-300 shadow-2xl shadow-cyan-500/10 backdrop-blur-md"
              aria-label="Hint"
            >
              <span className="font-syne font-bold text-xl">?</span>
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${showHint ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'} whitespace-nowrap`}>
              <div className="bg-sky-950/90 border border-sky-400/20 px-6 py-3 rounded-2xl text-sm font-jakarta text-sky-200 backdrop-blur-xl shadow-2xl tracking-wide">
                Psst... Tap the <span className="text-sky-300 font-bold underline decoration-sky-300/30">Ice Snowflake</span> 5 times!
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default App;
