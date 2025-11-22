import Image from 'next/image';
import { Users, Zap, Play, Pause, SkipForward, SkipBack, RotateCcw, Gavel, Grid, Shield } from 'lucide-react';

export default function ConsoleTab({ teams, currentPlayer, currentBid, currentBidder, isPaused, onBid, onSell, onUndo, onNext, onPrev, onPause, onFlux, formatPrice, hasPrev, hasNext }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* LEFT PANEL */}
        <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-purple-500" /><span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Power Tools</span></div>
                <button onClick={onFlux} className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">FluxDivide</button>
            </div>

            <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${currentPlayer?.isSold ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-green-500/50 text-green-500 bg-green-500/10'}`}>
                    {currentPlayer?.isSold ? 'SOLD' : (isPaused ? 'Paused' : 'Live')}
                </div>
                <div className="w-48 h-48 rounded-2xl bg-white/5 border border-white/10 mb-6 relative overflow-hidden group">
                    {currentPlayer?.image ? <Image src={currentPlayer.image} fill className="object-cover" alt="Player" /> : <Users className="w-12 h-12 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                </div>
                <h2 className="text-3xl font-tech font-bold text-white uppercase tracking-tight">{currentPlayer?.name || "End of List"}</h2>
                <p className="text-brand font-mono text-sm mt-1 uppercase tracking-widest">{currentPlayer?.role}</p>
                
                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-white/30 uppercase font-bold">Base Price</p>
                        <p className="text-xl font-mono text-white/60">{formatPrice(currentPlayer?.price || 0)}</p>
                    </div>
                    <div className="bg-brand/10 p-3 rounded-xl border border-brand/20">
                        <p className="text-[10px] text-brand/60 uppercase font-bold">Current Bid</p>
                        <p className="text-xl font-mono text-brand font-bold">{currentPlayer?.isSold ? formatPrice(currentPlayer.soldPrice) : formatPrice(currentBid)}</p>
                    </div>
                </div>
                {(currentBidder || currentPlayer?.isSold) && (
                    <div className="mt-4 w-full bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                        <span className="text-[10px] text-white/40 uppercase font-bold">{currentPlayer?.isSold ? 'Sold To:' : 'Winning:'}</span>
                        <span className="text-sm font-bold text-white uppercase">{teams.find(t => t.id === (currentPlayer?.teamId || currentBidder))?.name}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-5 gap-2">
                <button onClick={onPrev} disabled={!hasPrev} className="p-4 rounded-xl border border-white/10 bg-[#0a0a0a] text-white hover:bg-white/5 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-30"><SkipBack className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">Prev</span></button>
                <button onClick={onPause} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${isPaused ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'}`}>{isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}<span className="text-[9px] font-bold uppercase">{isPaused ? "Resume" : "Pause"}</span></button>
                <button onClick={onUndo} className="p-4 rounded-xl border border-red-900/30 bg-red-950/20 text-red-400 hover:bg-red-900/40 flex flex-col items-center justify-center gap-2 transition-all"><RotateCcw className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">Undo</span></button>
                <button onClick={onSell} disabled={!currentBidder || currentPlayer?.isSold} className="p-4 rounded-xl border border-green-500 bg-green-600 text-white hover:bg-green-500 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:grayscale"><Gavel className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">Sold</span></button>
                <button onClick={onNext} disabled={!hasNext} className="p-4 rounded-xl border border-white/10 bg-white text-black hover:bg-gray-200 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-30"><SkipForward className="w-5 h-5" /><span className="text-[9px] font-bold uppercase">Next</span></button>
            </div>
        </div>

        {/* RIGHT PANEL: GRID */}
        <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-tech font-bold text-white uppercase flex items-center gap-2"><Grid className="w-4 h-4 text-brand" /> Team Bidding Terminals</h3>
                <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Admin Control Active</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {teams.map((team) => (
                    <button key={team.id} onClick={() => onBid(team.id)} disabled={team.purse < (currentBid || currentPlayer?.price) || currentPlayer?.isSold} className={`relative p-4 rounded-xl border flex flex-col items-center gap-3 transition-all active:scale-95 group ${currentBidder === team.id ? 'bg-brand border-brand' : 'bg-white/5 border-white/10 hover:border-white/30'} disabled:opacity-30 disabled:pointer-events-none`}>
                        <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center overflow-hidden border border-white/10">{team.logoUrl ? <Image src={team.logoUrl} width={48} height={48} alt={team.name} /> : <Shield className="w-6 h-6 text-white/20" />}</div>
                        <div className="text-center"><h4 className={`text-sm font-bold uppercase leading-tight ${currentBidder === team.id ? 'text-white' : 'text-white/80'}`}>{team.name}</h4><p className={`text-[10px] font-mono mt-1 ${currentBidder === team.id ? 'text-white/80' : 'text-brand'}`}>Purse: {formatPrice(team.purse)}</p></div>
                        {currentBidder === team.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-ping"></div>}
                        <div className={`w-full py-1.5 rounded text-[10px] font-bold uppercase tracking-widest mt-1 ${currentBidder === team.id ? 'bg-white text-brand' : 'bg-white/10 text-white/40 group-hover:bg-brand group-hover:text-white'} transition-colors`}>{currentBidder === team.id ? 'Leading' : 'Place Bid'}</div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}