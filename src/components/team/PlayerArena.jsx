'use client';
import Image from 'next/image';
import { Zap, Users, CheckCircle, Hand, AlertCircle } from 'lucide-react';

export default function PlayerArena({ activePlayer, auctionState, team, isPlayerSold, soldToMyTeam, soldToOtherTeam, winningTeamName, statusColor }) {
  
  if (!activePlayer) {
    return (
        <div className="flex flex-col items-center justify-center h-full opacity-60 animate-pulse">
            <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mb-8 bg-gradient-to-b from-white/5 to-transparent shadow-2xl">
                <Zap className="w-12 h-12 text-white/30" />
            </div>
            <h2 className="text-4xl font-tech font-bold text-white uppercase tracking-widest mb-2">System Idle</h2>
            <p className="text-sm font-mono text-white/40 uppercase tracking-[0.2em]">Waiting for Auctioneer...</p>
        </div>
    );
  }

  const currentBidder = auctionState.currentBidder;

  return (
    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center animate-in zoom-in-95 duration-500 h-full max-h-[80vh]">
        
        {/* --- LEFT: PLAYER CARD --- */}
        <div className="md:col-span-5 flex items-center justify-center h-full">
            <div className={`relative w-full max-w-md aspect-[3/4] max-h-[60vh] bg-[#0f0f11] rounded-[2rem] border-4 overflow-hidden shadow-2xl transition-all duration-500 group ${isPlayerSold ? 'grayscale-[0.5] scale-95 opacity-80' : 'hover:scale-[1.02]'}`} style={{ borderColor: statusColor }}>
                
                {/* Sold Overlay */}
                {isPlayerSold && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                        {soldToMyTeam ? (
                            <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.6)]">
                                    <CheckCircle className="w-12 h-12 text-black" />
                                </div>
                                <h3 className="text-5xl font-bold font-tech text-white uppercase tracking-widest drop-shadow-lg">Acquired</h3>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="border-[6px] border-red-500 text-red-500 px-10 py-3 text-7xl font-black uppercase -rotate-12 tracking-widest mix-blend-screen opacity-90 shadow-xl">SOLD</div>
                                <div className="mt-6 text-white/80 font-mono text-lg uppercase tracking-widest bg-white/10 px-6 py-2 rounded-full">To {winningTeamName}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Player Image */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                {activePlayer.image ? (
                    <Image src={activePlayer.image} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" alt="p" />
                ) : (
                    <div className="w-full h-full flex justify-center items-center bg-white/5"><Users className="w-32 h-32 text-white/10"/></div>
                )}
                
                {/* Card Info Bottom */}
                <div className="absolute bottom-0 w-full p-8 z-20">
                    <h2 className="text-5xl font-bold font-tech text-white uppercase leading-[0.9] mb-4 drop-shadow-md">{activePlayer.name}</h2>
                    <div className="flex items-center justify-between">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold text-white uppercase tracking-wider">{activePlayer.role}</span>
                        <div className="text-right">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-0.5">Base Price</p>
                            <p className="text-white/80 font-mono text-sm">₹ {activePlayer.price?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT: BIDDING CONTROLS --- */}
        <div className="md:col-span-7 flex flex-col justify-center pl-0 md:pl-10 h-full py-10">
            
            {/* Live Status Badge - FIXED: Removed backdrop-blur-xl */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border shadow-lg transition-all duration-500 bg-[#0a0a0a]" 
                     style={{ 
                         borderColor: `${statusColor}66`, 
                         boxShadow: `0 0 30px ${statusColor}15`
                     }}>
                    <span className="relative flex h-3 w-3">
                      {!isPlayerSold && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: statusColor }}></span>}
                      <span className="relative inline-flex rounded-full h-3 w-3 shadow-sm" style={{ backgroundColor: statusColor }}></span>
                    </span>
                    
                    <span className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-3">
                        {isPlayerSold ? (
                            soldToMyTeam ? 'Successful Purchase' : (
                                <>Sold to <span className="text-2xl font-black border-b-2 border-white/20 pb-0.5">{winningTeamName}</span></>
                            )
                        ) : currentBidder ? (
                            <>
                                <span className="opacity-70 text-xs">Leading:</span>
                                <span className="text-3xl font-black tracking-tight drop-shadow-md transform translate-y-[-1px]">{currentBidder.name}</span>
                            </>
                        ) : (
                            'Waiting for Opening Bid'
                        )}
                    </span>
                </div>
            </div>

            {/* Big Price Display */}
            <div className="mb-12">
                <p className="text-sm text-white/40 font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    {isPlayerSold ? <CheckCircle className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                    {isPlayerSold ? 'Winning Bid Amount' : 'Current Market Price'}
                </p>
                <div className="text-[7rem] lg:text-[8rem] font-mono font-bold text-white tracking-tighter leading-none flex items-start transition-all duration-300 drop-shadow-2xl">
                    <span className="text-5xl mt-6 opacity-30 mr-6">₹</span>
                    {isPlayerSold 
                        ? activePlayer.soldPrice?.toLocaleString('en-IN') 
                        : (auctionState.currentBid > 0 ? auctionState.currentBid.toLocaleString('en-IN') : activePlayer.price.toLocaleString('en-IN'))
                    }
                </div>
            </div>

            {/* Action Area */}
            <div className="border-t border-white/10 pt-10">
                <div className={`w-full h-28 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 border ${isPlayerSold ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                    <div className="flex items-center gap-6 opacity-50">
                        <Hand className="w-8 h-8 text-white" />
                        <div className="text-left">
                            <span className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Manual Mode</span>
                            <span className="block text-2xl font-bold text-white uppercase tracking-tight">Raise Physical Paddle</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}