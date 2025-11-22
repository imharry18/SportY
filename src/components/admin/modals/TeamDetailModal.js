import Image from 'next/image';
import { Shield, XCircle } from 'lucide-react';

export default function TeamDetailModal({ team, players, formatPrice, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">{team.logoUrl ? <Image src={team.logoUrl} width={40} height={40} alt="logo" /> : <Shield className="w-5 h-5 text-white/20" />}</div>
                    <div><h3 className="text-lg font-bold text-white uppercase">{team.name}</h3><p className="text-xs text-brand font-mono">Purse: {formatPrice(team.purse)}</p></div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="p-0 max-h-[400px] overflow-y-auto bg-black/50">
                <table className="w-full text-left text-sm text-white/70">
                    <thead className="bg-white/5 text-white/30 text-[10px] uppercase font-bold sticky top-0"><tr><th className="px-6 py-3">Player</th><th className="px-6 py-3 text-right">Sold For</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                        {players.filter(p => p.teamId === team.id).map(p => (
                            <tr key={p.id}><td className="px-6 py-3">{p.name} <span className="text-white/30 text-[10px] ml-2 uppercase">{p.role}</span></td><td className="px-6 py-3 text-right font-mono text-green-400">{formatPrice(p.soldPrice)}</td></tr>
                        ))}
                        {players.filter(p => p.teamId === team.id).length === 0 && <tr><td colSpan="2" className="px-6 py-8 text-center text-white/20 text-xs uppercase tracking-widest">No Players Purchased</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}