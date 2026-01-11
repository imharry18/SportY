'use client';
import Link from 'next/link';
import { Timer, Zap, Flame, Rocket, ArrowRight, Gauge } from 'lucide-react';

export default function BlitzShowcase() {
  return (
    <section className="relative min-h-[90vh] flex items-center py-20 px-6 bg-black border-t border-white/5 overflow-hidden">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none"></div>
      {/* Yellow/Amber Glow for 'Blitz' feel */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-yellow-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none animate-pulse"></div>

      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* --- LEFT: VISUAL CONSOLE --- */}
        <div className="lg:col-span-7 relative order-2 lg:order-1 h-[600px] flex items-center justify-center">
            
            {/* Visual Container */}
            <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-yellow-500/20 rounded-[2rem] p-1 shadow-[0_0_100px_rgba(234,179,8,0.1)] overflow-hidden group">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                
                {/* Timer Animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-yellow-500/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_20px_#eab308]"></div>
                </div>

                <div className="relative z-10 bg-[#050505]/90 backdrop-blur-xl h-full rounded-[1.8rem] p-8 flex flex-col items-center justify-center text-center gap-6 border border-white/5">
                    
                    <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 mb-2 shadow-[0_0_30px_rgba(234,179,8,0.15)] group-hover:scale-110 transition-transform duration-500">
                        <Timer className="w-10 h-10 text-yellow-500" />
                    </div>

                    <div>
                        <h3 className="text-4xl font-tech font-bold text-white uppercase tracking-wider mb-2">30s <span className="text-yellow-500">Rounds</span></h3>
                        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Speed Bidding Protocol</p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-1">
                                <Rocket className="w-4 h-4" />
                            </div>
                            <div className="text-2xl font-bold text-white">3x</div>
                            <div className="text-[9px] text-white/30 uppercase font-bold">Faster Pace</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-1">
                                <Gauge className="w-4 h-4" />
                            </div>
                            <div className="text-2xl font-bold text-white">Auto</div>
                            <div className="text-[9px] text-white/30 uppercase font-bold">Bid Increment</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* --- RIGHT: CONTENT --- */}
        <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2 gap-8">
            
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-0.5 bg-yellow-500"></span>
                    <span className="text-yellow-500 font-mono text-xs uppercase tracking-[0.3em] font-bold">New Feature</span>
                </div>
                
                <h2 className="text-6xl md:text-7xl font-tech font-bold text-white uppercase leading-[0.9]">
                    Blitz <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">Draft Mode.</span>
                </h2>
                
                <p className="text-white/50 text-lg font-clean leading-relaxed border-l-2 border-yellow-500/20 pl-6">
                    Designed for rapid squad building. Eliminate the wait with automated timers, quick-fire bidding controls, and streamlined player rotations.
                    <br/><br/>
                    <span className="text-white">Perfect for:</span> Last-minute drafts, mini-leagues, and high-intensity showdowns.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/blitz-draft" className="group w-fit">
                    <button className="relative px-8 py-4 bg-yellow-500 text-black cut-corners-sm overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <div className="relative z-10 flex items-center gap-3">
                            <Zap className="w-5 h-5 fill-current" />
                            <span className="font-tech font-bold text-lg uppercase tracking-widest">Enter Blitz Arena</span>
                        </div>
                    </button>
                </Link>
                
                <div className="flex items-center gap-4 px-6 text-xs font-mono text-white/30 uppercase tracking-widest">
                    <Flame className="w-4 h-4 text-yellow-500 animate-pulse" />
                    <span>Live Beta Access</span>
                </div>
            </div>

        </div>

      </div>
    </section>
  );
}