'use client';
import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Lobby() {
  const [showAuctionModes, setShowAuctionModes] = useState(false);

  // Sports list with Volleyball
  const sports = [
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
    { id: 'football', name: 'Football', icon: '⚽' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
    { id: 'esports', name: 'Esports', icon: '🎮' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-x-hidden">
      
      {/* 0. GLOBAL STYLES & FONTS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=Rajdhani:wght@500;600;700;800&display=swap');
        .font-tech { font-family: 'Rajdhani', sans-serif; }
        .font-clean { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* 1. CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay z-0"></div>
      <div className="fixed top-[-50%] left-[20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none blur-[100px] z-0"></div>

      {/* 2. NAVBAR */}
      <header className="sticky top-0 w-full px-6 lg:px-10 py-5 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05] transition-all">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                <Image src="/logo.png" alt="SportY" fill className="object-contain" />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-xl font-clean font-bold tracking-tight text-white leading-none">SportY</span>
                <span className="text-[10px] font-clean font-medium text-white/40 tracking-[0.2em] uppercase mt-1">Enterprise Console</span>
            </div>
            </div>
            
            <div className="flex items-center gap-6">
                <button className="text-sm font-clean font-medium text-white/60 hover:text-white transition-colors hidden md:block">Log In</button>
                <button className="px-6 py-2.5 rounded-full bg-white text-black font-clean font-semibold text-sm hover:bg-cyan-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">Sign Up</button>
            </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto p-6 lg:p-10 flex flex-col gap-8 pb-20">
        
        {/* -- ROW 1: HERO DASHBOARD -- */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
            
            {/* HERO CARD: AUCTION ENGINE */}
            <div className="col-span-12 lg:col-span-8 relative group min-h-[500px] rounded-[2.5rem] bg-[#0a0a0a] border border-white/[0.08] overflow-hidden flex flex-col justify-between p-10 lg:p-16 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                
                {/* Background Typography */}
                <div className="absolute top-[-10%] right-[-5%] text-[20rem] lg:text-[24rem] font-tech font-bold text-white/[0.02] leading-none select-none pointer-events-none group-hover:text-cyan-500/[0.04] transition-colors duration-700">
                    01
                </div>
                
                {/* Background Gradient Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                {/* Top Content */}
                <div className="relative z-10 pointer-events-none">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8 shadow-inner">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-[11px] font-clean font-bold text-white/90 uppercase tracking-widest">System Active</span>
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-clean font-bold tracking-tighter text-white mb-6 leading-[0.9]">
                        Auction <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-600">Command.</span>
                    </h1>
                    
                    <p className="font-clean text-lg lg:text-xl text-white/50 max-w-xl leading-relaxed">
                        The Season 3 bidding infrastructure is initialized. Manage teams, purses, and real-time player acquisition with zero latency.
                    </p>
                </div>

                {/* Action Button */}
                <div className="relative z-20 mt-12">
                    <button 
                    onClick={() => setShowAuctionModes(true)}
                    className="group/btn flex items-center gap-5 pl-8 pr-2 py-2 bg-white rounded-full w-fit hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer"
                    >
                        <span className="text-black font-clean font-bold text-sm uppercase tracking-wide">Launch Console</span>
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white group-hover/btn:rotate-45 transition-transform duration-300 border border-white/20">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </button>
                </div>
            </div>

            {/* SIDE CARD: CPL STATS */}
            <div className="col-span-12 lg:col-span-4 relative rounded-[2.5rem] bg-[#0a0a0a] border border-white/[0.08] flex flex-col overflow-hidden min-h-[500px]">
                
                {/* Header Section */}
                <div className="p-8 md:p-10 border-b border-white/[0.05] relative z-10">
                    <h2 className="text-3xl font-clean font-bold text-white mb-1">Season 03</h2>
                    <p className="text-sm font-clean text-cyan-400 font-bold uppercase tracking-widest">Campus Premier League</p>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-2 divide-x divide-white/[0.05]">
                    
                    {/* Left Column */}
                    <div className="flex flex-col divide-y divide-white/[0.05]">
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors">
                            <div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">08</div>
                            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Franchises</div>
                            <div className="text-[10px] text-white/20 mt-1">Confirmed</div>
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors">
                            <div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">60<span className="text-2xl align-top">+</span></div>
                            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Players</div>
                            <div className="text-[10px] text-white/20 mt-1">Pool Size</div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col divide-y divide-white/[0.05]">
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors">
                            <div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">08</div>
                            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Captains</div>
                            <div className="text-[10px] text-white/20 mt-1">Locked In</div>
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors">
                            <div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">01</div>
                            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Trophy</div>
                            <div className="text-[10px] text-white/20 mt-1">Ultimate Prize</div>
                        </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="p-6 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between">
                     <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Registration Phase</span>
                     <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Transitioning</span>
                     </div>
                </div>
            </div>

        </div>

        {/* -- ROW 2: FUTURE ARENAS -- */}
        <div className="flex items-center gap-6 mt-8">
            <h3 className="text-2xl font-clean font-bold text-white tracking-tight">Future Arenas</h3>
            <div className="h-px flex-1 bg-white/[0.08]"></div>
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">Phase 2 Unlocking Soon</span>
        </div>

        {/* -- ROW 3: SPORTS GRID -- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport, i) => (
                <div key={sport.id} className="relative group h-64 rounded-[2rem] bg-[#080808] border border-white/[0.05] flex flex-col items-center justify-center overflow-hidden hover:bg-[#0c0c0c] transition-all duration-300 cursor-default hover:border-white/10">
                    <span className="absolute top-6 left-6 text-xs font-mono text-white/20 font-bold">0{i + 2}</span>
                    <div className="text-5xl grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-out transform drop-shadow-2xl">
                        {sport.icon}
                    </div>
                    <div className="absolute bottom-8 flex flex-col items-center gap-2">
                        <span className="text-sm font-clean font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{sport.name}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] bg-white/5 border border-white/5 text-white/30 group-hover:text-cyan-400 transition-colors uppercase font-bold">Coming Soon</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
            ))}
        </div>

      </main>

      {/* 4. MODAL */}
      {showAuctionModes && (
        <AuctionModal onClose={() => setShowAuctionModes(false)} />
      )}

    </div>
  );
}

// -- MODAL COMPONENT --

function AuctionModal({ onClose }) {
  const [view, setView] = useState('selection'); // 'selection' | 'join-room'
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleJoin = (e) => {
    e.preventDefault();
    // Simulate navigation to the auction room
    console.log(`Joining room with code: ${code}`);
    router.push(`/auction-room?code=${code}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 md:p-8 animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-6xl bg-[#050505] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-8 md:p-10 border-b border-white/5 bg-[#050505]/50 sticky top-0 z-20 backdrop-blur-md">
            <div>
                {view === 'selection' ? (
                   <>
                    <h2 className="text-3xl md:text-4xl font-clean font-bold text-white tracking-tight">Select Interface</h2>
                    <p className="text-white/40 mt-2 text-sm">Choose your access level to enter the ecosystem.</p>
                   </>
                ) : (
                   <>
                    <button onClick={() => setView('selection')} className="flex items-center gap-2 text-white/50 hover:text-white mb-2 transition-colors">
                        <span>←</span> Back to Selection
                    </button>
                    <h2 className="text-3xl font-clean font-bold text-white tracking-tight">Enter Access Code</h2>
                   </>
                )}
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/5 cursor-pointer z-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Modal Body */}
        {view === 'selection' ? (
             <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* 1. Admin */}
                <ModalCard 
                    title="Administrator" 
                    subtitle="Create & Manage" 
                    icon={(
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    )}
                    image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                />
                
                {/* 2. Team Owner (Clickable) */}
                <div onClick={() => setView('join-room')} className="cursor-pointer h-full">
                    <ModalCard 
                        title="Team Owner" 
                        subtitle="Join Bidding Room" 
                        icon={(
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        )}
                        image="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                    />
                </div>

                {/* 3. Spectator */}
                <ModalCard 
                    title="Spectator" 
                    subtitle="Public Display" 
                    icon={(
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                    image="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
                />
            </div>
        ) : (
            // VIEW: JOIN ROOM INPUT
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
                <div className="w-full max-w-md">
                    <form onSubmit={handleJoin} className="flex flex-col gap-6">
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-white/50 uppercase tracking-widest pl-1">Access Token</label>
                             <input 
                                type="text" 
                                placeholder="CPL-XXXX-XXXX" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-lg text-center tracking-widest"
                                autoFocus
                             />
                        </div>
                        
                        <button type="submit" className="w-full py-4 bg-white hover:bg-cyan-50 text-black font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] flex items-center justify-center gap-3 group">
                            Authenticate & Join
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>

                        <div className="text-center">
                            <p className="text-[10px] text-white/30">Restricted Area. Authorized personnel only.</p>
                        </div>
                    </form>
                </div>
            </div>
        )}
        
        {/* Footer Info */}
        <div className="p-5 bg-[#080808] border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 uppercase tracking-widest font-mono">
            <span>Secure TLS 1.3 Connection</span>
            <span>v3.4.0 (Stable)</span>
        </div>

      </div>
    </div>
  );
}

function ModalCard({ title, subtitle, icon, image }) {
    return (
        <div className="relative group min-h-[300px] md:h-full w-full flex flex-col items-center justify-center overflow-hidden transition-all">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={image} 
                    alt={title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-cyan-900/20 transition-colors duration-500"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-2xl group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-black transition-colors duration-300">
                    {icon}
                </div>
                <div>
                    <h3 className="text-3xl font-clean font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm font-clean text-white/50 group-hover:text-cyan-200 transition-colors uppercase tracking-widest font-bold">{subtitle}</p>
                </div>
            </div>

            {/* Bottom Bar Hover */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
        </div>
    )
}