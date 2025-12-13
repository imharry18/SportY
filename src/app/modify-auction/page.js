'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Trophy, Users, Search, Edit3, Trash2, Plus, 
  Save, Upload, DollarSign, MapPin, X, Image as ImageIcon, 
  AlertCircle, ChevronDown, CheckCircle, ArrowLeft,
  Download, Eye, EyeOff, Lock
} from 'lucide-react';
import Image from 'next/image';
import Toast from '@/components/ui/Toast';

export default function ModifyAuction() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const urlId = searchParams.get('id');
  const urlKey = searchParams.get('key');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI States
  const [toast, setToast] = useState(null); 
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  
  const [visibleCodes, setVisibleCodes] = useState({});

  // Data State
  const [data, setData] = useState({
    name: '',
    tagline: '',
    logoUrl: null,
    purse: 50000000,
    bidIncrement: 'Dynamic',
    ground: '',
    teams: [],
    players: []
  });

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const generateCode = () => Math.random().toString(36).slice(-6).toUpperCase();

  // --- 1. FETCH DATA ---
  useEffect(() => {
    if (!urlId) return;
    const fetchData = async () => {
      try {
        // Cache: no-store ensures we see updates immediately
        const res = await fetch(`/api/auction/details?id=${urlId}`, { cache: 'no-store' });
        const result = await res.json();
        
        if (result.success) {
          const safePlayers = result.data.players.map(p => ({
            ...p,
            role: p.role || p.category || 'Player',
            price: p.price || p.basePrice || 0
          }));
          setData({ ...result.data, players: safePlayers });
        } else {
          triggerToast("Failed to load auction data", "error");
        }
      } catch (err) {
        console.error(err);
        triggerToast("Connection error", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [urlId]);

  // --- 2. HANDLERS ---

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setData(prev => ({ ...prev, logoUrl: base64 }));
        triggerToast("Logo updated (Save to persist)");
      } catch (err) {
        triggerToast("Image processing failed", "error");
      }
    }
  };

  // -- Player Management --
  const handleSavePlayer = (playerData) => {
    let updatedPlayers = [...data.players];
    if (editingPlayer) {
      updatedPlayers = updatedPlayers.map(p => p.id === editingPlayer.id ? { ...editingPlayer, ...playerData } : p);
      triggerToast("Player details updated");
    } else {
      updatedPlayers.push({ ...playerData, id: Date.now() });
      triggerToast("New player added to list");
    }
    setData({ ...data, players: updatedPlayers });
    setShowPlayerModal(false);
  };

  const requestDeletePlayer = (id) => {
    setConfirmModal({ id, type: 'player' });
  };

  // -- Team Management --
  const addTeam = () => {
    if (data.teams.length >= 20) {
      triggerToast("Maximum 20 teams allowed", "error");
      return;
    }
    const newTeam = { 
      id: Date.now(), 
      name: `Team ${data.teams.length + 1}`, 
      purse: data.purse, 
      accessCode: generateCode()
    };
    setData(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
    triggerToast("New team added");
  };

  const requestRemoveTeam = (id) => {
    setConfirmModal({ id, type: 'team' });
  };

  const updateTeam = (id, field, value) => {
    const updatedTeams = data.teams.map(t => t.id === id ? { ...t, [field]: value } : t);
    setData({ ...data, teams: updatedTeams });
  };

  const toggleCodeVisibility = (id) => {
    setVisibleCodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadTeamCodes = () => {
    const lines = [
        "================================================",
        ` TEAM CREDENTIALS - ${data.name.toUpperCase()}`,
        "================================================",
        "",
        ...data.teams.map(t => `- ${t.name.padEnd(20)} | Code: ${t.accessCode}`),
        "",
        "================================================",
        "Generated from SportY Console",
        "================================================"
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, '_')}_Codes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Credentials downloaded");
  };

  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').slice(1);
        
        const newPlayers = rows.map((row, index) => {
            const cols = row.split(',');
            if (cols.length < 2) return null;

            let imgRaw = cols[3]?.trim() || '';
            let validImg = (imgRaw.startsWith('http') || imgRaw.startsWith('/')) ? imgRaw : '';

            return {
                id: Date.now() + index, 
                name: cols[0]?.trim(),
                role: cols[1]?.trim() || 'Player',
                price: cols[2]?.trim() || data.purse || 0,
                image: validImg
            };
        }).filter(Boolean);
        
        setData(prev => ({ ...prev, players: [...prev.players, ...newPlayers] }));
        triggerToast(`Successfully imported ${newPlayers.length} players`);
    };
    reader.readAsText(file);
  };

  // Shared Confirm Delete
  const confirmDelete = () => {
    if (confirmModal.type === 'player') {
      setData(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== confirmModal.id)
      }));
      triggerToast("Player removed");
    } 
    else if (confirmModal.type === 'team') {
      setData(prev => ({
        ...prev,
        teams: prev.teams.filter(t => t.id !== confirmModal.id)
      }));
      triggerToast("Team removed");
    }
    setConfirmModal(null);
  };

  const handleGlobalSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auction/update', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...data, 
            id: urlId, 
            adminKey: urlKey 
        }) 
      });
      
      const result = await res.json();

      if (res.ok) {
        triggerToast("System updated successfully!");
        // Small delay to let user see toast before refresh
        setTimeout(() => window.location.reload(), 1500);
      } else {
        triggerToast(result.message || "Update failed", "error");
      }
    } catch (e) {
      console.error(e);
      triggerToast("Network error. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span className="text-brand font-mono text-xs uppercase tracking-widest">Loading Configuration...</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-10 px-6 relative">
      
      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toast && (
          <div className="pointer-events-auto">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          </div>
        )}
      </div>

      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

      {/* HEADER: Changed top-4 to top-20 to sit below Navbar */}
      <header className="sticky top-20 z-40 w-full max-w-6xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-10 flex justify-between items-center shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-xl font-tech font-bold text-white uppercase tracking-tight">Modify Auction</h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ID: {urlId}</p>
                </div>
            </div>
        </div>
        <button 
            onClick={handleGlobalSave} 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-brand-glow transition-all shadow-[0_0_20px_rgba(230,46,46,0.2)] disabled:opacity-50"
        >
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </header>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-6xl space-y-12 pb-20">
        
        {/* SECTION 1: IDENTITY */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-brand font-mono text-xs font-bold">01.</span>
                <h2 className="text-2xl font-tech font-bold text-white uppercase">Tournament Identity</h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Logo Upload */}
                <div className="lg:col-span-4 flex flex-col items-center text-center gap-6 border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-8">
                    <label className="relative group w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer shadow-lg">
                        {data.logoUrl ? (
                            <Image src={data.logoUrl} fill className="object-cover" alt="Logo" />
                        ) : (
                            <Trophy className="w-12 h-12 text-white/20" />
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 className="w-6 h-6 text-white" />
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                    </label>
                    <div className="w-full space-y-3">
                        <input type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} className="bg-transparent text-2xl font-bold text-white uppercase text-center outline-none border-b border-white/10 focus:border-brand/50 w-full pb-1 transition-colors placeholder:text-white/20" placeholder="Tournament Name" />
                        <input type="text" value={data.tagline} onChange={(e) => setData({...data, tagline: e.target.value})} className="bg-transparent text-xs font-mono text-brand text-center outline-none border-b border-white/10 focus:border-brand/50 w-full pb-1 transition-colors placeholder:text-brand/30 uppercase tracking-widest" placeholder="Tagline" />
                    </div>
                </div>

                {/* Rules Inputs */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-center">
                    <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Global Team Purse</label>
                        <div className="flex items-center bg-[#050505] border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand/50 transition-colors">
                            <DollarSign className="w-4 h-4 text-brand mr-3" />
                            <input type="number" value={data.purse} onChange={(e) => setData({...data, purse: e.target.value})} className="bg-transparent w-full outline-none text-white font-mono text-lg" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Venue / Ground</label>
                        <div className="flex items-center bg-[#050505] border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand/50 transition-colors">
                            <MapPin className="w-4 h-4 text-white/20 mr-3" />
                            <input type="text" value={data.ground} onChange={(e) => setData({...data, ground: e.target.value})} className="bg-transparent w-full outline-none text-white font-clean" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Bid Logic</label>
                        <div className="relative">
                            <select value={data.bidIncrement} onChange={(e) => setData({...data, bidIncrement: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none appearance-none cursor-pointer">
                                <option>Dynamic (Auto-Scaling)</option>
                                <option>Static (Fixed Amount)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION 2: FRANCHISES */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex justify-between items-end mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-brand font-mono text-xs font-bold">02.</span>
                    <h2 className="text-2xl font-tech font-bold text-white uppercase">Franchises</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={downloadTeamCodes} className="flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors text-white">
                        <Download className="w-3 h-3" /> Get Codes
                    </button>
                    <button onClick={addTeam} className="flex items-center gap-2 text-xs font-bold bg-white text-black hover:bg-gray-200 border border-white px-4 py-2 rounded-lg transition-colors">
                        <Plus className="w-3 h-3" /> Add Team
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.teams.map((team, i) => (
                    <div key={team.id} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 flex flex-col gap-4 hover:border-brand/30 transition-all group relative overflow-hidden">
                        
                        <button 
                            onClick={() => requestRemoveTeam(team.id)} 
                            className="absolute top-2 right-2 p-1.5 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors z-20"
                            title="Remove Team"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-4 pr-8">
                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white/20 font-mono text-xs border border-white/5">
                                {(i+1).toString().padStart(2,'0')}
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] text-white/30 uppercase tracking-wider">Name</label>
                                <input type="text" value={team.name} onChange={(e) => updateTeam(team.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/10 focus:border-white outline-none text-white font-bold text-sm pb-1 transition-colors" />
                            </div>
                            <div className="w-24 space-y-1">
                                <label className="text-[9px] text-brand/60 uppercase tracking-wider">Purse</label>
                                <input type="number" value={team.purse} onChange={(e) => updateTeam(team.id, 'purse', e.target.value)} className="w-full bg-transparent border-b border-white/10 focus:border-brand outline-none text-brand font-mono text-sm pb-1 text-right transition-colors" />
                            </div>
                        </div>

                        <div className="flex items-center bg-[#050505] border border-white/5 rounded-lg px-3 py-2">
                            <Lock className="w-3 h-3 text-white/20 mr-3" />
                            <div className="flex-1 font-mono text-xs tracking-widest text-white/60">
                                {visibleCodes[team.id] ? team.accessCode : '••••••'}
                            </div>
                            <button 
                                onClick={() => toggleCodeVisibility(team.id)}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                {visibleCodes[team.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </section>

        {/* SECTION 3: PLAYER ROSTER */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2 self-start md:self-center">
                    <span className="text-brand font-mono text-xs font-bold">03.</span>
                    <h2 className="text-2xl font-tech font-bold text-white uppercase">Player Roster</h2>
                    <span className="ml-2 px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white/50">{data.players.length}</span>
                </div>
                
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="text" placeholder="Search Roster..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-brand/50 outline-none" />
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 cursor-pointer transition-colors text-white whitespace-nowrap">
                        <Upload className="w-3 h-3" /> CSV
                        <input type="file" className="hidden" accept=".csv" onChange={handleCsvImport} />
                    </label>
                    <button onClick={() => { setEditingPlayer(null); setShowPlayerModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors whitespace-nowrap">
                        <Plus className="w-3 h-3" /> New
                    </button>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden min-h-[400px]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white/30 text-[10px] uppercase font-bold backdrop-blur-md">
                        <tr>
                            <th className="px-8 py-4">Player Identity</th>
                            <th className="px-8 py-4">Category</th>
                            <th className="px-8 py-4 text-right">Base Price</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.players
                            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((player) => (
                            <tr key={player.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden relative border border-white/5 group-hover:border-white/20 transition-colors">
                                        {player.image ? (
                                            <Image src={player.image} fill className="object-cover" alt={player.name} />
                                        ) : (
                                            <Users className="w-5 h-5 text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                    </div>
                                    <span className="font-bold text-white text-base">{player.name}</span>
                                </td>
                                <td className="px-8 py-4 text-white/50">{player.role}</td>
                                <td className="px-8 py-4 text-right font-mono text-brand">₹{parseInt(player.price).toLocaleString()}</td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingPlayer(player); setShowPlayerModal(true); }} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => requestDeletePlayer(player.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {confirmModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase mb-2">Delete {confirmModal.type}?</h3>
                <p className="text-white/50 text-xs mb-6">This action cannot be undone. Are you sure you want to remove this {confirmModal.type}?</p>
                <div className="flex gap-3">
                    <button onClick={() => setConfirmModal(null)} className="flex-1 py-2.5 bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-red-500 transition-colors">Delete</button>
                </div>
            </div>
        </div>
      )}

      {/* --- FULL PLAYER EDIT MODAL --- */}
      {showPlayerModal && (
        <PlayerModal 
            player={editingPlayer} 
            onClose={() => setShowPlayerModal(false)} 
            onSave={handleSavePlayer} 
        />
      )}

    </div>
  );
}

function PlayerModal({ player, onClose, onSave }) {
    const [form, setForm] = useState(player || { 
        name: '', 
        role: 'All-Rounder', 
        price: 1000000, 
        image: '' 
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl animate-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                
                <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                    {player ? <Edit3 className="w-5 h-5 text-brand" /> : <Plus className="w-5 h-5 text-brand" />}
                    {player ? 'Edit Player' : 'New Player'}
                </h3>

                <div className="space-y-5">
                    <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1 block">Full Name</label>
                        <input 
                            type="text" 
                            value={form.name} 
                            onChange={(e) => setForm({...form, name: e.target.value})} 
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none text-sm" 
                            placeholder="e.g. Virat Kohli" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1 block">Role</label>
                            <select 
                                value={form.role} 
                                onChange={(e) => setForm({...form, role: e.target.value})} 
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none text-sm appearance-none cursor-pointer"
                            >
                                <option>Batsman</option>
                                <option>Bowler</option>
                                <option>All-Rounder</option>
                                <option>Wicket Keeper</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1 block">Base Price</label>
                            <input 
                                type="number" 
                                value={form.price} 
                                onChange={(e) => setForm({...form, price: e.target.value})} 
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none text-sm" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1 block">Image Link (URL)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input 
                                type="text" 
                                value={form.image} 
                                onChange={(e) => setForm({...form, image: e.target.value})} 
                                placeholder="https://..." 
                                className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand/50 outline-none text-sm" 
                            />
                        </div>
                    </div>

                    <button onClick={() => onSave(form)} className="w-full py-3.5 bg-brand text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-glow transition-all shadow-lg mt-2 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Confirm Changes
                    </button>
                </div>
            </div>
        </div>
    );
}