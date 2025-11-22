import { Zap, XCircle, Users, Check } from 'lucide-react';
import Image from 'next/image';

export default function FluxModal({ players, teams, selection, onClose, onToggle, onSubmit }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
        <div className="bg-[#0f0f11] border border-purple-500/30 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col relative shadow-[0_0_50px_rgba(147,51,234,0.1)]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div><h2 className="text-2xl font-tech font-bold text-white uppercase flex items-center gap-3"><Zap className="w-6 h-6 text-purple-500" /> Flux Divide</h2><p className="text-xs text-white/40 mt-1">Select {teams.length} players to randomly distribute.</p></div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {players.filter(p => !p.isSold).map(p => {
                    const isSelected = selection.includes(p.id);
                    return (
                        <div key={p.id} onClick={() => onToggle(p.id)} className={`relative p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                            {isSelected && <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                            <div className="w-full aspect-square bg-black/30 rounded-lg mb-3 overflow-hidden relative">{p.image ? <Image src={p.image} fill className="object-cover" alt={p.name} /> : <Users className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"/>}</div>
                            <div className="text-center"><div className="font-bold text-sm text-white truncate">{p.name}</div><div className="text-[10px] text-white/40 uppercase">{p.role}</div></div>
                        </div>
                    )
                })}
            </div>

            <div className="p-6 border-t border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                <div className="text-sm font-bold text-white/60">Selected: <span className="text-purple-400">{selection.length}</span> / {teams.length}</div>
                <button onClick={onSubmit} disabled={selection.length === 0} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Initialize Flux</button>
            </div>
        </div>
    </div>
  );
}