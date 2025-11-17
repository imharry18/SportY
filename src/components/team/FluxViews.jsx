'use client';
import Image from 'next/image';
import { Zap, Users, Sparkles, Grid, ArrowRight } from 'lucide-react';

// --- VIEW 1: THE 10-SECOND COUNTDOWN ANIMATION ---
export function FluxAnimating({ timeLeft }) {
    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black animate-pulse"></div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute w-1 h-1 bg-purple-500 rounded-full animate-pulse" 
                         style={{ 
                             left: `${Math.random() * 100}%`, 
                             top: `${Math.random() * 100}%`,
                             opacity: Math.random() * 0.5 + 0.3,
                             animationDuration: `${2 + Math.random() * 3}s`
                         }}>
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Spinner */}
                <div className="w-40 h-40 relative flex items-center justify-center mb-10">
                    <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-4 border-4 border-dashed border-purple-400/50 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full animate-pulse"></div>
                    <Zap className="w-16 h-16 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                </div>
                
                <h1 className="text-7xl font-tech font-bold text-white mb-4 tracking-tighter drop-shadow-2xl">
                    FLUX <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">DIVIDE</span>
                </h1>
                
                <div className="flex items-center gap-4 bg-black/50 px-6 py-2 rounded-full border border-purple-500/30 backdrop-blur-md">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                    <p className="font-mono text-purple-200 tracking-[0.3em] text-xs uppercase font-bold">
                        Randomizing • {timeLeft}s Remaining
                    </p>
                </div>
            </div>
        </div>
    );
}

// --- VIEW 2: THE SPLIT RESULT SCREEN ---
export function FluxResult({ auctionState, team, onContinue }) {
    const myMatch = auctionState.fluxData?.matches?.find(m => m.teamName === team.name);
    const otherMatches = auctionState.fluxData?.matches?.filter(m => m.teamName !== team.name) || [];

    return (
        <div className="h-screen bg-[#050505] flex flex-col relative overflow-hidden">
            
            {/* Background Ambient Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Header */}
            <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-xl z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-tech font-bold text-white uppercase tracking-widest leading-none">Flux Results</h2>
                        <p className="text-[10px] text-white/40 font-mono mt-1">DISTRIBUTION COMPLETE</p>
                    </div>
                </div>
                <button 
                    onClick={onContinue} 
                    className="group flex items-center gap-3 px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-purple-500 hover:text-white transition-all shadow-lg hover:shadow-purple-500/25"
                >
                    Return to Auction <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 lg:p-10 gap-8 overflow-hidden z-10">
                
                {/* --- LEFT: MY CARD (Dominant) --- */}
                <div className="lg:col-span-5 flex flex-col justify-center h-full">
                    <div className="relative w-full h-full max-h-[700px] bg-[#0f0f11] border border-purple-500/30 rounded-[2.5rem] p-1 flex flex-col items-center text-center shadow-[0_0_60px_rgba(168,85,247,0.15)] overflow-hidden group">
                        
                        {/* Glow Beam Animation inside card */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50"></div>

                        <div className="relative z-10 w-full h-full bg-[#0a0a0a]/50 rounded-[2.3rem] p-8 flex flex-col items-center justify-center backdrop-blur-sm">
                            {myMatch ? (
                                <>
                                    <div className="mb-8 animate-in slide-in-from-top-4 duration-700">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                            <Sparkles className="w-3 h-3" /> Your Allocation
                                        </div>
                                    </div>

                                    <div className="relative w-56 h-56 mb-8 group-hover:scale-105 transition-transform duration-700">
                                        <div className="absolute inset-0 bg-purple-600 rounded-full blur-[60px] opacity-30 animate-pulse"></div>
                                        <div className="relative w-full h-full rounded-full border-[3px] border-purple-500/30 overflow-hidden shadow-2xl bg-black">
                                            {myMatch.playerImage ? (
                                                <Image src={myMatch.playerImage} fill className="object-cover" alt="p" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center"><Users className="w-24 h-24 text-white/10"/></div>
                                            )}
                                        </div>
                                        {/* Badge */}
                                        <div className="absolute bottom-2 right-2 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center border-4 border-[#0f0f11] shadow-xl">
                                            <span className="font-tech font-bold text-xl text-white">1</span>
                                        </div>
                                    </div>

                                    <h1 className="text-5xl lg:text-6xl font-tech font-bold text-white uppercase leading-[0.9] mb-4 drop-shadow-lg animate-in zoom-in-95 duration-700 delay-100">
                                        {myMatch.playerName}
                                    </h1>
                                    <p className="text-white/40 font-mono uppercase tracking-widest text-sm animate-in fade-in duration-700 delay-200">
                                        Successfully added to squad
                                    </p>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                        <Users className="w-10 h-10 text-white/20" />
                                    </div>
                                    <h3 className="text-3xl font-tech font-bold text-white uppercase tracking-wide">No Assignment</h3>
                                    <p className="text-sm text-white/40 font-mono mt-2">You did not receive a player in this round.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: GRID (Other Teams) --- */}
                <div className="lg:col-span-7 bg-[#0f0f11] border border-white/10 rounded-[2rem] p-8 overflow-hidden flex flex-col h-full max-h-[700px]">
                    <div className="flex items-center justify-between mb-6 px-1 border-b border-white/5 pb-4">
                        <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                            <Grid className="w-4 h-4 text-white/40" /> League Distribution
                        </h3>
                        <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded">{otherMatches.length} TRANSFERS</span>
                    </div>

                    {/* Scrollable Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 gap-4 custom-scrollbar content-start">
                        {otherMatches.map((match, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center gap-3 hover:bg-white/[0.05] hover:border-white/10 transition-all group cursor-default">
                                <div className="w-16 h-16 rounded-full bg-black border border-white/10 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg">
                                    {match.playerImage ? (
                                        <Image src={match.playerImage} fill className="object-cover" alt="p"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Users className="w-6 h-6 text-white/20"/></div>
                                    )}
                                </div>
                                <div className="w-full">
                                    <div className="font-bold text-white text-xs truncate w-full px-1 mb-1.5">{match.playerName}</div>
                                    <div className="text-[9px] font-mono text-black font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-sm inline-block truncate max-w-full">
                                        {match.teamName}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}