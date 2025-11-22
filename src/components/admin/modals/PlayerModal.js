import { Edit3, Plus, X } from 'lucide-react';

export default function PlayerModal({ player, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">{player ? <Edit3 className="w-5 h-5 text-brand" /> : <Plus className="w-5 h-5 text-brand" />}{player ? 'Edit Player' : 'New Player'}</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                onSave({ name: formData.get('name'), role: formData.get('role'), price: formData.get('price') });
            }} className="space-y-4">
                <div><label className="text-[10px] text-white/40 uppercase font-bold">Name</label><input name="name" defaultValue={player?.name} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-brand/50 outline-none" required /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] text-white/40 uppercase font-bold">Role</label><select name="role" defaultValue={player?.role || 'Batsman'} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-brand/50 outline-none"><option>Batsman</option><option>Bowler</option><option>All-Rounder</option><option>Wicket Keeper</option></select></div>
                    <div><label className="text-[10px] text-white/40 uppercase font-bold">Base Price</label><input name="price" type="number" defaultValue={player?.price || 500000} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-brand/50 outline-none" required /></div>
                </div>
                <div className="flex gap-3 mt-6"><button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 text-white/60 font-bold uppercase text-xs rounded hover:bg-white/10">Cancel</button><button type="submit" className="flex-1 py-3 bg-brand text-white font-bold uppercase text-xs rounded hover:bg-brand-glow">Save</button></div>
            </form>
        </div>
    </div>
  );
}