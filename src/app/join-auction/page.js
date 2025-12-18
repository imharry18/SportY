'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Eye, Settings, Edit, ArrowRight, X, Lock } from 'lucide-react';

export default function JoinAuction() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(null); // 'ADMIN', 'TEAM', 'SETUP', 'EDIT'
  const [form, setForm] = useState({ leagueId: '', passcode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Determine Role for API
    let apiRole = activeModal;
    if (activeModal === 'EDIT') apiRole = 'SETUP'; // Edit uses same perm as Setup usually

    try {
      const res = await fetch('/api/auction/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            leagueId: form.leagueId,
            passcode: form.passcode,
            role: apiRole
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(data.redirect);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setActiveModal(type);
    setError('');
    setForm({ leagueId: '', passcode: '' });
  }

  return (
    <div className="min-h-screen w-full bg-[#020202] flex flex-col items-center py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] animate-pulse pointer-events-none"></div>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-6xl font-tech font-bold text-white uppercase tracking-tight">Main <span className="text-brand">Lobby</span></h1>
      </div>

      {/* --- TOP: CONFIGURATION ZONE --- */}
      <div className="flex gap-4 mb-16 relative z-10 w-full max-w-4xl">
        
        {/* SETUP BUTTON */}
        <button 
            onClick={() => openModal('SETUP')}
            className="flex-1 group flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/10 hover:border-brand/50 rounded-2xl transition-all hover:bg-white/[0.05]"
        >
            <div className="mb-4 p-3 bg-brand/10 rounded-full text-brand group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-tech font-bold text-white uppercase tracking-wider">Setup Auction</h3>
            <p className="text-xs text-white/40 font-mono mt-2">Initialize Teams & Rules</p>
        </button>

        {/* EDIT BUTTON */}
        <button 
            onClick={() => openModal('EDIT')}
            className="flex-1 group flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 rounded-2xl transition-all hover:bg-white/[0.05]"
        >
            <div className="mb-4 p-3 bg-cyan-500/10 rounded-full text-cyan-400 group-hover:scale-110 transition-transform">
                <Edit className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-tech font-bold text-white uppercase tracking-wider">Edit Config</h3>
            <p className="text-xs text-white/40 font-mono mt-2">Modify Existing Params</p>
        </button>
      </div>

      {/* --- BOTTOM: JOIN ROLES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full relative z-10">
        <RoleCard icon={Shield} title="Admin" color="text-brand" onClick={() => openModal('ADMIN')} />
        <RoleCard icon={Users} title="Team" color="text-cyan-400" onClick={() => openModal('TEAM')} />
        <RoleCard icon={Eye} title="Spectator" color="text-yellow-400" onClick={() => openModal('SPECTATOR')} />
      </div>

      {/* --- UNIVERSAL MODAL --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-white/20 hover:text-white"><X className="w-6 h-6" /></button>
                
                <div className="mb-6">
                    <h3 className="text-2xl font-tech font-bold text-white uppercase mb-1">Access: <span className="text-brand">{activeModal}</span></h3>
                    <p className="text-xs text-white/40 font-mono">SECURE_GATEWAY_V3</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">League ID</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-brand/50 outline-none"
                            placeholder="CPL-XXX-XXX"
                            value={form.leagueId}
                            onChange={(e) => setForm({...form, leagueId: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">
                            {activeModal === 'TEAM' ? 'Team Access Code' : 'Admin Passcode'}
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-brand/50 outline-none"
                            placeholder="SECRET-KEY"
                            value={form.passcode}
                            onChange={(e) => setForm({...form, passcode: e.target.value})}
                            required
                        />
                    </div>
                    <button disabled={loading} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest cut-corners-sm hover:scale-[1.02] transition-transform flex justify-center">
                        {loading ? 'Verifying...' : 'Authenticate'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

function RoleCard({ icon: Icon, title, color, onClick }) {
    return (
        <button onClick={onClick} className="group relative bg-[#080808] border border-white/10 p-8 flex items-center gap-6 hover:border-white/30 transition-all cut-corners text-left">
            <div className={`p-4 rounded-full bg-white/5 border border-white/5 ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-tech font-bold text-white uppercase">{title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono mt-1 group-hover:text-white/60">
                    <Lock className="w-3 h-3" /> Login Required
                </div>
            </div>
        </button>
    )
}