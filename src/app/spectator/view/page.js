'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Trophy, Users, Zap, Sparkles, ArrowRight } from 'lucide-react';

export default function SpectatorView() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get('id');
  const [data, setData] = useState(null);
  const [fluxState, setFluxState] = useState({ state: 'IDLE' });
  const [overrideFlux, setOverrideFlux] = useState(false);

  useEffect(() => {
    if (!auctionId) return;
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${auctionId}`, { cache: 'no-store' });
            const result = await res.json();
            if (result.success) {
                setData(result.data);
                
                // Logic to reset override if a NEW animation starts
                if (result.data.fluxData?.state === 'ANIMATING') {
                    setOverrideFlux(false);
                }
                setFluxState(result.data.fluxData || { state: 'IDLE' });
            }
        } catch (e) { console.error(e); }
    }, 1000); 
    return () => clearInterval(interval);
  }, [auctionId]);

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Connecting to Arena...</div>;

  // --- FLUX VIEWS ---
  if (!overrideFlux && fluxState.state !== 'IDLE' && fluxState.state !== 'FOCUS' && fluxState.state !== 'ACTIVE') {
      if (fluxState.state === 'ANIMATING') {
          return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/20 animate-pulse"></div>
                <Zap className="w-32 h-32 text-purple-500 animate-bounce relative z-10"/>
                <h1 className="text-6xl font-bold font-tech mt-8 animate-pulse relative z-10">MIRACLE FLUX</h1>
                <p className="text-white/50 font-mono tracking-widest mt-2 relative z-10">RANDOMIZING...</p>
            </div>
          );
      }
      if (fluxState.state === 'REVEAL') {
          return (
              <div className="min-h-screen bg-[#050505] p-10 flex flex-col items-center justify-center relative">
                  <div className="absolute top-10 right-10 z-50">
                      <button onClick={() => setOverrideFlux(true)} className="px-6 py-3 bg-white text-black font-bold uppercase rounded-lg flex items-center gap-2 hover:bg-gray-200 shadow-xl transition-all">
                          Back to Live Auction <ArrowRight className="w-4 h-4"/>
                      </button>
                  </div>
                  <h1 className="text-5xl font-tech font-bold text-white uppercase tracking-widest mb-12 flex items-center gap-4"><Sparkles className="text-yellow-400" /> Flux Assignments</h1>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-7xl">
                      {fluxState.matches?.map((match, i) => (
                          <div key={match.playerId} className="relative h-80 bg-[#0a0a0a] border rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-50 duration-700" style={{ animationDelay: `${i * 150}ms`, borderColor: match.teamColor }}>
                              <div className="absolute inset-0">{match.playerImage ? <Image src={match.playerImage} fill className="object-cover" alt="p"/> : <div className="w-full h-full bg-white/5 flex items-center justify-center"><Users className="w-10 h-10 text-white/20"/></div>}</div>
                              <div className="absolute bottom-0 w-full p-4 bg-black/80 text-center"><h3 className="text-xl font-bold font-tech text-white uppercase">{match.playerName}</h3><span className="text-[10px] font-bold uppercase" style={{ color: match.teamColor }}>Sold To: {match.teamName}</span></div>
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
  const teamName = isSold ? data.teams.find(t => t.id === activePlayer.teamId)?.name : null;
  const teamColor = isSold ? (data.teams.find(t => t.id === activePlayer.teamId)?.themeColor || '#22C55E') : (data.currentBidder?.color || '#333');

  return (
    <div className="min-h-screen text-white flex flex-col transition-colors duration-1000 overflow-hidden" style={{ backgroundColor: '#050505' }}>
      <header className="sticky top-0 z-40 w-full h-24 flex items-center justify-center">
          <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1 opacity-60"><Trophy className="w-4 h-4" /><span className="text-[10px] uppercase tracking-[0.3em] font-bold">Live Auction</span></div>
              <h1 className="text-3xl font-tech font-bold uppercase tracking-widest text-glow">{data.name}</h1>
          </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        {!activePlayer ? (
            <div className="text-center opacity-40 animate-pulse">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/5"><Zap className="w-10 h-10" /></div>
                <h2 className="text-2xl font-bold uppercase tracking-widest">Waiting for Next Player</h2>
            </div>
        ) : (
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center animate-in zoom-in-95 duration-500">
                
                {/* IMAGE */}
                <div className="md:col-span-5 aspect-[4/5] relative bg-black/40 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 border-4 z-20 rounded-3xl transition-colors duration-500" style={{ borderColor: teamColor }}></div>
                    
                    {/* SOLD OVERLAY */}
                    {isSold && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="flex flex-col items-center gap-4">
                                <div className="border-8 border-green-500 text-green-500 px-8 py-2 text-7xl font-black uppercase -rotate-12 tracking-widest shadow-[0_0_100px_rgba(34,197,94,0.6)] mix-blend-screen">
                                    SOLD
                                </div>
                                <div className="bg-white text-black px-6 py-2 font-bold uppercase tracking-widest rounded-full animate-bounce">
                                    To {teamName}
                                </div>
                            </div>
                        </div>
                    )}

                    {activePlayer.image ? <Image src={activePlayer.image} fill className="object-cover" alt="p"/> : <div className="w-full h-full flex justify-center items-center"><Users className="w-32 h-32 text-white/10"/></div>}
                </div>

                {/* INFO */}
                <div className="md:col-span-7 flex flex-col gap-8">
                    <div>
                        <h2 className="text-7xl font-bold font-tech uppercase leading-none mb-2">{activePlayer.name}</h2>
                        <span className="text-xl text-white/50 font-mono uppercase tracking-widest bg-white/5 px-4 py-1 rounded">{activePlayer.role}</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded border bg-black/30 backdrop-blur-md transition-colors duration-500" style={{ borderColor: teamColor }}>
                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: teamColor }}>{isSold ? 'Sold Price' : 'Current Bid'}</span>
                            </div>
                            {(data.currentBidder || isSold) && (
                                <div className="px-4 py-2 rounded bg-white text-black font-bold text-xs uppercase tracking-widest animate-pulse">
                                    {isSold ? `Winner: ${teamName}` : `Leading: ${data.currentBidder.name}`}
                                </div>
                            )}
                        </div>
                        <div className="text-9xl font-mono font-bold text-white transition-all duration-300">
                            <span className="text-4xl align-top opacity-50">₹</span>
                            {isSold ? activePlayer.soldPrice.toLocaleString('en-IN') : (data.currentBid > 0 ? data.currentBid.toLocaleString('en-IN') : activePlayer.price.toLocaleString('en-IN'))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}