'use client';
import { Plus, Zap, Trophy, Shield, Users } from 'lucide-react';

export default function HeroSection({ onOpenConsole }) {
  return (
    <section className="grid grid-cols-12 gap-6 lg:gap-8 min-h-[600px]">
      
      {/* --- LEFT COLUMN: AUCTION ENGINE (8 cols) --- */}
      <div className="col-span-12 lg:col-span-8 relative group">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-brand/5 rounded-[2.5rem] -z-10 cut-corners border border-white/10 group-hover:border-brand/50 transition-colors duration-500"></div>
        
        <div className="h-full flex flex-col justify-between p-10 lg:p-14 relative overflow-hidden rounded-[2.5rem] cut-corners glass-panel">
          {/* Background FX */}
          <div className="absolute top-0 right-0 p-10 opacity-30 pointer-events-none">
            <div className="flex gap-2">
              {[...Array(3)].map((_,i) => <div key={i} className="w-1.5 h-16 bg-brand/40 skew-x-[-20deg]"></div>)}
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,46,46,0.1),transparent_60%)] pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="text-xs font-tech font-bold text-brand-glow uppercase tracking-widest">System Active</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-tech font-bold uppercase text-white leading-[0.85] tracking-tight mb-8">
              Auction <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-glow text-glow">Command.</span>
            </h1>
            
            <p className="font-clean text-lg text-white/60 max-w-xl leading-relaxed border-l-2 border-brand/30 pl-6">
              Deploy real-time bidding strategies. Manage franchise purses, player acquisition, and squad balance with zero latency infrastructure.
            </p>
          </div>

          {/* Action Footer */}
          <div className="relative z-20 mt-12 flex items-center gap-8">
            <button onClick={onOpenConsole} className="group/btn relative px-10 py-4 bg-brand cut-corners-sm overflow-hidden transition-transform active:scale-95 shadow-[0_0_30px_rgba(230,46,46,0.3)]">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-white font-tech font-bold text-xl uppercase tracking-wide">Enter Console</span>
                <Zap className="w-5 h-5 text-white fill-current transform group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Latency</span>
              <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> 34ms (Stable)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: MODULES (4 cols) --- */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
        
        {/* 1. Create Event Card */}
        <button className="group relative h-1/3 w-full bg-dark-surface/50 border border-white/10 hover:border-brand/60 cut-corners p-8 flex flex-col justify-center items-center cursor-pointer overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 bg-brand/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative z-10 flex flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full border border-brand/30 flex items-center justify-center bg-brand/5 group-hover:bg-brand group-hover:text-white transition-colors duration-500 shadow-[0_0_15px_rgba(230,46,46,0.1)]">
              <Plus className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-2xl font-tech font-bold text-white uppercase tracking-wider group-hover:text-brand-glow transition-colors">Initialize</h3>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white/70">New Tournament Setup</p>
            </div>
          </div>
        </button>

        {/* 2. CPL Intel Card */}
        <div className="flex-1 bg-dark-surface border border-white/10 cut-corners p-8 relative overflow-hidden flex flex-col group hover:border-brand/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent -mr-8 -mt-8 rounded-bl-[4rem] group-hover:from-brand/10 transition-colors"></div>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Briefing</span>
              </div>
              <h2 className="text-5xl font-tech font-bold text-white leading-none tracking-tight">CPL <span className="text-brand">V3</span></h2>
            </div>
            <div className="text-right">
              <div className="text-lg font-tech font-bold text-brand-glow">JAN 25-26</div>
              <div className="text-[9px] font-mono text-white/40 uppercase">Main Pitch</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end gap-6 relative z-10">
            
            {/* Context */}
            <p className="text-xs text-white/60 leading-relaxed font-clean pl-3 border-l-2 border-brand/30">
              High-octane T-10 matches. Powerplay restrictions active. Glory awaits on the field.
            </p>

            {/* Stats Matrix */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                <div className="flex items-center gap-2 text-[9px] text-white/40 uppercase font-bold tracking-wider mb-1">
                  <Shield className="w-3 h-3" /> Squads
                </div>
                <div className="text-2xl font-tech font-bold text-white">08</div>
              </div>
              <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                <div className="flex items-center gap-2 text-[9px] text-white/40 uppercase font-bold tracking-wider mb-1">
                  <Trophy className="w-3 h-3" /> Format
                </div>
                <div className="text-sm font-bold text-white mt-1 uppercase">Knockout</div>
              </div>
            </div>

            {/* Captains Footer */}
            <div className="flex items-center justify-between bg-brand/5 p-3 rounded border border-brand/10">
                <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-brand" />
                    <span className="text-[10px] font-bold text-brand/80 uppercase tracking-widest">Captains Config</span>
                </div>
                <div className="flex gap-1">
                    <span className="px-1.5 py-0.5 bg-brand/20 text-[9px] font-mono text-white rounded">3rd YR</span>
                    <span className="px-1.5 py-0.5 bg-brand/20 text-[9px] font-mono text-white rounded">2nd YR</span>
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}