
import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import MovingButton from './components/MovingButton';
import StaticButton from './components/StaticButton';
import BackgroundAnimation from './components/BackgroundAnimation';

type Theme = 'gold' | 'ice' | 'none';

// --- Procedural & Music Engine ---
const useSoundEffects = () => {
  const audioCtx = useRef<AudioContext | null>(null);
  const musicAudio = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  };

  const playSound = (type: 'tick' | 'whoosh' | 'ding' | 'success' | 'click' | 'reveal') => {
    if (isMuted || !audioCtx.current) return;
    const ctx = audioCtx.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'tick':
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.02);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
        break;
      case 'whoosh':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case 'ding':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'click':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'reveal':
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.exponentialRampToValueAtTime(880, now + 0.8);
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        gain2.gain.setValueAtTime(0.1, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc2.start(now);
        osc2.stop(now + 0.8);
        break;
      case 'success':
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.1);
          g.connect(ctx.destination);
          o.connect(g);
          g.gain.setValueAtTime(0.1, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.6);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.6);
        });
        break;
    }
  };

  const playMusic = () => {
    if (isMuted) return;
    if (!musicAudio.current) {
      musicAudio.current = new Audio('https://raw.githubusercontent.com/NitinBot001/happy-new-year-2k26/main/music.ogg');
      musicAudio.current.loop = true;
      musicAudio.current.volume = 0.5;
    }
    musicAudio.current.play().catch(e => console.error("Audio playback error:", e));
  };

  const stopMusic = () => {
    if (musicAudio.current) {
      musicAudio.current.pause();
    }
  };

  useEffect(() => {
    if (isMuted) stopMusic();
    else if (musicAudio.current && !musicAudio.current.paused) playMusic();
  }, [isMuted]);

  return { initAudio, playSound, playMusic, stopMusic, isMuted, setIsMuted };
};

