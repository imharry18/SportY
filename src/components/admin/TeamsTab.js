import Image from 'next/image';
import { Shield } from 'lucide-react';

export default function TeamsTab({ teams, players, formatPrice, onTeamClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in">
        {teams.map(team => (
            <div key={team.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-brand/30 transition-all cursor-pointer" onClick={() => onTeamClick(team)}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">{team.logoUrl ? <Image src={team.logoUrl} width={56} height={56} alt="logo" /> : <Shield className="w-6 h-6 text-white/20" />}</div>
                        <div><h3 className="text-lg font-bold text-white uppercase">{team.name}</h3><p className="text-xs text-white/40 font-mono">{team.accessCode}</p></div>
                    </div>
                    <div className="text-right"><p className="text-[10px] text-white/30 uppercase font-bold">Purse</p><p className="text-lg font-mono text-brand font-bold">{formatPrice(team.purse)}</p></div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center text-xs text-white/60"><span>Squad Size</span><span className="font-mono text-white font-bold">{players.filter(p => p.teamId === team.id).length} / 15</span></div>
            </div>
        ))}
    </div>
  );
}