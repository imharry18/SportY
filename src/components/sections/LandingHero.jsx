'use client';
import { ArrowDown, Zap, ChevronRight } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] mask-image-gradient animate-[pulse_10s_infinite]"></div>
        
        {/* Dynamic Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-brand/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[6000ms]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/5 blur-[150px] rounded-full mix-blend-screen"></div>
        
        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-8">
        
        {/* Top Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_0_20px_rgba(230,46,46,0.15)] hover:border-brand/30 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
                <span className="text-xs font-mono text-brand-glow uppercase tracking-widest font-bold">System Online v3.0</span>
            </div>
        </div>

        {/* Main Title */}
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000 delay-100">
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-tech font-bold uppercase tracking-tighter leading-[0.8] text-white drop-shadow-2xl select-none">
              The Ultimate
            </h1>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-tech font-bold uppercase tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-brand via-red-500 to-brand/20 select-none pb-4">
              League OS
            </h1>
        </div>

        {/* Description */}
        <p className="font-clean text-lg md:text-2xl text-white/50 max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          The complete operating system for professional sports management. <br className="hidden md:block" />
          <span className="text-white font-semibold">Initialize</span> tournaments, <span className="text-white font-semibold">Auction</span> players, and <span className="text-white font-semibold">Dominate</span> the season.
        </p>

        {/* Primary CTA Button */}
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <button className="group relative px-10 py-5 bg-white text-black cut-corners-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(230,46,46,0.5)]">
                <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <div className="relative z-10 flex items-center gap-3">
                    <span className="font-tech font-bold text-2xl uppercase tracking-widest group-hover:text-white transition-colors">Organize Event</span>
                    <Zap className="w-6 h-6 group-hover:text-white group-hover:fill-current transition-colors" />
                </div>
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-white/20 text-xs font-mono uppercase tracking-widest">
                <span>Free Tier Available</span>
                <span>•</span>
                <span>No Credit Card</span>
            </div>
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <span className="text-[10px] font-mono text-white uppercase tracking-widest">Scroll to Explore</span>
        <ArrowDown className="w-5 h-5 text-brand" />
      </div>

    </section>
  );
}