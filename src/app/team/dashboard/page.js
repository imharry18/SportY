'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Wallet, Users, Zap, Shield, LogOut, X, Trophy, Edit3, Save, Upload, Check, Hand, Clock, ArrowRight, Sparkles, AlertCircle, PauseCircle, Star } from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function TeamDashboard() {
  const router = useRouter();
  
  // -- STATE --
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]);
  const [auctionState, setAuctionState] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // New Signing Logic
  const previousSquadRef = useRef(new Set()); 
  const [newSigning, setNewSigning] = useState(null);

  // Flux State
  const [fluxTimer, setFluxTimer] = useState(30);
  const [showFluxResult, setShowFluxResult] = useState(false);

  // Modals
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type) => setToast({ message: msg, type });

  // 1. Session & Polling
  useEffect(() => {
    const session = localStorage.getItem('sporty_team_session');
    if (!session) { router.push('/join-auction'); return; }
    const parsedTeam = JSON.parse(session);
    setTeam(parsedTeam);

    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${parsedTeam.auctionId}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                const newState = data.data;
                
                // Detect New Signing
                const myPlayers = newState.players.filter(p => p.teamId === parsedTeam.id);
                const currentIds = new Set(myPlayers.map(p => p.id));
                if (previousSquadRef.current.size > 0) {
                    const newPlayer = myPlayers.find(p => !previousSquadRef.current.has(p.id));
                    if (newPlayer && newState.fluxData?.state !== 'REVEAL') {
                        setNewSigning(newPlayer);
                    }
                }
                previousSquadRef.current = currentIds;

                // Detect Flux
                if (newState.fluxData?.state === 'REVEAL' && auctionState?.fluxData?.state !== 'REVEAL') {
                    setShowFluxResult(true);
                    setFluxTimer(30);
                }
                if (newState.fluxData?.state === 'IDLE' && showFluxResult) {
                    handleFluxContinue();
                }

                setAuctionState(newState);
                setSquad(myPlayers);
                
                const myTeamInfo = newState.teams.find(t => t.id === parsedTeam.id);
                if(myTeamInfo) {
                    setTeam(prev => ({ ...prev, ...myTeamInfo, auctionName: newState.name }));
                }
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    }, 2000);

    return () => clearInterval(interval);
  }, [router, auctionState, showFluxResult]);

  // 2. Timer
  useEffect(() => {
      if (showFluxResult && fluxTimer > 0) {
          const timer = setInterval(() => setFluxTimer(prev => prev - 1), 1000);
          return () => clearInterval(timer);
      } else if (fluxTimer === 0) {
          handleFluxContinue();
      }
  }, [showFluxResult, fluxTimer]);

  const handleFluxContinue = () => {
      setShowFluxResult(false);
      setLoading(true); 
      setTimeout(() => setLoading(false), 500); 
  };

  const handleLogout = () => { localStorage.removeItem('sporty_team_session'); router.push('/join-auction'); };
  
  const handleUpdateTeam = async (updatedData) => {
    try {
        const res = await fetch('/api/team/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId: team.id, ...updatedData })
        });
        const data = await res.json();
        if (data.success) {
            setTeam(prev => ({ ...prev, ...updatedData }));
            const currentSession = JSON.parse(localStorage.getItem('sporty_team_session') || '{}');
            localStorage.setItem('sporty_team_session', JSON.stringify({ ...currentSession, ...updatedData }));
            triggerToast("Team profile updated!");
            setShowEditModal(false);
        } else {
            triggerToast("Update failed", "error");
        }
    } catch (e) { triggerToast("Network error", "error"); }
  };

  if (loading || !auctionState) return <div className="h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest">Connecting to Server...</div>;

  // --- VIEW 1: FLUX ANIMATING ---
  if (auctionState.fluxData?.state === 'ANIMATING') {
      return (
          <div className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-black animate-pulse"></div>
              <div className="relative z-10 text-center">
                  <div className="w-40 h-40 mx-auto mb-8 rounded-full border-4 border-purple-500/50 flex items-center justify-center animate-[spin_3s_linear_infinite]">
                      <Zap className="w-20 h-20 text-purple-400 animate-bounce" />
                  </div>
                  <h1 className="text-6xl font-bold font-tech text-white uppercase tracking-widest relative z-10 animate-pulse">Miracle Flux</h1>
                  <p className="text-purple-300/60 font-mono mt-4 text-xl tracking-[0.5em] relative z-10">RANDOMIZING ASSETS...</p>
              </div>
          </div>
      );
  }

  // --- VIEW 2: FLUX REVEAL ---
  if (showFluxResult) {
      const myMatch = auctionState.fluxData?.matches?.find(m => m.teamName === team.name);
      const otherMatches = auctionState.fluxData?.matches?.filter(m => m.teamName !== team.name) || [];

      return (
          <div className="h-screen bg-[#050505] p-6 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
                  <h1 className="text-3xl font-tech font-bold text-white uppercase flex items-center gap-3">
                      <Sparkles className="text-yellow-400" /> Flux Results
                  </h1>
                  <button onClick={handleFluxContinue} className="px-6 py-2 bg-white text-black font-bold uppercase text-xs rounded hover:bg-gray-200 flex items-center gap-2">
                      Continue ({fluxTimer}s) <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
              <div className="flex-1 flex gap-8 relative z-10 h-full overflow-hidden">
                  <div className="w-1/3 grid grid-cols-2 gap-4 overflow-y-auto pr-2 content-start pb-10">
                      {otherMatches.map((match) => (
                          <div key={match.playerId} className="relative h-40 bg-white/5 rounded-xl overflow-hidden border border-white/10 opacity-60">
                              <div className="absolute inset-0">{match.playerImage ? <Image src={match.playerImage} fill className="object-cover" alt="p"/> : <div className="w-full h-full flex justify-center items-center"><Users className="w-6 h-6 text-white/20"/></div>}</div>
                              <div className="absolute bottom-0 w-full p-2 bg-black/80 text-center">
                                  <p className="text-[10px] font-bold text-white truncate">{match.playerName}</p>
                                  <p className="text-[8px] uppercase text-white/50">{match.teamName}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="w-2/3 flex items-center justify-center p-8 relative">
                      <div className="absolute inset-0 bg-gradient-to-l from-green-500/20 to-transparent rounded-3xl animate-pulse"></div>
                      {myMatch ? (
                          <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-3xl border-4 border-green-500 shadow-[0_0_100px_rgba(34,197,94,0.4)] overflow-hidden flex flex-col group hover:scale-105 transition-transform duration-500">
                              <div className="absolute top-6 right-6 z-20 bg-green-500 text-black font-bold uppercase px-4 py-1 rounded-full text-xs tracking-widest shadow-lg">New Signing</div>
                              <div className="flex-1 relative">
                                  {myMatch.playerImage ? <Image src={myMatch.playerImage} fill className="object-cover" alt="p"/> : <div className="w-full h-full flex justify-center items-center"><Users className="w-32 h-32 text-white/20"/></div>}
                              </div>
                              <div className="p-8 bg-gradient-to-t from-green-900/90 to-transparent text-center">
                                  <h2 className="text-4xl font-bold font-tech text-white uppercase mb-2">{myMatch.playerName}</h2>
                                  <p className="text-green-300 font-mono text-sm tracking-widest uppercase">Welcome to the Squad</p>
                              </div>
                          </div>
                      ) : (
                          <div className="text-white/30 font-mono text-xl">No player assigned.</div>
                      )}
                  </div>
              </div>
          </div>
      )
  }

  // --- VIEW 3: STANDARD DASHBOARD ---
  const activePlayer = auctionState.activePlayer;
  const currentBidder = auctionState.currentBidder;
  const isPlayerSold = activePlayer?.isSold;
  const isPaused = false; 

  const themeColor = isPlayerSold && activePlayer.teamId 
      ? (auctionState.teams.find(t => t.id === activePlayer.teamId)?.themeColor || '#10B981')
      : (currentBidder ? currentBidder.color : (team?.themeColor || '#333333'));
  
  const bgColor = themeColor;
  const isBiddingOpen = false; 

  return (
    <div className="h-screen text-white flex flex-col transition-colors duration-700 overflow-hidden" style={{ backgroundColor: currentBidder || isPlayerSold ? `${bgColor}22` : '#050505' }}>
      
      {/* Toast & FX */}
      <div className="fixed bottom-6 right-6 z-[120] pointer-events-none">
        {toast && <div className="pointer-events-auto"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div>}
      </div>
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-700" style={{ backgroundColor: themeColor, opacity: 0.15 }}></div>

      {/* --- HEADER (Fixed Height: 5rem / 80px) --- */}
      <header className="h-20 shrink-0 border-b border-white/10 bg-black/80 backdrop-blur-xl z-40" style={{ borderBottomColor: `${team.themeColor}33` }}>
        <div className="max-w-[1920px] mx-auto px-8 h-full flex items-center justify-between relative">
          
          <div className="flex items-center gap-6 z-10 w-1/3">
            <div className="relative w-12 h-12 rounded-full border bg-white/5 flex items-center justify-center overflow-hidden group cursor-pointer shadow-lg hover:ring-2 ring-white/50 transition-all" style={{ borderColor: team.themeColor }} onClick={() => setShowEditModal(true)}>
                {team.logoUrl ? <Image src={team.logoUrl} fill className="object-cover" alt={team.name} /> : <Shield className="w-5 h-5 text-white/20" />}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 className="w-4 h-4 text-white" /></div>
            </div>
            <div>
                <h1 className="text-xl font-bold uppercase tracking-tight leading-none cursor-pointer hover:text-white/80 transition-colors" onClick={() => setShowEditModal(true)}>{team.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: team.themeColor }}></span>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Connected</p>
                </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-1/3">
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-3 h-3" style={{ color: team.themeColor }} />
                    <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">Tournament</span>
                </div>
                <h2 className="text-lg font-tech font-bold text-white uppercase tracking-widest truncate w-full">{auctionState.name}</h2>
            </div>
          </div>

          <div className="flex items-center justify-end gap-8 z-10 w-1/3">
             <div className="text-right">
                <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Purse Balance</div>
                <div className="text-xl font-mono font-bold" style={{ color: team.themeColor }}>₹ {team.purse?.toLocaleString('en-IN')}</div>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <button onClick={() => setShowSquadModal(true)} className="group flex flex-col items-end">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 group-hover:text-white">Squad</div>
                <div className="px-4 py-1 bg-white/10 border border-white/10 rounded-lg text-lg font-tech font-bold text-white group-hover:bg-white group-hover:text-black transition-all">{squad.length}</div>
             </button>
             <button onClick={handleLogout} className="ml-2 p-2 hover:bg-white/10 rounded-full text-white/20 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT (Takes remaining height, never slides under header) --- */}
      <main className="flex-1 h-[calc(100vh-5rem)] overflow-hidden relative z-10 flex flex-col justify-center items-center p-4 lg:p-8">
        
        {auctionState.fluxData?.state === 'IDLE' && !activePlayer && (
             <div className="text-center opacity-50">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/5 animate-pulse" style={{ borderColor: team.themeColor }}>
                    <Zap className="w-8 h-8" style={{ color: team.themeColor }} />
                </div>
                <h2 className="text-3xl font-tech font-bold text-white uppercase tracking-wide">Auction System Offline</h2>
                <p className="text-sm text-white/40 font-clean mt-2">Waiting for Admin...</p>
            </div>
        )}

        {activePlayer && (
            <div className="w-full max-w-6xl grid grid-cols-12 gap-8 lg:gap-12 items-center h-full max-h-[650px]">
                
                {/* LEFT: IMAGE (Card) - Slightly Reduced Size */}
                <div className="col-span-5 h-full relative bg-black/40 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 border-4 transition-colors duration-500 z-20 rounded-[2rem] pointer-events-none" style={{ borderColor: themeColor }}></div>
                    
                    {isPlayerSold && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="flex flex-col items-center gap-4">
                                <div className="border-8 border-green-500 text-green-500 px-8 py-3 text-6xl font-bold uppercase -rotate-12 tracking-widest shadow-2xl">SOLD</div>
                                <div className="bg-white text-black px-6 py-2 font-bold uppercase tracking-widest rounded-full animate-bounce">
                                    To {auctionState.teams.find(t => t.id === activePlayer.teamId)?.name}
                                </div>
                            </div>
                        </div>
                    )}

                    {activePlayer.image ? (
                        <Image src={activePlayer.image} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" alt="p" />
                    ) : (
                        <div className="w-full h-full flex justify-center items-center"><Users className="w-32 h-32 text-white/10"/></div>
                    )}
                    
                    <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                        <h2 className="text-5xl font-bold font-tech uppercase leading-none mb-2 line-clamp-2">{activePlayer.name}</h2>
                        <span className="inline-block px-3 py-1 bg-white/10 rounded text-sm text-white/80 font-mono uppercase tracking-widest backdrop-blur-md">{activePlayer.role}</span>
                    </div>
                </div>

                {/* RIGHT: DETAILS */}
                <div className="col-span-7 flex flex-col justify-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border bg-black/50 backdrop-blur-md transition-colors duration-500" style={{ borderColor: themeColor }}>
                            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
                            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: themeColor }}>
                                {isPlayerSold 
                                    ? `Winner: ${auctionState.teams.find(t => t.id === activePlayer.teamId)?.name}` 
                                    : (currentBidder ? `Leading: ${currentBidder.name}` : 'Bid Waiting')}
                            </span>
                        </div>
                        {isPaused && <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest"><PauseCircle className="w-5 h-5"/> Auction Paused</div>}
                    </div>

                    <div>
                        <p className="text-sm text-white/30 uppercase font-bold tracking-[0.2em] mb-2">{isPlayerSold ? 'Final Sold Price' : 'Current Bid Amount'}</p>
                        <div className="text-8xl font-mono font-bold text-white transition-all duration-300 flex items-start leading-none">
                            <span className="text-4xl mt-4 opacity-50 mr-4">₹</span>
                            {isPlayerSold 
                                ? activePlayer.soldPrice.toLocaleString('en-IN') 
                                : (auctionState.currentBid > 0 ? auctionState.currentBid.toLocaleString('en-IN') : activePlayer.price.toLocaleString('en-IN'))
                            }
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <button 
                            disabled={!isBiddingOpen || isPlayerSold} 
                            onClick={() => triggerToast("Online Bidding is controlled by Admin", "default")}
                            className={`group relative w-full py-6 rounded-2xl overflow-hidden transition-all ${isBiddingOpen && !isPlayerSold ? 'bg-brand hover:bg-brand-glow cursor-pointer' : 'bg-white/5 border border-white/10 cursor-not-allowed opacity-50'}`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-6">
                                <Hand className={`w-8 h-8 ${isBiddingOpen ? 'text-white' : 'text-white/30'}`} />
                                <div className="text-left">
                                    <span className={`block text-xs font-bold uppercase tracking-widest ${isBiddingOpen ? 'text-white/80' : 'text-white/30'}`}>
                                        {isPlayerSold ? 'Auction Closed' : 'Place Bid'}
                                    </span>
                                    <span className={`block text-2xl font-bold uppercase ${isBiddingOpen ? 'text-white' : 'text-white/50'}`}>
                                        {isPlayerSold ? 'Player Sold' : (isBiddingOpen ? 'Submit Offer' : 'Online Bidding Disabled')}
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>

      {/* --- CELEBRATION POPUP (Always On Top) --- */}
      {newSigning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
              <div className="w-full max-w-lg bg-[#0f0f11] border-2 border-yellow-500 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.3)] relative flex flex-col items-center p-10 text-center">
                  
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  <Sparkles className="absolute top-10 left-10 w-10 h-10 text-yellow-400 animate-pulse" />
                  <Sparkles className="absolute bottom-10 right-10 w-8 h-8 text-yellow-400 animate-bounce" />

                  <h2 className="text-4xl font-bold font-tech text-white uppercase tracking-widest mb-2 relative z-10">Welcome to the Squad</h2>
                  <div className="w-20 h-1 bg-yellow-500 rounded-full mb-8 relative z-10"></div>

                  <div className="relative w-48 h-48 rounded-full border-4 border-yellow-500 shadow-2xl mb-6 overflow-hidden">
                      {newSigning.image ? <Image src={newSigning.image} fill className="object-cover" alt="p"/> : <div className="w-full h-full bg-white/10 flex items-center justify-center"><Users className="w-20 h-20 text-white/30"/></div>}
                  </div>

                  <h1 className="text-5xl font-bold text-white uppercase leading-none mb-2">{newSigning.name}</h1>
                  <p className="text-white/50 font-mono tracking-widest uppercase mb-6">{newSigning.role}</p>

                  <div className="bg-white/10 border border-white/10 rounded-xl px-8 py-3 mb-8">
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Acquired For</p>
                      <p className="text-3xl font-mono font-bold text-yellow-400">₹ {newSigning.soldPrice?.toLocaleString('en-IN')}</p>
                  </div>

                  <button 
                      onClick={() => setNewSigning(null)} 
                      className="px-10 py-4 bg-yellow-500 text-black font-bold uppercase tracking-widest rounded-full hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg"
                  >
                      Awesome!
                  </button>
              </div>
          </div>
      )}

      {/* --- MODALS --- */}
      {showSquadModal && <SquadModal squad={squad} onClose={() => setShowSquadModal(false)} totalSpent={squad.reduce((a, b) => a + (b.soldPrice || 0), 0)} />}
      {showEditModal && <EditTeamModal team={team} onClose={() => setShowEditModal(false)} onSave={handleUpdateTeam} />}
    </div>
  );
}

// --- SUB-COMPONENTS (Keep EditTeamModal & SquadModal same as before) ---
function SquadModal({ squad, onClose, totalSpent }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col relative shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <div><h3 className="text-2xl font-tech font-bold text-white uppercase">My Squad</h3><p className="text-xs text-white/40 font-mono mt-1">Total Spent: ₹ {totalSpent.toLocaleString('en-IN')}</p></div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#050505] space-y-3">
                    {squad.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/10 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden relative">{p.image ? <Image src={p.image} fill className="object-cover" alt="p"/> : <Users className="w-5 h-5 m-3.5 text-white/20"/>}</div>
                                <div><h4 className="font-bold text-white text-lg">{p.name}</h4><span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">{p.role}</span></div>
                            </div>
                            <p className="font-mono text-xl font-bold text-green-400">₹ {p.soldPrice?.toLocaleString('en-IN')}</p>
                        </div>
                    ))}
                    {squad.length === 0 && <div className="text-center py-20 text-white/30">No players yet.</div>}
                </div>
            </div>
        </div>
    )
}

