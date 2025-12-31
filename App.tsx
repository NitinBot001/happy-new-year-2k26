
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import MovingButton from './components/MovingButton';
import StaticButton from './components/StaticButton';
import BackgroundAnimation from './components/BackgroundAnimation';

type Theme = 'gold' | 'ice' | 'none';

const contentMap = {
  gold: {
    primary: 'amber-400',
    secondary: 'amber-500',
    bg: 'slate-950',
    particleColors: ['#fbbf24', '#f59e0b', '#ffffff'],
    failJokes: [
      { title: "Honesty is Key! 😴", message: "Fair enough. 2025 was a lot. We'll just nap until 2027." },
      { title: "Understood! 📉", message: "Lowering expectations to 'Just Survived' mode. Coffee is on the left." },
      { title: "Realist Alert! 🍕", message: "Who needs legendary when you have leftover pizza and a stable internet connection?" }
    ],
    celebration: {
      top: "The stars align for your greatest chapter yet. May your path be paved with gold and your spirit remain unbreakable.",
      boxes: [
        { value: "365", label: "GOLDEN CHANCES" },
        { value: "100%", label: "PURE AMBITION" },
        { value: "∞", label: "PROSPERITY" }
      ],
      bottom: "The crown is yours to claim. ✨"
    }
  },
  ice: {
    primary: 'cyan-300',
    secondary: 'sky-400',
    bg: 'sky-950',
    particleColors: ['#7dd3fc', '#e0f2fe', '#ffffff'],
    failJokes: [
      { title: "Frozen Heart? 🧊", message: "Looks like you're still in hibernation mode. 2025 was a long winter, huh?" },
      { title: "Ice Cold! 🥶", message: "Expectations set to 'Absolute Zero'. We'll just stay inside and drink hot cocoa." },
      { title: "Snow Joke! ⛄", message: "Who needs legendary when you have a warm blanket and zero responsibilities?" }
    ],
    celebration: {
      top: "The ice breaks — and so can your limits. Here’s to crisp courage, frosty mornings, and dreams that crystallize into reality.",
      boxes: [
        { value: "365", label: "NEW OPPORTUNITIES" },
        { value: "52", label: "WEEKS OF GROWTH" },
        { value: "1", label: "BRAND-NEW YOU" }
      ],
      bottom: "Keep sliding — the magic is in the journey ❄️"
    }
  }
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('none');
  const [isTossing, setIsTossing] = useState(false);
  const [isNoClicked, setIsNoClicked] = useState(false);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isHacked, setIsHacked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [starClicks, setStarClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleToss = () => {
    setIsTossing(true);
    setTimeout(() => {
      const result: Theme = Math.random() > 0.5 ? 'gold' : 'ice';
      setTheme(result);
      setIsTossing(false);
    }, 2000);
  };

  const triggerConfetti = (isBig: boolean) => {
    const config = contentMap[theme === 'none' ? 'gold' : theme];
    if (isBig) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        confetti({ 
          particleCount: 40, 
          spread: 360, 
          colors: config.particleColors,
          origin: { x: Math.random(), y: Math.random() - 0.2 } 
        });
      }, 250);
    } else {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: config.particleColors
      });
    }
  };

  const handleStarClick = () => {
    if (isHacked || isNoClicked || isYesClicked) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    const nextClicks = starClicks + 1;
    setStarClicks(nextClicks);
    if (nextClicks >= 5) {
      setIsHacked(true);
      triggerConfetti(false);
    }
  };

  if (theme === 'none') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-syne font-black text-white mb-12 tracking-tighter uppercase">
          Toss for your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400">2026 Destiny</span>
        </h1>
        
        <div 
          onClick={!isTossing ? handleToss : undefined}
          className={`relative w-48 h-48 md:w-64 md:h-64 cursor-pointer group transition-all duration-500 ${isTossing ? 'animate-spin scale-110' : 'hover:scale-105'}`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-white to-cyan-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
          <div className="relative w-full h-full rounded-full border-4 border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br from-amber-500/40 to-cyan-500/40 transition-opacity duration-1000 ${isTossing ? 'opacity-100' : 'opacity-40'}`}></div>
            <span className="text-5xl md:text-7xl drop-shadow-2xl">
              {isTossing ? '⏳' : '🔮'}
            </span>
          </div>
        </div>

        <p className="mt-12 font-jakarta text-slate-500 tracking-widest uppercase text-xs md:text-sm font-bold">
          {isTossing ? "Consulting the universe..." : "Tap the orb to begin"}
        </p>
      </main>
    );
  }

  const activeContent = contentMap[theme];

  return (
    <>
      <BackgroundAnimation theme={theme} />
      <main className="flex items-center justify-center min-h-screen text-slate-100 p-4 overflow-hidden relative">
        <div className={`text-center transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {isYesClicked ? (
            <div className="space-y-12 max-w-5xl mx-auto px-4">
              <h1 className={`text-6xl md:text-9xl font-syne font-black text-${activeContent.primary} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-bounce uppercase tracking-tighter`}>
                {theme === 'gold' ? 'LEGENDARY 2026!' : 'COOL 2026!'} {theme === 'gold' ? '✨' : '❄️'}
              </h1>
              <p className="text-xl md:text-3xl text-white font-outfit font-light leading-relaxed max-w-3xl mx-auto italic opacity-90">
                "{activeContent.celebration.top}"
              </p>
              <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 py-8">
                {activeContent.celebration.boxes.map((box, idx) => (
                  <div key={idx} className={`flex-1 p-8 bg-black/40 border border-${activeContent.primary}/30 rounded-[2rem] backdrop-blur-2xl shadow-xl transition-all duration-500 flex flex-col items-center justify-center`}>
                    <span className="block text-white text-5xl font-unbounded font-black mb-4">{box.value}</span>
                    <span className={`text-xs font-jakarta font-bold uppercase tracking-widest text-${activeContent.primary}`}>{box.label}</span>
                  </div>
                ))}
              </div>
              <p className={`text-xl md:text-2xl font-outfit font-semibold text-${activeContent.primary}`}>
                {activeContent.celebration.bottom}
              </p>
            </div>
          ) : isNoClicked ? (
            <div className="space-y-8">
              <h1 className={`text-5xl md:text-7xl font-syne font-bold text-${activeContent.primary} tracking-tight uppercase`}>
                {activeContent.failJokes[0].title}
              </h1>
              <p className="text-xl md:text-3xl text-white/80 font-outfit font-light max-w-2xl mx-auto italic">
                {activeContent.failJokes[0].message}
              </p>
              <button 
                onClick={() => setIsNoClicked(false)}
                className={`font-jakarta text-${activeContent.primary} hover:opacity-70 underline text-lg transition-all underline-offset-8 mt-12`}
              >
                Actually, let's make it happen...
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              <h1 className="text-5xl md:text-8xl font-syne font-black text-white tracking-tight leading-[1.1]">
                Ready to make <span className={`text-${activeContent.primary} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] uppercase`}>{theme === 'gold' ? 'History' : 'Chill'}</span> in 2026? <br/>
                It's your <span className="italic underline decoration-white/20 decoration-4 underline-offset-8">time.</span>
              </h1>
              
              <div onClick={handleStarClick} className={`relative inline-block text-8xl md:text-[12rem] cursor-pointer select-none transition-all duration-500 ${isShaking ? 'scale-125 rotate-12' : 'hover:scale-105'}`}>
                <span className={`filter brightness-125 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]`}>
                  {isHacked ? (theme === 'gold' ? '👑' : '❆') : (theme === 'gold' ? '⭐' : '❄')}
                </span>
                {!isHacked && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-unbounded font-black text-black/80">26</div>}
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                <MovingButton isHacked={isHacked} theme={theme} onClick={() => { setIsYesClicked(true); triggerConfetti(true); }}>
                  ABSOLUTELY!
                </MovingButton>
                <StaticButton theme={theme} onClick={() => setIsNoClicked(true)}>
                  {theme === 'gold' ? 'NOT YET' : 'STAY FROZEN'}
                </StaticButton>
              </div>
            </div>
          )}
        </div>

        {!isHacked && !isYesClicked && !isNoClicked && (
          <div className="fixed bottom-8 left-8 flex items-center gap-4 group z-20">
            <button onClick={() => setShowHint(!showHint)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all backdrop-blur-md">
              <span className="font-syne font-bold text-xl">?</span>
            </button>
            {showHint && (
              <div className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-sm font-jakarta text-white backdrop-blur-xl animate-fade-in">
                Tap the center icon 5 times to unlock.
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default App;
