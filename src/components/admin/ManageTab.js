import { useState } from 'react';
import Image from 'next/image';
import { Search, UserPlus, GripVertical, Users, Edit3, Trash2 } from 'lucide-react';

export default function ManageTab({ players, teams, formatPrice, onEdit, onDelete, onAdd, onDragStart, onDragEnter, onDragEnd }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full animate-in fade-in">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search Database..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-brand/50 outline-none" />
            </div>
            <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase hover:bg-gray-200"><UserPlus className="w-4 h-4" /> Add Player</button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
            {players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p, index) => (
                <div key={p.id} draggable={!searchQuery} onDragStart={(e) => onDragStart(index)} onDragEnter={(e) => onDragEnter(index)} onDragEnd={onDragEnd} onDragOver={(e) => e.preventDefault()} className={`flex items-center justify-between p-3 rounded-lg border border-white/5 ${p.isSold ? 'bg-white/[0.02] opacity-50' : 'bg-[#111] hover:bg-white/[0.05] cursor-grab active:cursor-grabbing'}`}>
                    <div className="flex items-center gap-4">
                        {!searchQuery && <div className="p-2 text-white/20"><GripVertical className="w-4 h-4" /></div>}
                        <div className="w-8 h-8 bg-white/10 rounded overflow-hidden relative">{p.image ? <Image src={p.image} fill className="object-cover" alt="img" /> : <Users className="w-4 h-4 m-2 text-white/20"/>}</div>
                        <div><div className="text-sm font-bold text-white">{p.name}</div><div className="text-[10px] text-white/40 font-mono uppercase">{p.role} • {formatPrice(p.price)}</div></div>
                    </div>
                    <div className="flex items-center gap-6">
                        {p.isSold && <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-900/30 text-green-400 text-[10px] font-bold uppercase border border-green-900/50">Sold to {teams.find(t => t.id === p.teamId)?.name}</span>}
                        <div className="text-[10px] font-mono text-white/20">SEQ: {index + 1}</div>
                        <div className="flex gap-2">
                            <button onClick={() => onEdit(p)} className="p-1.5 bg-white/10 hover:bg-white hover:text-black rounded transition-colors"><Edit3 className="w-3 h-3" /></button>
                            <button onClick={() => onDelete(p.id)} className="p-1.5 bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}