function EditTeamModal({ team, onClose, onSave }) {
    const [form, setForm] = useState({ name: team.name, logoUrl: team.logoUrl, themeColor: team.themeColor || '#E62E2E' });
    const colors = Array.from({ length: 30 }, (_, i) => `hsl(${i * 12}, 70%, 50%)`);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) { const reader = new FileReader(); reader.onload = (ev) => setForm(p => ({ ...p, logoUrl: ev.target.result })); reader.readAsDataURL(file); }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 w-full max-w-lg relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3"><Edit3 className="w-5 h-5 text-brand" /> Edit Profile</h3>
                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        <label className="relative w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/30">
                            {form.logoUrl ? <Image src={form.logoUrl} fill className="object-cover" alt="Logo" /> : <Shield className="w-8 h-8 text-white/20" />}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100"><Upload className="w-5 h-5 text-white" /></div>
                            <input type="file" className="hidden" onChange={handleFile} />
                        </label>
                    </div>
                    <div><label className="text-[10px] font-bold text-white/30 uppercase block mb-1">Team Name</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white font-bold" /></div>
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase block mb-2">Theme Color</label>
                        <div className="grid grid-cols-10 gap-2">
                            {colors.map(c => (
                                <button key={c} onClick={() => setForm({...form, themeColor: c})} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${form.themeColor === c ? 'ring-2 ring-white scale-110' : ''}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                    <button onClick={() => onSave(form)} className="w-full py-3.5 bg-white text-black font-bold uppercase rounded-xl hover:bg-gray-200 mt-4 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
                </div>
            </div>
        </div>
    )
}