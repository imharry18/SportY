'use client';
import Link from 'next/link';
import { Flame, Gavel, Users, Zap, Trophy, ArrowRight, Timer } from 'lucide-react';

export default function CPLPromo() {
  return (
    <section className="relative min-h-[90vh] flex items-center py-20 px-6 bg-[#030303] overflow-hidden border-t border-white/5">
      
      {/* --- PREMIUM EVENT BACKGROUND FX --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main Golden Glow */}
        <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-amber-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]"></div>
        {/* Secondary Orange Glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-orange-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
        {/* Hex/Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10 w-full">
        
        {/* --- LEFT: HYPE CONTENT (5 Cols) --- */}
        <div className="lg:col-span-5 flex flex-col gap-10 order-2 lg:order-1">
            
            {/* Live Badge */}
            <div className="w-fit flex items-center gap-3 px-4 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.1)] group cursor-default">
                <div className="relative">
                    <span className="absolute inset-0 bg-amber-500 blur-sm opacity-50 animate-ping"></span>
                    <Flame className="w-4 h-4 text-amber-500 relative z-10" />
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest group-hover:text-amber-200 transition-colors">Season 3 • Official</span>
            </div>

            {/* Headline */}
            <div>
                <h2 className="text-6xl md:text-8xl font-tech font-bold text-white uppercase leading-[0.85] tracking-tight mb-6 drop-shadow-2xl">
                    Campus <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 animate-gradient-x">Premier League</span>
                </h2>
                <div className="flex items-center gap-4">
                    <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>
            </div>

            {/* Context Stats */}
            <div className="grid grid-cols-3 gap-6 border-y border-white/5 py-6">
                <div>
                    <div className="text-2xl font-tech font-bold text-white">₹ 50Cr</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Total Purse</div>
                </div>
                <div>
                    <div className="text-2xl font-tech font-bold text-white">08</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Franchises</div>
                </div>
                <div>
                    <div className="text-2xl font-tech font-bold text-white">T-10</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Format</div>
                </div>
            </div>

            {/* Description */}
            <p className="text-white/60 text-lg font-clean leading-relaxed">
                The arena is set. The gavel is ready. Dive into the most electrifying student auction event where strategy determines the champion before the first ball is bowled.
            </p>

            {/* CTA Button - Updated Text */}
            <Link href="/cpl"> 
                <button className="group relative w-full sm:w-auto px-10 py-5 bg-[#0a0a0a] border border-amber-500/30 text-white cut-corners-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                    {/* Hover Fill */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    
                    <div className="relative z-10 flex items-center justify-center gap-4">
                        <Trophy className="w-6 h-6 text-amber-500 group-hover:text-white transition-colors" />
                        <span className="font-tech font-bold text-2xl uppercase tracking-widest group-hover:text-white transition-colors">Let's Go</span>
                        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                </button>
            </Link>

        </div>

        {/* --- RIGHT: FEATURE CARDS (7 Cols) --- */}
        <div className="lg:col-span-7 order-1 lg:order-2 perspective-1000">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 transform lg:rotate-y-12 lg:group-hover:rotate-y-0 transition-transform duration-1000 ease-out">
                
                {/* Card 1: Bidding */}
                <div className="bg-[#080808] border border-white/10 p-8 rounded-3xl group hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Gavel className="w-24 h-24 text-amber-500 rotate-12" /></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform">
                        <Gavel className="w-7 h-7 text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase font-tech mb-2 group-hover:text-amber-400 transition-colors">Live Bidding</h3>
                    <p className="text-sm text-white/40 font-clean leading-relaxed border-l-2 border-white/10 pl-3 group-hover:border-amber-500/50 transition-colors">
                        Real-time socket infrastructure. Experience zero-latency bidding wars.
                    </p>
                </div>

                {/* Card 2: Flux */}
                <div className="bg-[#080808] border border-white/10 p-8 rounded-3xl group hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 relative overflow-hidden shadow-2xl sm:translate-y-8">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="w-24 h-24 text-purple-500 -rotate-12" /></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                        <Zap className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase font-tech mb-2 group-hover:text-purple-400 transition-colors">Flux Divide</h3>
                    <p className="text-sm text-white/40 font-clean leading-relaxed border-l-2 border-white/10 pl-3 group-hover:border-purple-500/50 transition-colors">
                        The chaos round. Random player allocation to test franchise adaptability.
                    </p>
                </div>

                {/* Card 3: Rapid Fire */}
                <div className="bg-[#080808] border border-white/10 p-8 rounded-3xl group hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Timer className="w-24 h-24 text-red-500 rotate-12" /></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 transition-transform">
                        <Timer className="w-7 h-7 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase font-tech mb-2 group-hover:text-red-400 transition-colors">Rapid Fire</h3>
                    <p className="text-sm text-white/40 font-clean leading-relaxed border-l-2 border-white/10 pl-3 group-hover:border-red-500/50 transition-colors">
                        High-stakes speed rounds. 30 seconds to decide your squad's fate.
                    </p>
                </div>

                {/* Card 4: Stats */}
                <div className="bg-[#080808] border border-white/10 p-8 rounded-3xl group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 relative overflow-hidden shadow-2xl sm:translate-y-8">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-24 h-24 text-emerald-500 -rotate-12" /></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <Users className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase font-tech mb-2 group-hover:text-emerald-400 transition-colors">Live Analytics</h3>
                    <p className="text-sm text-white/40 font-clean leading-relaxed border-l-2 border-white/10 pl-3 group-hover:border-emerald-500/50 transition-colors">
                        Dynamic purse tracking and squad balance indicators in real-time.
                    </p>
                </div>

            </div>
        </div>

      </div>
    </section>
  );
}