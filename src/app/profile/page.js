'use client';
import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Lobby() {
  const [showAuctionModes, setShowAuctionModes] = useState(false);
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sports = [
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
    { id: 'football', name: 'Football', icon: '⚽' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
    { id: 'esports', name: 'Esports', icon: '🎮' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-x-hidden">
      
      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=Rajdhani:wght@500;600;700;800&display=swap');
        .font-tech { font-family: 'Rajdhani', sans-serif; }
        .font-clean { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay z-0"></div>
      <div className="fixed top-[-50%] left-[20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none blur-[100px] z-0"></div>

      {/* NAVBAR */}
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
              {!user ? (
                <>
                  <Link href="/login">
                    <button className="text-sm font-clean font-medium text-white/60 hover:text-white transition-colors hidden md:block">Log In</button>
                  </Link>
                  <Link href="/register">
                    <button className="px-6 py-2.5 rounded-full bg-white text-black font-clean font-semibold text-sm hover:bg-cyan-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">Sign Up</button>
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 hover:bg-white/5 p-2 pr-4 rounded-full transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-bold text-white leading-none">{user.fullName}</p>
                      <p className="text-[10px] text-cyan-400 font-mono tracking-wider mt-1">{user.playerRole || 'USER'}</p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-14 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <Link href="/profile">
                        <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 hover:text-cyan-400 transition-colors flex items-center gap-2">
                          <span>👤</span> My Stats
                        </button>
                      </Link>
                      <div className="h-px bg-white/5 my-1"></div>
                      <button 
                        onClick={logout} 
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <span>🚪</span> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
      </header>

      {/* REST OF YOUR HOME PAGE CONTENT (Copy the Main Content from previous turn here) */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto p-6 lg:p-10 flex flex-col gap-8 pb-20">
         <div className="grid grid-cols-12 gap-6 lg:gap-8">
            <div className="col-span-12 lg:col-span-8 relative group min-h-[500px] rounded-[2.5rem] bg-[#0a0a0a] border border-white/[0.08] overflow-hidden flex flex-col justify-between p-10 lg:p-16 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <div className="absolute top-[-10%] right-[-5%] text-[20rem] lg:text-[24rem] font-tech font-bold text-white/[0.02] leading-none select-none pointer-events-none group-hover:text-cyan-500/[0.04] transition-colors duration-700">01</div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative z-10 pointer-events-none">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8 shadow-inner">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
                        <span className="text-[11px] font-clean font-bold text-white/90 uppercase tracking-widest">System Active</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-clean font-bold tracking-tighter text-white mb-6 leading-[0.9]">Auction <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-600">Command.</span></h1>
                    <p className="font-clean text-lg lg:text-xl text-white/50 max-w-xl leading-relaxed">The Season 3 bidding infrastructure is initialized. Manage teams, purses, and real-time player acquisition with zero latency.</p>
                </div>
                <div className="relative z-20 mt-12">
                    <button onClick={() => setShowAuctionModes(true)} className="group/btn flex items-center gap-5 pl-8 pr-2 py-2 bg-white rounded-full w-fit hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer">
                        <span className="text-black font-clean font-bold text-sm uppercase tracking-wide">Launch Console</span>
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white group-hover/btn:rotate-45 transition-transform duration-300 border border-white/20"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
                    </button>
                </div>
            </div>
            <div className="col-span-12 lg:col-span-4 relative rounded-[2.5rem] bg-[#0a0a0a] border border-white/[0.08] flex flex-col overflow-hidden min-h-[500px]">
                <div className="p-8 md:p-10 border-b border-white/[0.05] relative z-10">
                    <h2 className="text-3xl font-clean font-bold text-white mb-1">Season 03</h2>
                    <p className="text-sm font-clean text-cyan-400 font-bold uppercase tracking-widest">Campus Premier League</p>
                </div>
                <div className="flex-1 grid grid-cols-2 divide-x divide-white/[0.05]">
                    <div className="flex flex-col divide-y divide-white/[0.05]">
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors"><div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">08</div><div className="text-xs text-white/40 uppercase tracking-widest font-bold">Franchises</div></div>
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors"><div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">60<span className="text-2xl align-top">+</span></div><div className="text-xs text-white/40 uppercase tracking-widest font-bold">Players</div></div>
                    </div>
                    <div className="flex flex-col divide-y divide-white/[0.05]">
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors"><div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">08</div><div className="text-xs text-white/40 uppercase tracking-widest font-bold">Captains</div></div>
                        <div className="flex-1 p-8 flex flex-col justify-center group hover:bg-white/[0.02] transition-colors"><div className="text-5xl font-tech font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">01</div><div className="text-xs text-white/40 uppercase tracking-widest font-bold">Trophy</div></div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* YOUR EXISTING AUCTION MODAL COMPONENT GOES HERE */}
    </div>
  );
}