import Image from 'next/image';
import { Shield, Trophy, LogOut, Wallet, Edit } from 'lucide-react';

export default function DashboardHeader({ team, auctionName, purse, squadCount, purseExchanged, onEdit, onShowSquad, onLogout }) {
  const themeColor = team?.themeColor || '#E62E2E';

  return (
    <header className="h-20 shrink-0 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl z-40 relative shadow-2xl">
        <div className="max-w-[1920px] mx-auto px-8 h-full flex items-center justify-between">
          
          {/* My Team Info (Left) */}
          <div className="flex items-center gap-5 w-1/3 group">
            {/* Logo */}
            <div className="relative w-12 h-12 rounded-full border-2 bg-white/5 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ borderColor: themeColor }}>
                {team?.logoUrl ? <Image src={team.logoUrl} fill className="object-cover" alt={team.name} /> : <Shield className="w-5 h-5 text-white/20" />}
            </div>
            <div>
                <h1 className="text-xl font-bold uppercase tracking-tight leading-none text-white group-hover:text-white/90">{team?.name}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                    <p className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">Online</p>
                </div>
            </div>
          </div>

          {/* Tournament Name (Center) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center hidden md:block">
             <div className="flex items-center gap-2 opacity-40 mb-1 justify-center">
                <Trophy className="w-3 h-3" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Live Auction</span>
             </div>
             <h2 className="text-lg font-tech font-bold text-white uppercase tracking-widest text-glow">{auctionName}</h2>
          </div>

          {/* Stats & Actions (Right) */}
          <div className="flex items-center justify-end gap-4 w-1/3">
             
             {/* Purse Display */}
             <div className={`text-right px-4 py-1.5 rounded-xl border transition-all duration-500 hidden sm:block ${purseExchanged ? 'bg-red-500/10 border-red-500/50' : 'bg-transparent border-transparent'}`}>
                <div className={`text-[9px] uppercase font-bold mb-0.5 flex items-center justify-end gap-1 ${purseExchanged ? 'text-red-400' : 'text-white/30'}`}>
                    <Wallet className="w-3 h-3" /> Balance
                </div>
                <div className={`text-2xl font-mono font-bold transition-all duration-300 ${purseExchanged ? 'text-red-500 scale-110' : 'text-white'}`}>
                    ₹ {purse?.toLocaleString('en-IN')}
                </div>
             </div>

             <div className="h-8 w-px bg-white/10 hidden sm:block mx-2"></div>
             
             {/* Squad Button */}
             <button onClick={onShowSquad} className="flex flex-col items-end group mr-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Squad</div>
                <div className="w-12 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-lg font-tech font-bold text-white group-hover:bg-white group-hover:text-black transition-all shadow-inner">
                    {squadCount}
                </div>
             </button>

             {/* NEW: Edit Button */}
             <button 
                onClick={onEdit} 
                className="p-2.5 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-full text-white/50 transition-all shadow-lg group"
                title="Edit Team Settings"
             >
                <Edit className="w-5 h-5" />
             </button>
             
             {/* Logout Button */}
             <button onClick={onLogout} className="p-2.5 hover:bg-red-500/10 rounded-full text-white/20 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
    </header>
  );
}