const contentMap = {
  gold: {
    primary: 'amber-400',
    secondary: 'amber-500',
    bg: 'slate-950',
    particleColors: ['#fbbf24', '#f59e0b', '#ffffff'],
    failJokes: [
      { title: "Honesty is Key! 😴", message: "Fair enough. 2025 was a lot. We'll just nap until 2027." },
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
  const { initAudio, playSound, playMusic, stopMusic, isMuted, setIsMuted } = useSoundEffects();
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
  const [indicatorFlutter, setIndicatorFlutter] = useState(false);
  
  const lastSnap = useRef(0);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleSpin = () => {
    if (isTossing) return;
    initAudio();
    setIsTossing(true);
    playSound('click');
    
    const spins = 5 + Math.floor(Math.random() * 5); 
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (spins * 360) + extraDegrees;
    
    const duration = 4000;
    setRotation(totalRotation);

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRotation = rotation + (totalRotation - rotation) * easeOut;
      
      const currentSnap = Math.floor(currentRotation / 45);
      if (currentSnap !== lastSnap.current) {
        playSound('tick');
        lastSnap.current = currentSnap;
        setIndicatorFlutter(true);
        setTimeout(() => setIndicatorFlutter(false), 60);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    setTimeout(() => {
      const normalized = (totalRotation % 360);
      const segmentIndex = Math.floor(((360 - normalized) % 360) / 45);
      const result: Theme = (segmentIndex % 2 === 0) ? 'gold' : 'ice';
      
      setTheme(result);
      setIsTossing(false);
      playSound('reveal');
    }, duration);
  };

  const triggerConfetti = (isBig: boolean) => {
    const config = contentMap[theme === 'none' ? 'gold' : theme];
    if (isBig) {
      playSound('success');
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
    initAudio();
    playSound('ding');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    const nextClicks = starClicks + 1;
    setStarClicks(nextClicks);
    if (nextClicks >= 5) {
      setIsHacked(true);
      triggerConfetti(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    initAudio();
  };

  const handleAbsolutelyClick = () => {
    initAudio();
    playSound('click');
    setIsYesClicked(true);
    triggerConfetti(true);
    playMusic();
  };

  if (theme === 'none') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-4 text-center overflow-x-hidden relative">
        <button 
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all active:scale-90"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-syne font-black text-white mb-2 tracking-tighter uppercase leading-tight px-2">
            SPIN FOR YOUR
          </h1>
          
          <div className="w-full max-w-xs h-6 sm:h-8 rounded-sm bg-gradient-to-r from-amber-400 via-white to-cyan-400 mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]"></div>
          
          <div className="relative inline-block w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            
            {/* Fixed Indicator Container: Ensured perfect centering with fixed width */}
            <div className="absolute -top-12 left-0 w-full flex justify-center z-50 pointer-events-none">
                <div className={`transition-transform duration-75 origin-bottom ${indicatorFlutter ? '-rotate-12 translate-y-1' : 'rotate-0'}`}>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-sm rotate-45 border-r-4 border-b-4 border-slate-900 transition-all ${isTossing ? 'scale-110' : ''}`}></div>
                </div>
            </div>
            
            <div 
              onClick={handleSpin}
              className={`w-full h-full cursor-pointer group select-none transition-transform duration-500 ${isTossing ? 'scale-100' : 'hover:scale-105 active:scale-95'}`}
            >
              <div className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-1000 ${isTossing ? 'opacity-40 bg-white animate-pulse' : 'opacity-10 bg-white'}`}></div>
              
              <div 
                className="relative w-full h-full rounded-full border-[6px] sm:border-[10px] border-white/20 bg-slate-900 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 4s cubic-bezier(0.15, 0, 0, 1)',
                  background: 'conic-gradient(#f59e0b 0deg 45deg, #0891b2 45deg 90deg, #f59e0b 90deg 135deg, #0891b2 135deg 180deg, #f59e0b 180deg 225deg, #0891b2 225deg 270deg, #f59e0b 270deg 315deg, #0891b2 315deg 360deg)'
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute top-0 left-0 w-full h-full flex justify-center pt-8 sm:pt-12 pointer-events-none"
                    style={{ transform: `rotate(${i * 45 + 22.5}deg)` }}
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl filter brightness-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
                      {i % 2 === 0 ? '✨' : '❄️'}
                    </span>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/20 origin-center" style={{ transform: 'rotate(-22.5deg)' }}></div>
                  </div>
                ))}
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-slate-900 border-2 sm:border-4 border-white shadow-2xl flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                 <div className="text-center">
                   <p className="text-[8px] sm:text-[10px] font-unbounded font-black text-white/50 tracking-widest uppercase mb-1">Tap to</p>
                   <p className="text-sm sm:text-base md:text-xl font-syne font-black text-white tracking-tighter uppercase leading-none">SPIN</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 px-4">
          <p className={`font-jakarta tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm font-black transition-all duration-500 ${isTossing ? 'text-white scale-110' : 'text-slate-500'}`}>
            {isTossing ? "Fate is spinning..." : "Will you be Aura or Frost?"}
          </p>
          
          <div className="flex justify-center gap-4 sm:gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500"></span>
              <span className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-widest">Aura</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-500"></span>
              <span className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-widest">Frost</span>
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
      <main className="fixed inset-0 text-slate-100 p-4 overflow-y-auto overflow-x-hidden flex items-start sm:items-center justify-center">
        <button 
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all active:scale-90"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <div className={`w-full max-w-5xl mx-auto py-12 text-center transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {isYesClicked ? (
            <div className="space-y-8 md:space-y-12 px-4 flex flex-col items-center">
              <h1 className={`text-4xl sm:text-6xl md:text-9xl font-syne font-black text-${activeContent.primary} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-bounce uppercase tracking-tighter leading-tight`}>
                {theme === 'gold' ? 'LEGENDARY 2026!' : 'COOL 2026!'} {theme === 'gold' ? '✨' : '❄️'}
              </h1>
              <p className="text-lg sm:text-xl md:text-3xl text-white font-outfit font-light leading-relaxed max-w-3xl mx-auto italic opacity-90 px-4">
                "{activeContent.celebration.top}"
              </p>
              <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 md:gap-6 py-4 md:py-8 w-full">
                {activeContent.celebration.boxes.map((box, idx) => (
                  <div key={idx} className={`flex-1 p-6 md:p-8 bg-black/40 border border-${activeContent.primary}/30 rounded-2xl md:rounded-[2rem] backdrop-blur-2xl shadow-xl transition-all duration-500 flex flex-col items-center justify-center hover:scale-105 hover:bg-black/60`}>
                    <span className="block text-white text-3xl sm:text-5xl font-unbounded font-black mb-2 md:mb-4">{box.value}</span>
                    <span className={`text-[10px] md:text-xs font-jakarta font-bold uppercase tracking-widest text-${activeContent.primary}`}>{box.label}</span>
                  </div>
                ))}
              </div>
              <p className={`text-lg md:text-2xl font-outfit font-semibold text-${activeContent.primary} mt-4`}>
                {activeContent.celebration.bottom}
              </p>

              <div className="mt-12 md:mt-16 pt-8 border-t border-white/10 w-full max-w-sm">
                <p className="text-white/40 font-jakarta text-[8px] sm:text-[10px] tracking-[0.4em] uppercase mb-4">Crafted by</p>
                <a 
                  href="https://www.instagram.com/nitin__bhujwa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => { initAudio(); playSound('click'); }}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group backdrop-blur-md`}
                >
                  <span className="text-xl sm:text-2xl"></span>
                  <div className="text-left">
                    <p className="text-[8px] sm:text-[10px] text-white/50 font-bold uppercase tracking-widest leading-none">Follow me on</p>
                    <p className={`text-base sm:text-lg font-syne font-black tracking-tight text-${activeContent.primary} group-hover:scale-105 transition-transform`}>
                      @nitin__bhujwa
                    </p>
                  </div>
                </a>
              </div>
            </div>
          ) : isNoClicked ? (
            <div className="space-y-8 px-4">
              <h1 className={`text-3xl sm:text-5xl md:text-7xl font-syne font-bold text-${activeContent.primary} tracking-tight uppercase leading-tight`}>
                {activeContent.failJokes[0].title}
              </h1>
              <p className="text-lg sm:text-xl md:text-3xl text-white/80 font-outfit font-light max-w-2xl mx-auto italic">
                {activeContent.failJokes[0].message}
              </p>
              <button 
                onClick={() => { initAudio(); playSound('click'); setIsNoClicked(false); }}
                className={`font-jakarta text-${activeContent.primary} hover:opacity-70 underline text-base md:text-lg transition-all underline-offset-8 mt-8 md:mt-12`}
              >
                Actually, let's make it happen...
              </button>
            </div>
          ) : (
            <div className="space-y-10 md:space-y-16 px-4">
              <h1 className="text-3xl sm:text-5xl md:text-8xl font-syne font-black text-white tracking-tight leading-tight">
                Ready to make <span className={`text-${activeContent.primary} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] uppercase`}>{theme === 'gold' ? 'History' : 'Chill'}</span> in 2026? <br/>
                It's your <span className="italic underline decoration-white/20 decoration-4 underline-offset-8">time.</span>
              </h1>
              
              <div onClick={handleStarClick} className={`relative inline-block text-6xl sm:text-8xl md:text-[12rem] cursor-pointer select-none transition-all duration-500 ${isShaking ? 'scale-125 rotate-12' : 'hover:scale-105'}`}>
                <span className={`filter brightness-125 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]`}>
                  {isHacked ? (theme === 'gold' ? '👑' : '❆') : (theme === 'gold' ? '⭐' : '❄')}
                </span>
                {!isHacked && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl md:text-3xl font-unbounded font-black text-black/80">26</div>}
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 min-h-[160px] md:min-h-[100px] w-full max-w-2xl mx-auto">
                <div className="w-full sm:w-1/2 h-20 sm:h-24 flex items-center justify-center relative">
                  <MovingButton 
                    isHacked={isHacked} 
                    theme={theme} 
                    onMove={() => { initAudio(); playSound('whoosh'); }}
                    onClick={handleAbsolutelyClick}
                  >
                    ABSOLUTELY!
                  </MovingButton>
                </div>
                <div className="w-full sm:w-1/2 h-20 sm:h-24 flex items-center justify-center">
                  <StaticButton theme={theme} onClick={() => { initAudio(); playSound('click'); setIsNoClicked(true); }}>
                    {theme === 'gold' ? 'NOT YET' : 'STAY FROZEN'}
                  </StaticButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isHacked && !isYesClicked && !isNoClicked && (
          <div className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 flex items-center gap-4 group z-20">
            <button onClick={() => { initAudio(); playSound('click'); setShowHint(!showHint); }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all backdrop-blur-md active:scale-90">
              <span className="font-syne font-bold text-lg sm:text-xl">?</span>
            </button>
            {showHint && (
              <div className="bg-white/10 border border-white/10 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-jakarta text-white backdrop-blur-xl animate-fade-in shadow-2xl max-w-[200px] sm:max-w-none">
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
