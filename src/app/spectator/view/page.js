'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Zap, User } from 'lucide-react';

export default function SpectatorView() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get('id');
  const [data, setData] = useState(null);
  const [fluxState, setFluxState] = useState({ state: 'IDLE' });

  // Polling for Real-Time Updates
  useEffect(() => {
    if (!auctionId) return;
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${auctionId}`, { cache: 'no-store' });
            const result = await res.json();
            if (result.success) {
                setData(result.data);
                setFluxState(result.data.fluxData);
            }
        } catch (e) { console.error(e); }
    }, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [auctionId]);

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Connecting to Feed...</div>;

  // --- FLUX MODE: ACTIVE ---
  if (fluxState.state === 'ACTIVE' || fluxState.state === 'FOCUS') {
      return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-900/20 animate-pulse"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              
              <div className="z-10 text-center">
                  <div className="w-32 h-32 mx-auto bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/50 mb-8 animate-[spin_10s_linear_infinite]">
                      <Zap className="w-16 h-16 text-purple-400" />
                  </div>
                  <h1 className="text-6xl font-bold font-tech uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white mb-4">
                      Flux Divide
                  </h1>
                  <p className="text-xl font-mono text-purple-300/60 uppercase tracking-[0.5em]">Initiating Random Assignment</p>
              </div>

              {/* SILHOUETTE REVEAL */}
              {fluxState.state === 'FOCUS' && fluxState.player && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
                      <div className="w-80 h-[500px] bg-gray-900 border-2 border-white/10 rounded-2xl relative overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                          {/* Silhouette Image */}
                          <div className="absolute inset-0 bg-black mix-blend-color">
                              {fluxState.player.image ? (
                                  <Image src={fluxState.player.image} fill className="object-cover opacity-50 brightness-0" alt="Unknown" />
                              ) : (
                                  <User className="w-full h-full p-10 text-white/10" />
                              )}
                          </div>
                          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                              <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse mb-2"></div>
                              <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // --- FLUX MODE: REVEAL (UNBOXING) ---
  if (fluxState.state === 'REVEAL') {
      return (
          <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center overflow-hidden">
              <h1 className="text-4xl font-bold font-tech text-white uppercase tracking-widest mb-10 animate-in slide-in-from-top-10 fade-in duration-1000">Assignments Complete</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-7xl">
                  {fluxState.matches.map((match, i) => (
                      <div 
                          key={match.playerId} 
                          className="relative h-96 perspective-1000 animate-in zoom-in-50 duration-700"
                          style={{ animationDelay: `${i * 200}ms` }}
                      >
                          <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden relative group shadow-2xl">
                              {/* Glow */}
                              <div className="absolute inset-0 opacity-0 animate-[pulse_2s_infinite]" style={{ backgroundColor: match.teamColor, opacity: 0.1 }}></div>
                              
                              {/* Player Image */}
                              <div className="h-3/4 relative">
                                  {match.playerImage ? (
                                      <Image src={match.playerImage} fill className="object-cover" alt={match.playerName} />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-white/5"><User className="w-16 h-16 text-white/20" /></div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                              </div>

                              {/* Text Info */}
                              <div className="absolute bottom-0 w-full p-6 text-center">
                                  <h3 className="text-2xl font-bold font-tech text-white uppercase leading-none mb-2">{match.playerName}</h3>
                                  <div className="inline-block px-3 py-1 rounded border bg-black/50 backdrop-blur-md" style={{ borderColor: match.teamColor, color: match.teamColor }}>
                                      <span className="text-xs font-bold uppercase tracking-widest">{match.teamName}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  // --- DEFAULT AUCTION VIEW ---
  // (You can expand this with the normal current player view later)
  return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
          <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mx-auto mb-4"></div>
              <h1 className="text-xl font-mono text-white/40 uppercase tracking-widest">Waiting for Next Event...</h1>
          </div>
      </div>
  );
}