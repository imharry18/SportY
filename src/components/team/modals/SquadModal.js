'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, Users, Edit3, Shield, Upload, Save } from 'lucide-react';

export function SquadModal({ squad, onClose, totalSpent }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col relative shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <div>
                        <h3 className="text-3xl font-tech font-bold text-white uppercase">My Squad</h3>
                        <p className="text-xs text-white/40 font-mono mt-1 uppercase tracking-widest">Total Spent: <span className="text-white">₹ {totalSpent.toLocaleString('en-IN')}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-[#050505] grid grid-cols-1 md:grid-cols-2 gap-4">
                    {squad.map((p) => (
                        <div key={p.id} className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-white/5 hover:border-white/20 rounded-2xl transition-colors group">
                            <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden relative border border-white/5">
                                {p.image ? <Image src={p.image} fill className="object-cover" alt="p"/> : <Users className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"/>}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg leading-none">{p.name}</h4>
                                <span className="text-[10px] text-white/40 uppercase tracking-wider block mt-1">{p.role}</span>
                                <p className="font-mono text-sm font-bold text-green-400 mt-2">₹ {p.soldPrice?.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                    {squad.length === 0 && <div className="col-span-2 text-center py-20 text-white/20 font-mono uppercase tracking-widest">Squad is empty</div>}
                </div>
            </div>
        </div>
    )
}

export function EditTeamModal({ team, onClose, onSave }) {
    const [form, setForm] = useState({ name: team.name, logoUrl: team.logoUrl, themeColor: team.themeColor || '#E62E2E' });
    const colors = ['#E62E2E', '#F97316', '#FACC15', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#D946EF', '#F43F5E', '#64748B'];

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) { const reader = new FileReader(); reader.onload = (ev) => setForm(p => ({ ...p, logoUrl: ev.target.result })); reader.readAsDataURL(file); }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold font-tech text-white uppercase mb-8 flex items-center gap-3"><Edit3 className="w-6 h-6 text-brand" /> Team Settings</h3>
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <label className="relative w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/30 transition-colors group">
                            {form.logoUrl ? <Image src={form.logoUrl} fill className="object-cover" alt="Logo" /> : <Shield className="w-10 h-10 text-white/20" />}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="w-6 h-6 text-white" /></div>
                            <input type="file" className="hidden" onChange={handleFile} />
                        </label>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase block mb-2 tracking-widest">Team Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white font-bold focus:border-brand/50 outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase block mb-3 tracking-widest">Theme Color</label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map(c => (
                                <button key={c} onClick={() => setForm({...form, themeColor: c})} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${form.themeColor === c ? 'ring-2 ring-white scale-110' : ''}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                    <button onClick={() => onSave(form)} className="w-full py-4 bg-white text-black font-bold uppercase rounded-xl hover:bg-gray-200 mt-4 flex items-center justify-center gap-2 shadow-lg"><Save className="w-5 h-5" /> Save Changes</button>
                </div>
            </div>
        </div>
    )
}