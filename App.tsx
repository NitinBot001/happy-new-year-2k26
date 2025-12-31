
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
      { title: "Frozen Heart? 🧊", message: "Looks like you're still in hibernation mode. 2025 was a lot. We'll just nap until 2027." },
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
  const [rotation, setRotation] = useState(0);
  const [isNoClicked, setIsNoClicked] = useState(false);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isHacked, setIsHacked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [starClicks, setStarClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleSpin = () => {
    if (isTossing) return;
    setIsTossing(true);
    
    const spins = 5 + Math.floor(Math.random() * 5); 
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (spins * 360) + extraDegrees;
    
    setRotation(totalRotation);

    setTimeout(() => {
      const normalized = (totalRotation % 360);
      const segmentIndex = Math.floor(((360 - normalized) % 360) / 45);
      const result: Theme = (segmentIndex % 2 === 0) ? 'gold' : 'ice';
      
      setTheme(result);
      setIsTossing(false);
    }, 4000);
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
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-6 text-center overflow-hidden">
        <h1 className="text-4xl md:text-7xl font-syne font-black text-white mb-8 tracking-tighter uppercase leading-none">
          Spin for your <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-white to-cyan-400">2026 Destiny</span>
        </h1>
        
        <div className="relative mt-8">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white drop-shadow-2xl animate-bounce-slow"></div>
          
          <div 
            onClick={handleSpin}
            className={`relative w-72 h-72 md:w-96 md:h-96 cursor-pointer group select-none transition-transform duration-500 ${isTossing ? 'scale-105' : 'hover:scale-105'}`}
          >
            <div className={`absolute -inset-6 rounded-full blur-3xl transition-opacity duration-1000 ${isTossing ? 'opacity-40 bg-white animate-pulse' : 'opacity-10 bg-white'}`}></div>
            
            <div 
              className="relative w-full h-full rounded-full border-[10px] border-white/20 bg-[#020617] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 4s cubic-bezier(0.15, 0, 0, 1)' 
              }}
            >
              {[...Array(8)].map((_, i) => {
                const isGold = i % 2 === 0;
                return (
                  <div 
                    key={i}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ transform: `rotate(${i * 45}deg)` }}
                  >
                    <div 
                      className={`w-full h-1/2 absolute top-0 left-0 origin-bottom flex items-start justify-center pt-8 border-l border-white/5`}
                      style={{ 
                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                        backgroundColor: isGold ? '#f59e0b' : '#0891b2',
                        opacity: isGold ? '0.7' : '0.6'
                      }}
                    >
                      <span className="text-2xl md:text-3xl filter brightness-110 drop-shadow-md">
                        {isGold ? '✨' : '❄️'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-900 border-4 border-white shadow-2xl flex items-center justify-center group-hover:bg-slate-800 transition-colors">
               <div className="text-center">
                 <p className="text-[10px] font-unbounded font-black text-white/50 tracking-widest uppercase">Tap to</p>
                 <p className="text-lg md:text-xl font-syne font-black text-white tracking-tighter uppercase leading-none">SPIN</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <p className={`font-jakarta tracking-[0.3em] uppercase text-xs md:text-sm font-black transition-all duration-500 ${isTossing ? 'text-white scale-110' : 'text-slate-500'}`}>
            {isTossing ? "Fate is spinning..." : "Will you be Aura or Frost?"}
          </p>
          
          <div className="flex justify-center gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Aura (Gold)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Frost (Ice)</span>
            </div>
          </div>
        </div>
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
            <div className="space-y-12 max-w-5xl mx-auto px-4 flex flex-col items-center">
              <h1 className={`text-6xl md:text-9xl font-syne font-black text-${activeContent.primary} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-bounce uppercase tracking-tighter`}>
                {theme === 'gold' ? 'LEGENDARY 2026!' : 'COOL 2026!'} {theme === 'gold' ? '✨' : '❄️'}
              </h1>
              <p className="text-xl md:text-3xl text-white font-outfit font-light leading-relaxed max-w-3xl mx-auto italic opacity-90">
                "{activeContent.celebration.top}"
              </p>
              <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 py-8 w-full">
                {activeContent.celebration.boxes.map((box, idx) => (
                  <div key={idx} className={`flex-1 p-8 bg-black/40 border border-${activeContent.primary}/30 rounded-[2rem] backdrop-blur-2xl shadow-xl transition-all duration-500 flex flex-col items-center justify-center hover:scale-105 hover:bg-black/60`}>
                    <span className="block text-white text-5xl font-unbounded font-black mb-4">{box.value}</span>
                    <span className={`text-xs font-jakarta font-bold uppercase tracking-widest text-${activeContent.primary}`}>{box.label}</span>
                  </div>
                ))}
              </div>
              <p className={`text-xl md:text-2xl font-outfit font-semibold text-${activeContent.primary}`}>
                {activeContent.celebration.bottom}
              </p>

              <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-sm">
                <p className="text-white/40 font-jakarta text-[10px] tracking-[0.4em] uppercase mb-4">Crafted by</p>
                <a 
                  href="https://www.instagram.com/nitin__bhujwa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group backdrop-blur-md`}
                >
                  <span className="text-2xl">📸</span>
                  <div className="text-left">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-none">Follow me on</p>
                    <p className={`text-lg font-syne font-black tracking-tight text-${activeContent.primary} group-hover:scale-105 transition-transform`}>
                      @nitin__bhujwa
                    </p>
                  </div>
                </a>
              </div>
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

              {/* Layout Stable Containers */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 min-h-[100px]">
                <div className="w-full sm:w-64 h-24 flex items-center justify-center relative">
                  <MovingButton isHacked={isHacked} theme={theme} onClick={() => { setIsYesClicked(true); triggerConfetti(true); }}>
                    ABSOLUTELY!
                  </MovingButton>
                </div>
                <div className="w-full sm:w-64 h-24 flex items-center justify-center">
                  <StaticButton theme={theme} onClick={() => setIsNoClicked(true)}>
                    {theme === 'gold' ? 'NOT YET' : 'STAY FROZEN'}
                  </StaticButton>
                </div>
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
              <div className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-sm font-jakarta text-white backdrop-blur-xl animate-fade-in shadow-2xl">
                Tap the center icon 5 times to bypass fate.
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default App;
