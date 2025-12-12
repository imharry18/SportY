'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Eye, Settings, Edit, ArrowRight, X, Lock, Zap, Terminal } from 'lucide-react';

export default function JoinAuction() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(null); 
  const [form, setForm] = useState({ leagueId: '', passcode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiRole = activeModal; 

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
        // SAVE TEAM SESSION IF LOGGING IN AS TEAM
        if (activeModal === 'TEAM' && data.teamData) {
            localStorage.setItem('sporty_team_session', JSON.stringify(data.teamData));
        }
        router.push(data.redirect);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
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

  // ... (REST OF THE COMPONENT REMAINS EXACTLY THE SAME, NO CHANGES BELOW)
  return (
    <div className="min-h-[calc(100vh-5rem)] w-full bg-[#050505] flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none animate-pulse"></div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-5xl w-full relative z-10 flex flex-col items-center">

        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Gateway v4.1</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-tech font-bold text-white uppercase tracking-tighter leading-none mb-4">
                System <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-glow">Access.</span>
            </h1>
            <p className="text-white/40 font-clean text-sm max-w-md mx-auto">
                Secure entry point for Auction Admins, Franchise Owners, and Spectators. Select your protocol.
            </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mb-12">
            
            {/* LEFT: ADMIN TOOLS */}
            <div className="lg:col-span-4 flex flex-col gap-4 animate-in slide-in-from-left-4 duration-700 delay-100">
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1 pl-1">Configuration</p>
                
                {/* SETUP BTN */}
                <button 
                    onClick={() => openModal('SETUP')}
                    className="group relative h-32 w-full bg-[#0a0a0a] border border-white/10 hover:border-brand/50 rounded-2xl overflow-hidden transition-all text-left p-6"
                >
                    <div className="absolute inset-0 bg-brand/5 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center rounded-2xl"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <Settings className="w-6 h-6 text-white/40 group-hover:text-brand transition-colors" />
                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                        </div>
                        <div>
                            <h3 className="text-xl font-tech font-bold text-white uppercase tracking-wide">Initialize</h3>
                            <p className="text-[10px] font-mono text-white/40">Run New Setup</p>
                        </div>
                    </div>
                </button>

                {/* EDIT BTN */}
                <button 
                    onClick={() => openModal('EDIT')}
                    className="group relative h-32 w-full bg-[#0a0a0a] border border-white/10 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all text-left p-6"
                >
                    <div className="absolute inset-0 bg-blue-500/5 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center rounded-2xl"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <Edit className="w-6 h-6 text-white/40 group-hover:text-blue-400 transition-colors" />
                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                        </div>
                        <div>
                            <h3 className="text-xl font-tech font-bold text-white uppercase tracking-wide">Modify</h3>
                            <p className="text-[10px] font-mono text-white/40">Edit Existing Config</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* RIGHT: JOIN ROLES */}
            <div className="lg:col-span-8 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-700 delay-200">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 pl-1">Login Protocols</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                    <RoleCard 
                        icon={Shield} 
                        title="Admin" 
                        color="text-brand" 
                        borderColor="hover:border-brand/50"
                        bgHover="group-hover:bg-brand/5"
                        desc="Full Control"
                        onClick={() => openModal('ADMIN')} 
                    />
                    <RoleCard 
                        icon={Users} 
                        title="Team" 
                        color="text-cyan-400" 
                        borderColor="hover:border-cyan-400/50"
                        bgHover="group-hover:bg-cyan-400/5"
                        desc="Bidding Access"
                        onClick={() => openModal('TEAM')} 
                    />
                    <RoleCard 
                        icon={Eye} 
                        title="View" 
                        color="text-yellow-400" 
                        borderColor="hover:border-yellow-400/50"
                        bgHover="group-hover:bg-yellow-400/5"
                        desc="Read Only"
                        onClick={() => openModal('SPECTATOR')} 
                    />
                </div>
            </div>

        </div>

      </div>

      {/* UNIVERSAL LOGIN MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Background FX */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand/5 blur-[80px] rounded-full pointer-events-none"></div>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-4 h-4 text-brand" />
                            <span className="text-[10px] font-mono text-brand uppercase tracking-widest">Secure Terminal</span>
                        </div>
                        <h3 className="text-3xl font-tech font-bold text-white uppercase tracking-tight">
                            {activeModal} <span className="text-white/40">Login</span>
                        </h3>
                    </div>
                    <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center rounded-lg animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-1.5 group/input">
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1 group-focus-within/input:text-brand transition-colors">League ID</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono placeholder:text-white/10 focus:border-brand/50 focus:outline-none transition-all text-sm uppercase"
                                placeholder="CPL-XXX-XXX"
                                value={form.leagueId}
                                onChange={(e) => setForm({...form, leagueId: e.target.value.toUpperCase()})}
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none"><Zap className="w-4 h-4" /></div>
                        </div>
                    </div>
                    
                    <div className="space-y-1.5 group/input">
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1 group-focus-within/input:text-brand transition-colors">
                            {activeModal === 'TEAM' ? 'Access Code' : 'Admin Passcode'}
                        </label>
                        <div className="relative">
                            <input 
                                type="password" 
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono placeholder:text-white/10 focus:border-brand/50 focus:outline-none transition-all text-sm"
                                placeholder="••••••••••"
                                value={form.passcode}
                                onChange={(e) => setForm({...form, passcode: e.target.value})}
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none"><Lock className="w-4 h-4" /></div>
                        </div>
                    </div>

                    <button 
                        disabled={loading} 
                        className="w-full group/btn relative px-6 py-4 bg-white text-black cut-corners-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-4"
                    >
                        <div className="absolute inset-0 bg-brand translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <span className="font-mono text-xs font-bold uppercase tracking-widest">Verifying...</span>
                            ) : (
                                <>
                                    <span className="font-tech font-bold text-lg uppercase tracking-widest group-hover/btn:text-white transition-colors">Authenticate</span>
                                    <ArrowRight className="w-4 h-4 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                                </>
                            )}
                        </div>
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

function RoleCard({ icon: Icon, title, color, borderColor, bgHover, desc, onClick }) {
    return (
        <button 
            onClick={onClick} 
            className={`group relative flex flex-col justify-between p-6 bg-[#0a0a0a] border border-white/10 ${borderColor} rounded-2xl transition-all hover:-translate-y-1 h-full text-left overflow-hidden`}
        >
            <div className={`absolute inset-0 ${bgHover} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${color} group-hover:scale-110 transition-transform duration-300 border border-white/5 relative z-10`}>
                <Icon className="w-6 h-6" />
            </div>
            
            <div className="relative z-10">
                <h3 className="text-2xl font-tech font-bold text-white uppercase tracking-wide group-hover:translate-x-1 transition-transform">{title}</h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{desc}</span>
                    <Lock className="w-3 h-3 text-white/20 group-hover:text-white transition-colors" />
                </div>
            </div>
        </button>
    )
}