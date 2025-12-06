'use client';
import { Gamepad2, Trophy, Activity, Sword, ArrowUpRight } from 'lucide-react';

const SPORTS_DATA = [
  { 
    id: 1, 
    key: 'cricket',
    name: 'Cricket', 
    icon: '🏏', 
    lucide: Trophy,
    status: 'Coming Soon', 
    players: 'Registrations Closed', 
    desc: 'T-10 Blitz Format' 
  },
  { 
    id: 2, 
    key: 'football',
    name: 'Football', 
    icon: '⚽', 
    lucide: Activity,
    status: 'Coming Soon', 
    players: 'Waiting List', 
    desc: '5v5 Futsal Arena' 
  },
  { 
    id: 3, 
    key: 'volleyball',
    name: 'Volleyball', 
    icon: '🏐', 
    lucide: Sword,
    status: 'Live', // Example of a Live event to show contrast
    players: '12 Active Teams', 
    desc: 'Spike & Block' 
  },
  { 
    id: 4, 
    key: 'esports',
    name: 'Esports', 
    icon: '🎮', 
    lucide: Gamepad2,
    status: 'Coming Soon', 
    players: 'System Offline', 
    desc: 'BGMI / Valorant' 
  },
];

export default function SportsSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center py-20 px-6 bg-[#020202] border-t border-white/5 overflow-hidden">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.05),transparent_70%)]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full relative z-10 flex flex-col gap-16">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-0.5 bg-gradient-to-r from-brand to-cyan-400"></span>
                    <span className="text-white/40 font-mono text-xs uppercase tracking-[0.3em]">Sector 04</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-tech font-bold text-white uppercase tracking-tight leading-none">
                    Battle <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400">Arenas</span>
                </h3>
            </div>
            <div className="text-right">
                <p className="text-sm font-clean text-white/40 max-w-xs ml-auto">
                    Select your discipline. Deploy your squad. Dominate the leaderboard.
                </p>
            </div>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPORTS_DATA.map((sport, i) => {
                const isLive = sport.status === 'Live';
                const accentColor = isLive ? 'text-brand border-brand/30 bg-brand/10' : 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
                const hoverBorder = isLive ? 'group-hover:border-brand/50' : 'group-hover:border-cyan-500/50';
                const hoverGlow = isLive ? 'group-hover:shadow-[0_0_40px_rgba(230,46,46,0.15)]' : 'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]';

                return (
                    <div key={sport.id} className={`group relative h-[450px] bg-[#080808] border border-white/10 cut-corners p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 cursor-pointer ${hoverBorder} ${hoverGlow} hover:-translate-y-2`}>
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isLive ? 'via-brand/5' : 'via-cyan-500/5'}`}></div>

                        {/* Top: Status Tag */}
                        <div className="relative z-10 flex justify-between items-start">
                            <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${accentColor}`}>
                                {isLive ? '● Live Now' : '○ Coming Soon'}
                            </span>
                            <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                        </div>

                        {/* Center: Icon Visual */}
                        <div className="relative z-10 self-center">
                            <div className="w-24 h-24 flex items-center justify-center relative">
                                {/* Glowing Back circle */}
                                <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 scale-50 group-hover:scale-100 transition-transform duration-700 ${isLive ? 'bg-brand' : 'bg-cyan-400'}`}></div>
                                <span className="text-6xl filter drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    {sport.icon}
                                </span>
                            </div>
                        </div>

                        {/* Bottom: Info */}
                        <div className="relative z-10 space-y-4">
                            <div>
                                <h4 className="text-4xl font-tech font-bold text-white uppercase tracking-tight mb-1 group-hover:text-white transition-colors">
                                    {sport.name}
                                </h4>
                                <div className="h-0.5 w-12 bg-white/10 group-hover:w-full transition-all duration-500 ease-out origin-left"></div>
                            </div>
                            
                            <div className="flex justify-between items-end opacity-60 group-hover:opacity-100 transition-opacity">
                                <div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Status</div>
                                    <div className="text-sm font-mono text-white">{sport.players}</div>
                                </div>
                                <sport.lucide className={`w-5 h-5 ${isLive ? 'text-brand' : 'text-cyan-400'}`} />
                            </div>
                        </div>

                        {/* Big Background Number */}
                        <span className="absolute -bottom-4 -right-4 text-[12rem] font-tech font-bold text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none select-none leading-none">
                            0{sport.id}
                        </span>
                    </div>
                );
            })}
        </div>

      </div>
    </section>
  );
}