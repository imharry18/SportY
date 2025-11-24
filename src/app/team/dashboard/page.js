'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Wallet, Users, Zap, Shield, LogOut, X, Trophy, Edit3, Save, Upload, Check } from 'lucide-react';
import Toast from '@/components/ui/Toast'; // Ensure you have this component from previous steps

export default function TeamDashboard() {
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type) => setToast({ message: msg, type });

  // 1. Load Session & Fetch Squad Data
  useEffect(() => {
    const session = localStorage.getItem('sporty_team_session');
    if (!session) {
      router.push('/join-auction');
      return;
    }
    
    const parsedTeam = JSON.parse(session);
    setTeam(parsedTeam);

    const fetchSquad = async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${parsedTeam.auctionId}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                const myPlayers = data.data.players.filter(p => p.teamId === parsedTeam.id);
                setSquad(myPlayers);
                
                const myTeamInfo = data.data.teams.find(t => t.id === parsedTeam.id);
                if(myTeamInfo) {
                    setTeam(prev => ({
                        ...prev, 
                        purse: myTeamInfo.purse,
                        name: myTeamInfo.name,
                        logoUrl: myTeamInfo.logoUrl,
                        themeColor: myTeamInfo.themeColor || '#E62E2E',
                        auctionName: data.data.name 
                    }));
                }
            }
        } catch (e) {
            console.error("Failed to fetch squad");
        } finally {
            setLoading(false);
        }
    };

    fetchSquad();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('sporty_team_session');
    router.push('/join-auction');
  };

  const handleUpdateTeam = async (updatedData) => {
    try {
        const res = await fetch('/api/team/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamId: team.id,
                ...updatedData
            })
        });
        const data = await res.json();
        
        if (data.success) {
            setTeam(prev => ({ ...prev, ...updatedData }));
            // Update local storage to persist changes on refresh
            const currentSession = JSON.parse(localStorage.getItem('sporty_team_session') || '{}');
            localStorage.setItem('sporty_team_session', JSON.stringify({ ...currentSession, ...updatedData }));
            
            triggerToast("Team profile updated!");
            setShowEditModal(false);
        } else {
            triggerToast("Update failed", "error");
        }
    } catch (e) {
        triggerToast("Network error", "error");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!team) return null;

  // Dynamic Styles based on Theme Color
  const themeStyle = {
      borderColor: team.themeColor,
      color: team.themeColor
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative">
      
      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-[120] pointer-events-none">
        {toast && <div className="pointer-events-auto"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div>}
      </div>

      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      {/* Dynamic Glow based on Team Color */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-20" style={{ backgroundColor: team.themeColor }}></div>

      {/* --- HEADER --- */}
      <header className="sticky top-20 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl" style={{ borderBottomColor: `${team.themeColor}33` }}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-24 flex items-center justify-between relative">
          
          {/* LEFT: Team Identity */}
          <div className="flex items-center gap-6 z-10">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border bg-white/5 flex items-center justify-center overflow-hidden group shadow-lg" style={{ borderColor: team.themeColor }}>
                {team.logoUrl ? (
                    <Image src={team.logoUrl} fill className="object-cover" alt={team.name} />
                ) : (
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-white/20" />
                )}
                {/* Quick Edit Trigger on Logo Hover */}
                <button 
                    onClick={() => setShowEditModal(true)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Edit3 className="w-4 h-4 text-white" />
                </button>
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-tech font-bold text-white uppercase tracking-tight leading-none">{team.name}</h1>
                    <button onClick={() => setShowEditModal(true)} className="text-white/20 hover:text-white transition-colors">
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: team.themeColor }}></span>
                    Auction Connected
                </p>
            </div>
          </div>

          {/* CENTER: Tournament Name */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center hidden lg:block">
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-3 h-3" style={{ color: team.themeColor }} />
                    <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">Tournament</span>
                </div>
                <h2 className="text-xl font-tech font-bold text-white uppercase tracking-widest">{team.auctionName}</h2>
            </div>
          </div>

          {/* RIGHT: Stats */}
          <div className="flex items-center gap-6 md:gap-8 z-10">
            <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
                    Remaining Purse <Wallet className="w-3 h-3" />
                </div>
                <div className="text-xl md:text-2xl font-mono font-bold" style={{ color: team.themeColor }}>
                    ₹ {team.purse?.toLocaleString('en-IN') || '0'}
                </div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden md:block"></div>

            <button 
                onClick={() => setShowSquadModal(true)}
                className="group flex flex-col items-end cursor-pointer"
            >
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">
                    My Squad <Users className="w-3 h-3" />
                </div>
                <div className="px-4 py-1 bg-white/10 border border-white/10 rounded-lg text-lg md:text-xl font-tech font-bold text-white group-hover:bg-white group-hover:text-black transition-all">
                    Squad {squad.length}
                </div>
            </button>

            <button onClick={handleLogout} className="ml-2 p-2 hover:bg-white/10 rounded-full text-white/20 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 lg:p-10 flex flex-col gap-8 relative z-10">
        <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mx-auto animate-pulse" style={{ borderColor: team.themeColor }}>
                    <Zap className="w-10 h-10" style={{ color: team.themeColor }} />
                </div>
                <div>
                    <h2 className="text-3xl font-tech font-bold text-white uppercase tracking-wide">Auction System Offline</h2>
                    <p className="text-sm text-white/40 font-clean mt-2 max-w-md mx-auto">Waiting for the auctioneer to initialize the bidding sequence.</p>
                </div>
            </div>
        </div>
      </main>

      {/* --- SQUAD MODAL --- */}
      {showSquadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-2xl relative shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <div>
                        <h3 className="text-2xl font-tech font-bold text-white uppercase tracking-wide">My Squad</h3>
                        <p className="text-xs text-white/40 font-mono mt-1">Total Spent: ₹ {squad.reduce((acc, p) => acc + (p.soldPrice || 0), 0).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => setShowSquadModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#050505]">
                    {squad.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 opacity-50">
                            <Users className="w-10 h-10 mb-2" />
                            <p className="text-sm">No players purchased yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {squad.map((player) => (
                                <div key={player.id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/10 rounded-xl hover:border-brand/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center relative overflow-hidden border border-white/5">
                                            {player.image ? <Image src={player.image} fill className="object-cover" alt={player.name} /> : <Users className="w-5 h-5 text-white/20" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg leading-none">{player.name}</h4>
                                            <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">{player.role}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Sold For</p>
                                        <p className="font-mono text-xl font-bold" style={{ color: team.themeColor }}>₹ {(player.soldPrice || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* --- EDIT TEAM MODAL --- */}
      {showEditModal && (
        <EditTeamModal 
            team={team} 
            onClose={() => setShowEditModal(false)} 
            onSave={handleUpdateTeam} 
        />
      )}

    </div>
  );
}

// --- SUB-COMPONENT: EDIT TEAM MODAL ---
function EditTeamModal({ team, onClose, onSave }) {
    const [form, setForm] = useState({ 
        name: team.name, 
        logoUrl: team.logoUrl, 
        themeColor: team.themeColor || '#E62E2E' 
    });

    const colors = [
        '#E62E2E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', 
        '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6'
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setForm(prev => ({ ...prev, logoUrl: e.target.result }));
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl animate-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                
                <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                    <Edit3 className="w-5 h-5 text-brand" /> Edit Team Profile
                </h3>

                <div className="space-y-6">
                    {/* Logo */}
                    <div className="flex flex-col items-center">
                        <label className="relative w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-white/30 transition-colors">
                            {form.logoUrl ? <Image src={form.logoUrl} fill className="object-cover" alt="Logo" /> : <Shield className="w-8 h-8 text-white/20" />}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-5 h-5 text-white" />
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <span className="text-[10px] text-white/40 mt-2 uppercase tracking-widest">Change Emblem</span>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1 block">Team Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 outline-none text-sm font-bold" />
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2 block">Team Theme</label>
                        <div className="grid grid-cols-5 gap-3">
                            {colors.map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setForm({...form, themeColor: c})}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${form.themeColor === c ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                >
                                    {form.themeColor === c && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => onSave(form)} className="w-full py-3.5 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-lg mt-4 flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}