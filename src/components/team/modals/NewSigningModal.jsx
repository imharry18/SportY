'use client';
import Image from 'next/image';
import { X, Sparkles, CheckCircle, Users } from 'lucide-react';

export default function NewSigningModal({ player, onClose }) {
  if (!player) return null;

  return (
    // Z-INDEX remains high, but layout ensures it fits
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-500 p-4">
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        {/* Modal Container - Max Height Constrained */}
        <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-yellow-500/50 rounded-[2rem] p-1 text-center shadow-[0_0_80px_rgba(234,179,8,0.2)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="bg-[#0f0f11] rounded-[1.8rem] p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    {/* Header Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                        <span className="text-yellow-400 font-bold uppercase tracking-[0.3em] text-[10px]">Official Signing</span>
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                    </div>

                    {/* Image - Reduced Size */}
                    <div className="w-32 h-32 rounded-full border-2 border-yellow-500 p-1 mb-6 shadow-xl relative">
                        <div className="w-full h-full rounded-full overflow-hidden relative bg-white/5">
                          {player.image ? (
                              <Image src={player.image} fill className="object-cover" alt="player" />
                          ) : (
                              <div className="flex items-center justify-center h-full"><Users className="w-12 h-12 text-white/20" /></div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black font-bold p-1.5 rounded-full border-2 border-[#0f0f11] shadow-lg">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Info */}
                    <h2 className="text-3xl font-tech font-bold text-white uppercase leading-none mb-1">{player.name}</h2>
                    <p className="text-white/40 font-mono uppercase tracking-widest mb-6 text-xs">{player.role}</p>

                    {/* Price Box */}
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                        <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-1">Final Acquisition Cost</div>
                        <div className="text-3xl font-mono font-bold text-yellow-400">₹ {player.soldPrice?.toLocaleString('en-IN')}</div>
                    </div>

                    {/* Action */}
                    <button onClick={onClose} className="w-full py-3 bg-white text-black font-bold uppercase text-sm tracking-widest rounded-xl hover:bg-yellow-400 transition-colors shadow-lg">
                        Confirm & Close
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}