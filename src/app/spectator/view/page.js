'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Trophy, Users, Zap, Sparkles, ArrowRight, SkipForward, X } from 'lucide-react';

// --- HELPER: Random Emojis ---
const REACTION_ICONS = ['🔥', '❤️', '👏', '😮', '🎉', '💸', '🏏'];

// --- COMPONENT: CountUp Price ---
function PriceTicker({ value }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = displayValue;
        const end = value || 0;
        if (start === end) return;

        const range = end - start;
        const duration = 1000;
        const startTime = Date.now();

        const tick = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (range * ease));
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [value]);

    return <span>{displayValue.toLocaleString('en-IN')}</span>;
}

// --- COMPONENT: SOLD CELEBRATION ---
function SoldCelebration({ player, teamName, teamColor, price, onClose }) {
    
    // Auto-Close Timer (5 Seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); 
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#050505]/95 flex items-center justify-center animate-in fade-in duration-300 overflow-hidden backdrop-blur-3xl p-6">
            
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-transparent to-black opacity-80 z-0" style={{ backgroundColor: `${teamColor}22` }}></div>

            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
                {[...Array(50)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 rounded-full animate-float"
                         style={{
                             backgroundColor: i % 2 === 0 ? teamColor : '#fff',
                             left: `${Math.random() * 100}%`,
                             top: `${Math.random() * 100}%`,
                             animationDuration: `${1.5 + Math.random() * 2}s`
                         }}
                    ></div>
                ))}
            </div>

            {/* 2. CLOSE BUTTON - MOVED DOWN (top-28) to clear Navbar */}
            <button 
                onClick={onClose}
                className="absolute top-28 right-8 z-[200] p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-md border-2 border-white/20 shadow-2xl cursor-pointer hover:scale-110"
            >
                <X className="w-8 h-8" />
            </button>

            {/* MAIN CONTENT */}
            <div className="relative z-30 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center px-4">
                
                {/* LEFT: PLAYER CARD */}
                <div className="col-span-1 md:col-span-5 flex justify-center animate-in slide-in-from-left-20 duration-700">
                    <div className="relative w-full max-w-xs aspect-[3/4] bg-[#0f0f11] rounded-[1.5rem] border-4 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] group" style={{ borderColor: teamColor }}>
                        
                        {/* SOLD Stamp */}
                        <div className="absolute top-6 right-[-15px] z-30 rotate-[30deg] border-4 border-white bg-red-600 text-white px-8 py-1 text-2xl font-black uppercase tracking-widest shadow-lg animate-pulse">
                            SOLD
                        </div>

                        {player.image ? (
                            <Image src={player.image} fill className="object-cover object-top" alt="Player" />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center"><Users className="w-20 h-20 text-white/10"/></div>
                        )}
                        
                        <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
                            <h2 className="text-3xl font-bold font-tech text-white uppercase leading-none mb-2">{player.name}</h2>
                            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                                {player.role}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TEAM & PRICE */}
                <div className="col-span-1 md:col-span-7 flex flex-col justify-center animate-in slide-in-from-right-20 duration-700 delay-100">
                    
                    <div className="mb-2">
                        <span className="text-white/40 font-mono text-xs uppercase tracking-[0.4em] border-l-2 border-white/20 pl-4">
                            New Acquisition
                        </span>
                    </div>

                    <h1 className="text-6xl lg:text-7xl font-black font-tech uppercase text-white leading-[0.9] mb-6 drop-shadow-2xl">
                        {teamName}
                    </h1>

                    <div className="flex items-center gap-6">
                        <div className="h-16 w-1 bg-white/20"></div>
                        <div>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Final Price</p>
                            <div className="text-5xl font-mono font-bold text-white flex items-center gap-2" style={{ color: teamColor }}>
                                <span className="opacity-50 text-3xl">₹</span>
                                {price?.toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default function SpectatorView() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get('id');
  
  // -- STATE --
  const [data, setData] = useState(null);
  const [fluxState, setFluxState] = useState({ state: 'IDLE' });
  const [overrideFlux, setOverrideFlux] = useState(false);
  const [reactions, setReactions] = useState([]);
  
  // Celebration State
  const [celebration, setCelebration] = useState(null); 

  // REFS for Logic
  const lastFluxState = useRef('IDLE');
  const soldStatusMap = useRef({}); 
  const isFirstLoad = useRef(true);

  // 1. POLLING & DIFFING ENGINE
  useEffect(() => {
    if (!auctionId) return;
    
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${auctionId}`, { cache: 'no-store' });
            const result = await res.json();
            
            if (result.success) {
                const newData = result.data;
                setData(newData);

                // --- SMART DETECTION LOGIC ---
                if (newData.players) {
                    let newlySoldPlayer = null;

                    newData.players.forEach(p => {
                        const wasSold = soldStatusMap.current[p.id];
                        const isSold = p.isSold;

                        if (!wasSold && isSold && !isFirstLoad.current) {
                            newlySoldPlayer = p;
                        }
                        soldStatusMap.current[p.id] = isSold;
                    });

                    if (newlySoldPlayer) {
                        const team = newData.teams.find(t => t.id === newlySoldPlayer.teamId);
                        setCelebration({
                            id: newlySoldPlayer.id,
                            player: newlySoldPlayer,
                            teamName: team?.name || 'Unknown Team',
                            teamColor: team?.themeColor || '#22C55E',
                            price: newlySoldPlayer.soldPrice
                        });
                    }

                    if (isFirstLoad.current) isFirstLoad.current = false;
                }

                // --- FLUX LOGIC ---
                const serverFlux = newData.fluxData || { state: 'IDLE' };
                if (serverFlux.state === 'ANIMATING' && lastFluxState.current !== 'ANIMATING') {
                    setOverrideFlux(false);
                }
                setFluxState(serverFlux);
                lastFluxState.current = serverFlux.state;
            }
        } catch (e) { console.error(e); }
    }, 1000); 
    
    return () => clearInterval(interval);
  }, [auctionId]);

  // 2. Fan Reactions Animation
  useEffect(() => {
    const reactionInterval = setInterval(() => {
        const id = Date.now();
        const emoji = REACTION_ICONS[Math.floor(Math.random() * REACTION_ICONS.length)];
        const left = Math.random() * 100; 
        setReactions(prev => [...prev, { id, emoji, left }]);
        setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 3000);
    }, 800); 
    return () => clearInterval(reactionInterval);
  }, []);

  // --- 3. STABLE CLOSE HANDLER ---
  const handleCloseCelebration = useCallback(() => {
      setCelebration(null);
  }, []);

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest animate-pulse">Connecting...</div>;

  // --- RENDER LOGIC ---
  const celebrationOverlay = celebration ? (
      <SoldCelebration 
          {...celebration} 
          onClose={handleCloseCelebration} 
      />
  ) : null;

  // --- VIEW 1: FLUX ---
  if (!overrideFlux && fluxState.state !== 'IDLE' && fluxState.state !== 'FOCUS' && fluxState.state !== 'ACTIVE') {
      if (fluxState.state === 'ANIMATING') {
          return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/20 animate-pulse"></div>
                <Zap className="w-32 h-32 text-purple-500 animate-bounce relative z-10"/>
                <h1 className="text-6xl font-bold font-tech mt-8 animate-pulse relative z-10">FLUX DIVIDE</h1>
            </div>
          );
      }
      if (fluxState.state === 'REVEAL') {
          return (
              <div className="min-h-screen bg-[#050505] p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                  <div className="flex justify-between items-center mb-8 relative z-20">
                      <h1 className="text-4xl font-tech font-bold text-white uppercase tracking-widest"><Sparkles className="inline w-8 h-8 text-purple-400 mr-4"/> Flux Results</h1>
                      <button onClick={() => setOverrideFlux(true)} className="px-6 py-3 bg-white text-black font-bold uppercase rounded-full flex items-center gap-2 hover:bg-gray-200"><SkipForward className="w-4 h-4"/> Lobby</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 z-10 overflow-y-auto pb-20 custom-scrollbar max-h-[80vh]">
                      {fluxState.matches?.map((match, i) => (
                          <div key={match.playerId} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                              <div className="relative aspect-[3/4]">{match.playerImage ? <Image src={match.playerImage} fill className="object-cover" alt="p"/> : <div className="w-full h-full bg-white/5 flex items-center justify-center"><Users className="w-10 h-10 text-white/20"/></div>}</div>
                              <div className="absolute bottom-0 w-full p-4 z-20">
                                  <h3 className="font-bold text-white uppercase leading-none mb-1">{match.playerName}</h3>
                                  <div className="text-[10px] font-bold uppercase px-2 py-1 rounded w-fit" style={{ backgroundColor: match.teamColor, color: '#fff' }}>{match.teamName}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }
  }

  // --- STANDARD VIEW ---
  const activePlayer = data.activePlayer;
  const isSold = activePlayer?.isSold; 
  const teamColor = (data.currentBidder?.color || '#333');
  const displayPrice = (data.currentBid > 0 ? data.currentBid : (activePlayer?.price || 0));
  
  const backgroundTeamColor = isSold ? (data.teams.find(t => t.id === activePlayer.teamId)?.themeColor || '#22C55E') : teamColor;
  const backgroundPrice = isSold ? activePlayer.soldPrice : displayPrice;

  return (
    <div className="min-h-screen text-white flex flex-col transition-colors duration-1000 overflow-hidden relative" style={{ backgroundColor: '#050505' }}>
      
      {celebrationOverlay}

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000" style={{ backgroundColor: backgroundTeamColor, opacity: 0.1 }}></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[50]">
          {reactions.map((r) => (
              <div key={r.id} className="absolute text-4xl animate-float-up opacity-0" style={{ left: `${r.left}%`, bottom: '-50px', animation: 'floatUp 3s ease-in forwards' }}>{r.emoji}</div>
          ))}
      </div>

      <header className="sticky top-0 z-40 w-full h-24 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1 opacity-60"><Trophy className="w-3 h-3" /><span className="text-[9px] uppercase tracking-[0.3em] font-bold">Live Spectator Feed</span></div>
              <h1 className="text-2xl font-tech font-bold uppercase tracking-widest text-glow">{data.name}</h1>
          </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        {!activePlayer ? (
            <div className="text-center opacity-40 animate-pulse">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/5"><Zap className="w-10 h-10" /></div>
                <h2 className="text-2xl font-bold uppercase tracking-widest">Waiting for Next Player</h2>
            </div>
        ) : (
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center animate-in zoom-in-95 duration-500">
                <div className="md:col-span-5 aspect-[3/4] relative bg-[#0f0f11] rounded-[2.5rem] border-4 overflow-hidden shadow-2xl transition-all duration-500" style={{ borderColor: backgroundTeamColor }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                    {activePlayer.image ? <Image src={activePlayer.image} fill className="object-cover object-top" alt="p"/> : <div className="w-full h-full flex justify-center items-center"><Users className="w-32 h-32 text-white/10"/></div>}
                    <div className="absolute bottom-0 w-full p-8 z-20">
                        <h2 className="text-6xl font-bold font-tech text-white uppercase leading-[0.9] mb-4">{activePlayer.name}</h2>
                        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-sm font-bold text-white uppercase tracking-wider">{activePlayer.role}</span>
                    </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-center h-full py-10">
                    <div className="mb-12">
                        <div className={`inline-flex items-center gap-4 px-8 py-3 rounded-full border backdrop-blur-xl shadow-lg transition-all duration-500`} 
                            style={{ borderColor: `${backgroundTeamColor}66`, backgroundColor: `${backgroundTeamColor}15`, boxShadow: `0 0 30px ${backgroundTeamColor}15` }}>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: backgroundTeamColor }}></span>
                                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: backgroundTeamColor }}></span>
                            </span>
                            <span className="text-base font-bold uppercase tracking-widest text-white">
                                {data.currentBidder ? `Leading: ${data.currentBidder.name}` : (isSold ? 'SOLD' : 'Open for Bids')}
                            </span>
                        </div>
                    </div>

                    <div className="mb-12">
                        <p className="text-sm text-white/40 font-bold uppercase tracking-[0.3em] mb-4">{isSold ? 'Winning Bid' : 'Current Price'}</p>
                        <div className="text-[8rem] font-mono font-bold text-white tracking-tighter leading-none flex items-start drop-shadow-2xl">
                            <span className="text-5xl mt-6 opacity-30 mr-6">₹</span>
                            <PriceTicker value={backgroundPrice} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-2">Category</div>
                            <div className="text-2xl font-bold text-white">{activePlayer.category || 'General'}</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-2">Base Price</div>
                            <div className="text-2xl font-bold text-white">₹ {activePlayer.price?.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
      
      <style jsx global>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-80vh) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}