'use client';
import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Lobby() {
  const [showAuctionModes, setShowAuctionModes] = useState(false);

  // Expanded Sports Data
  const sports = [
    { id: 'cricket', name: 'Cricket', icon: '🏏', status: 'Live', players: '120+' },
    { id: 'football', name: 'Football', icon: '⚽', status: 'Reg Open', players: '80+' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐', status: 'Coming Soon', players: '--' },
    { id: 'esports', name: 'Esports', icon: '🎮', status: 'Coming Soon', players: '--' },
  ];

  return (
    <div className="min-h-screen w-full bg-dark-bg text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-brand/30">
      
      {/* 0. FONTS & GLOBAL STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=Rajdhani:wght@500;600;700;800&display=swap');
        .font-tech { font-family: 'Rajdhani', sans-serif; }
        .font-clean { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* 1. AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-image-gradient"></div>
        {/* Primary Red Glow (Top Right) */}
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-brand/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]"></div>
        {/* Secondary Glow (Bottom Left) */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen"></div>
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* 2. NAVBAR */}
      <header className="sticky top-0 w-full z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 relative drop-shadow-[0_0_15px_rgba(230,46,46,0.5)] transition-transform group-hover:scale-110 duration-300">
                    <Image src="/logo.png" alt="SportY" fill className="object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-tech font-bold text-white leading-none tracking-wide">
                        SPORT<span className="text-brand">Y</span>
                    </span>
                    <span className="text-[10px] font-clean font-semibold text-white/40 tracking-[0.2em] uppercase">
                        College League OS
                    </span>
                </div>
            </div>
            
            {/* Nav Actions */}
            <div className="flex items-center gap-8">
                <nav className="hidden md:flex items-center gap-6">
                    {['Leaderboard', 'Fixtures', 'Teams'].map((item) => (
                        <button key={item} className="text-sm font-tech font-medium text-white/60 hover:text-white hover:text-glow transition-all uppercase tracking-wider">
                            {item}
                        </button>
                    ))}
                </nav>
                <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                <button className="px-8 py-2 cut-corners-sm bg-white text-black font-tech font-bold text-sm uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(230,46,46,0.4)]">
                    Login
                </button>
            </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto p-6 lg:p-10 flex flex-col gap-10 pb-24">
        
        {/* -- ROW 1: DASHBOARD HERO -- */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 min-h-[550px]">
            
            {/* LEFT: AUCTION ENGINE (Takes 8 cols) */}
            <div className="col-span-12 lg:col-span-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] -z-10 cut-corners border border-white/10 group-hover:border-brand/50 transition-colors duration-500"></div>
                
                <div className="h-full flex flex-col justify-between p-10 lg:p-14 relative overflow-hidden rounded-[2rem] cut-corners">
                    {/* Background Tech Effects */}
                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_,i) => (
                                <div key={i} className="w-2 h-12 bg-white/20 skew-x-[-20deg]"></div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,46,46,0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-3 px-3 py-1 bg-brand/10 border border-brand/20 rounded mb-6">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                            </span>
                            <span className="text-xs font-tech font-bold text-brand-glow uppercase tracking-widest">
                                Live Operations
                            </span>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-tech font-bold uppercase text-white leading-[0.85] tracking-tight mb-6">
                            Auction <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-glow text-glow">
                                Command.
                            </span>
                        </h1>
                        
                        <p className="font-clean text-lg text-white/60 max-w-lg leading-relaxed border-l-2 border-brand/30 pl-4">
                            Deploy real-time bidding strategies. Manage franchise purses, player acquisition, and squad balance with zero latency.
                        </p>
                    </div>

                    {/* Action Area */}
                    <div className="relative z-20 mt-12 flex items-center gap-6">
                        <button 
                            onClick={() => setShowAuctionModes(true)}
                            className="group/btn relative px-10 py-4 bg-brand cut-corners-sm overflow-hidden transition-transform active:scale-95"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <span className="text-white font-tech font-bold text-lg uppercase tracking-wide">Enter Console</span>
                                <svg className="w-5 h-5 text-white transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </div>
                        </button>
                        <div className="hidden md:flex flex-col">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Server Status</span>
                            <span className="text-xs font-mono text-green-400">ONLINE :: 34ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: SPLIT CARDS (Takes 4 cols) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
                
                {/* 1. CREATE EVENT CARD */}
                <button className="group relative h-1/4 w-full bg-brand/5 border border-brand/20 hover:border-brand/60 cut-corners p-6 flex flex-col justify-center items-center cursor-pointer overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-brand/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="relative z-10 flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-brand/40 flex items-center justify-center bg-brand/10 group-hover:bg-brand group-hover:text-white transition-colors group-hover:rotate-90 duration-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="text-xl font-tech font-bold text-white uppercase tracking-wider group-hover:text-glow">Initialize Event</h3>
                            <p className="text-[10px] font-mono text-brand/80 uppercase tracking-widest group-hover:text-white/80">New Tournament Setup</p>
                        </div>
                    </div>
                </button>

                {/* 2. ABOUT CPL CARD */}
                <div className="flex-1 bg-dark-surface border border-white/10 cut-corners p-6 relative overflow-hidden flex flex-col group hover:border-brand/30 transition-colors">
                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent -mr-4 -mt-4 rounded-bl-3xl group-hover:from-brand/10 transition-colors"></div>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Incoming Intel</span>
                            </div>
                            <h2 className="text-4xl font-tech font-bold text-white leading-none">CPL <span className="text-brand">2025</span></h2>
                            <p className="text-[10px] font-clean text-white/40 font-bold uppercase tracking-[0.2em] mt-1">Campus Premier League</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-tech font-bold text-brand-glow">JAN 25-26</div>
                            <div className="text-[9px] font-mono text-white/40 uppercase">College Ground</div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1 flex flex-col gap-4 relative z-10">
                        
                        {/* Context Text */}
                        <div className="relative pl-3 border-l-2 border-brand/30">
                            <p className="text-xs text-white/60 leading-relaxed font-clean">
                                The ultimate cricketing showdown. High-octane matches, strategic powerplays, and glory on the main pitch.
                            </p>
                        </div>

                        {/* Stats Matrix */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <div className="bg-white/[0.03] p-3 border border-white/5 group-hover:border-brand/20 transition-colors">
                                <div className="text-[9px] text-white/30 uppercase font-bold tracking-wider">Squadrons</div>
                                <div className="text-2xl font-tech font-bold text-white">08 <span className="text-[10px] text-brand align-middle">TEAMS</span></div>
                            </div>
                            <div className="bg-white/[0.03] p-3 border border-white/5 group-hover:border-brand/20 transition-colors">
                                <div className="text-[9px] text-white/30 uppercase font-bold tracking-wider">Battlefield</div>
                                <div className="text-sm font-bold text-white mt-1 uppercase">Main Ground</div>
                            </div>
                        </div>

                        {/* Captains Details */}
                        <div className="bg-brand/5 p-3 border border-brand/10 group-hover:bg-brand/10 transition-colors">
                            <div className="text-[9px] text-brand/60 uppercase font-bold tracking-widest mb-2 border-b border-brand/10 pb-1">Leadership Config</div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-tech font-bold text-white">04</span>
                                    <span className="text-[9px] text-white/40 uppercase leading-none">3rd Year<br/>Captains</span>
                                </div>
                                <div className="w-px h-6 bg-white/10"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-tech font-bold text-white">04</span>
                                    <span className="text-[9px] text-white/40 uppercase leading-none">2nd Year<br/>Captains</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        {/* -- ROW 2: ACTIVE ARENAS -- */}
        <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
                <h3 className="text-3xl font-tech font-bold text-white uppercase tracking-tight">Active <span className="text-brand">Arenas</span></h3>
                <span className="text-xs font-mono text-brand/80">/// SELECT_MODE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sports.map((sport, i) => (
                    <div key={sport.id} className="relative h-72 group cursor-pointer">
                        {/* Hover Border Glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-brand to-transparent opacity-0 group-hover:opacity-50 blur transition duration-500 cut-corners"></div>
                        
                        {/* Card Body */}
                        <div className="relative h-full bg-[#080808] border border-white/10 cut-corners p-6 flex flex-col justify-between overflow-hidden transition-all group-hover:-translate-y-1">
                            
                            {/* Top Details */}
                            <div className="flex justify-between items-start z-10">
                                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-300 drop-shadow-lg">{sport.icon}</span>
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${sport.status === 'Live' ? 'bg-brand/10 border-brand/30 text-brand-glow' : 'bg-white/5 border-white/10 text-white/30'}`}>
                                    {sport.status}
                                </span>
                            </div>

                            {/* Name & Overlay */}
                            <div className="relative z-10">
                                <h4 className="text-2xl font-tech font-bold text-white group-hover:text-brand transition-colors uppercase">{sport.name}</h4>
                                <div className="h-0.5 w-8 bg-white/20 mt-3 group-hover:w-full group-hover:bg-brand transition-all duration-500"></div>
                                <p className="mt-2 text-xs font-mono text-white/40">{sport.players} Registered</p>
                            </div>

                            {/* Background Number */}
                            <span className="absolute -bottom-4 -right-2 text-8xl font-tech font-bold text-white/[0.03] group-hover:text-white/[0.06] transition-colors pointer-events-none select-none">
                                0{i+1}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* 4. MODAL */}
      {showAuctionModes && (
        <AuctionModal onClose={() => setShowAuctionModes(false)} />
      )}

    </div>
  );
}

// -- COMPONENTS --

function AuctionModal({ onClose }) {
  const [view, setView] = useState('selection');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleJoin = (e) => {
    e.preventDefault();
    console.log(`Joining room with code: ${code}`);
    router.push(`/auction-room?code=${code}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="w-full max-w-5xl bg-[#050505] cut-corners border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden flex flex-col min-h-[600px] animate-in zoom-in-95 duration-300">
        
        {/* Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/10 bg-white/[0.02]">
            <div>
                <h2 className="text-3xl font-tech font-bold text-white uppercase tracking-tight">
                    {view === 'selection' ? 'Select Access Protocol' : 'Security Clearance'}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></span>
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest">System Ready</p>
                </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-brand hover:border-brand text-white/50 hover:text-white transition-all cut-corners-sm">
                ✕
            </button>
        </div>

        {/* Content */}
        {view === 'selection' ? (
             <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-1 p-1 bg-white/5">
                <ModalOption 
                    title="Administrator" 
                    desc="Full System Control"
                    role="ADMIN"
                    icon="⚡"
                    active={false} 
                />
                <div onClick={() => setView('join-room')} className="h-full">
                    <ModalOption 
                        title="Team Owner" 
                        desc="Bidding Access"
                        role="FRANCHISE"
                        icon="🛡️"
                        active={true}
                    />
                </div>
                <ModalOption 
                    title="Spectator" 
                    desc="View Only Mode"
                    role="GUEST"
                    icon="👁️"
                    active={false}
                />
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
                <button onClick={() => setView('selection')} className="absolute top-8 left-8 text-xs font-mono text-white/40 hover:text-brand uppercase flex items-center gap-2 transition-colors">
                    ← Return
                </button>

                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-brand/10 border border-brand/30 flex items-center justify-center text-2xl rounded-full mb-4">
                            🔒
                        </div>
                        <h3 className="text-xl font-tech font-bold text-white uppercase">Authentication Required</h3>
                        <p className="text-sm text-white/40 font-mono mt-2">Enter your unique franchise token</p>
                    </div>

                    <form onSubmit={handleJoin} className="flex flex-col gap-4">
                        <input 
                            type="text" 
                            placeholder="TOKEN-ID" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-4 text-center font-mono text-xl text-brand placeholder:text-white/10 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all cut-corners-sm uppercase tracking-widest"
                            autoFocus
                        />
                        <button type="submit" className="w-full py-4 bg-white text-black font-tech font-bold text-lg uppercase tracking-wider hover:bg-brand hover:text-white transition-all cut-corners-sm shadow-lg shadow-white/5">
                            Authenticate
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

function ModalOption({ title, desc, role, icon, active }) {
    return (
        <div className={`relative h-full bg-dark-bg p-8 flex flex-col items-center justify-center gap-6 group transition-all duration-300 ${active ? 'hover:bg-white/[0.02] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
            <div className={`w-24 h-24 flex items-center justify-center border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent group-hover:scale-110 transition-transform duration-500 ${active ? 'group-hover:border-brand/50' : ''}`}>
                <span className="text-4xl">{icon}</span>
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-tech font-bold text-white mb-1 group-hover:text-brand transition-colors uppercase">{title}</h3>
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest">{desc}</p>
            </div>
            <div className="absolute bottom-6 text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] font-mono group-hover:text-white/20">
                {role}
            </div>
            
            {/* Active Indicator */}
            {active && (
                <div className="absolute inset-0 border border-transparent group-hover:border-brand/20 pointer-events-none transition-colors duration-300"></div>
            )}
        </div>
    )
}