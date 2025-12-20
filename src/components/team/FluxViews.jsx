import Image from 'next/image';
import { Zap, Users } from 'lucide-react';

export function FluxAnimating() {
    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-900/20 animate-pulse"></div>
            <Zap className="w-32 h-32 text-purple-500 animate-bounce relative z-10"/>
            <h1 className="text-6xl font-bold font-tech text-white mt-8 animate-pulse relative z-10">FLUX DIVIDE</h1>
            <p className="text-white/50 font-mono tracking-widest mt-2 relative z-10">RANDOMIZING ASSETS...</p>
        </div>
    );
}

export function FluxResult({ auctionState, team, onContinue, timer }) {
    const myMatch = auctionState.fluxData?.matches?.find(m => m.teamName === team.name);
    return (
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-10 right-10">
                <button onClick={onContinue} className="px-6 py-2 bg-white text-black font-bold uppercase text-xs rounded hover:bg-gray-200">
                    Continue ({timer}s)
                </button>
            </div>
            {myMatch ? (
                <div className="text-center animate-in zoom-in duration-500">
                    <h1 className="text-4xl font-bold text-white mb-6">Flux Assignment</h1>
                    <div className="p-10 bg-white/5 border border-purple-500 rounded-3xl">
                        <div className="w-40 h-40 mx-auto bg-black rounded-full overflow-hidden relative mb-4 border-2 border-white/20">
                            {myMatch.playerImage ? <Image src={myMatch.playerImage} fill className="object-cover" alt="p"/> : <Users className="w-20 h-20 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>}
                        </div>
                        <h2 className="text-5xl font-tech font-bold text-white uppercase">{myMatch.playerName}</h2>
                        <p className="text-purple-400 font-mono mt-2 uppercase tracking-widest">Joined your team</p>
                    </div>
                </div>
            ) : (
                <div className="text-white/50 font-mono text-xl">No player assigned in this Flux.</div>
            )}
        </div>
    );
}