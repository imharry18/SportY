'use client';
import Link from 'next/link';
import { Gavel, Wallet, Zap, Server, Users, ShieldCheck, PlusCircle } from 'lucide-react';

export default function AuctionShowcase() {
  return (
    <section className="relative min-h-[90vh] flex items-center py-24 px-6 bg-[#020202] border-t border-white/5 overflow-hidden">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] animate-pulse pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* --- LEFT: TEXT & EXPLANATION --- */}
        <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 gap-8">
            
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-0.5 bg-gradient-to-r from-brand to-transparent"></span>
                    <span className="text-brand font-mono text-xs uppercase tracking-[0.3em]">Module: Auctioneer</span>
                </div>
                
                <h2 className="text-6xl md:text-7xl font-tech font-bold text-white uppercase leading-[0.9]">
                    Let's Create <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">The Auction.</span>
                </h2>
                
                <p className="text-white/50 text-lg font-clean leading-relaxed border-l-2 border-brand/30 pl-6">
                    A professional-grade bidding environment designed for high-stakes decision making. <br/><br/>
                    Initialize the lobby, invite franchise owners, and conduct a seamless auction with automated purse calculations, rapid-fire rounds, and real-time squad validation.
                </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {/* 1. Join Auction Button */}
                <Link href="/join-auction" className="group flex-1 sm:flex-none">
                    <button className="w-full sm:w-auto relative px-8 py-4 bg-white text-black cut-corners-sm overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(230,46,46,0.4)]">
                        <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            <Users className="w-5 h-5 group-hover:text-white transition-colors" />
                            <span className="font-tech font-bold text-lg uppercase tracking-widest group-hover:text-white transition-colors">Join Auction</span>
                        </div>
                    </button>
                </Link>

                {/* 2. Create Auction Button */}
                <Link href="/create-auction" className="group flex-1 sm:flex-none">
                    <button className="w-full sm:w-auto relative px-8 py-4 bg-transparent border border-white/20 text-white cut-corners-sm overflow-hidden transition-transform hover:scale-105 active:scale-95 hover:bg-white/5 hover:border-brand/50">
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            <PlusCircle className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
                            <span className="font-tech font-bold text-lg uppercase tracking-widest group-hover:text-brand-glow transition-colors">Create Auction</span>
                        </div>
                    </button>
                </Link>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-2 gap-6 mt-6 border-t border-white/10 pt-8">
                {[
                    { icon: Wallet, label: "Purse Logic", desc: "Auto-Calculated" },
                    { icon: Zap, label: "Real-Time", desc: "12ms Latency" },
                    { icon: Users, label: "Team Slots", desc: "Dynamic Filling" },
                    { icon: ShieldCheck, label: "Validation", desc: "Roster Rules" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-white/5 rounded border border-white/10 text-brand">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white uppercase tracking-wide">{item.label}</div>
                            <div className="text-[10px] font-mono text-white/40 uppercase">{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- RIGHT: SYSTEM STATUS CONSOLE (No Prices) --- */}
        <div className="lg:col-span-7 relative order-1 lg:order-2 h-[600px] flex items-center justify-center perspective-1000">
            
            {/* 1. Base Plate */}
            <div className="absolute inset-0 bg-[#050505] border border-white/10 rounded-[3rem] cut-corners -z-10 bg-grid-pattern opacity-20 transform rotate-y-6 scale-95"></div>
            
            {/* 2. The Main Console */}
            <div className="relative w-full max-w-lg bg-[#080808]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-10 shadow-2xl">
                
                {/* Status Ring */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 border border-brand/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-dashed border-brand/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    
                    {/* Glowing Center */}
                    <div className="absolute inset-0 bg-brand/5 blur-[50px] rounded-full"></div>
                    
                    {/* Center Icon */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <Server className="w-16 h-16 text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                        <span className="text-brand font-mono text-xs uppercase tracking-[0.2em] animate-pulse">System Ready</span>
                    </div>

                    {/* Orbiting Nodes (Teams) */}
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="absolute w-3 h-3 bg-[#080808] border border-white/40 rounded-full" 
                             style={{ 
                                 top: '50%', 
                                 left: '50%', 
                                 transform: `rotate(${i * 90}deg) translate(120px) rotate(-${i * 90}deg)` 
                             }}>
                             <div className="w-1 h-1 bg-green-500 rounded-full m-0.5 animate-ping"></div>
                        </div>
                    ))}
                </div>

                {/* Info Display */}
                <div className="w-full grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                        <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Teams Connected</div>
                        <div className="text-2xl font-tech font-bold text-white">08 <span className="text-sm text-white/40 font-thin">/ 08</span></div>
                    </div>
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                        <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Player Pool</div>
                        <div className="text-2xl font-tech font-bold text-white">142 <span className="text-sm text-white/40 font-thin">Active</span></div>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="w-full flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-mono text-brand uppercase tracking-widest">Auction_Room_01</span>
                    </div>
                    <div className="text-[10px] font-mono text-white/20 uppercase">v3.4.0_Stable</div>
                </div>

            </div>

            {/* Floating Decoration Elements */}
            <div className="absolute top-20 left-10 p-4 bg-black/80 backdrop-blur border border-white/10 rounded-lg shadow-xl animate-bounce duration-[3000ms]">
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Lobby Status</div>
                <div className="text-green-400 font-mono text-xs">● Open for Joins</div>
            </div>

        </div>

      </div>
    </section>
  );
}