'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Trophy, Users, Search, Edit3, Trash2, Plus, 
  Save, Upload, DollarSign, MapPin, X, Check, Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';

export default function ModifyAuction() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const urlId = searchParams.get('id');
  const urlKey = searchParams.get('key');

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general'); // general, teams, players
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null); // null = adding new
  const [searchQuery, setSearchQuery] = useState('');

  // Main Data State
  const [data, setData] = useState({
    name: '',
    tagline: '',
    logoUrl: null, // For preview
    purse: 50000000,
    bidIncrement: 'Dynamic',
    ground: '',
    teams: [],
    players: []
  });

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    if (!urlId) return;
    
    // Simulate Fetching Data (Replace with actual fetch to /api/auction/details)
    // const fetchData = async () => { ... }
    // For UI Demo, we load mock data if fetch fails or is not implemented yet
    setData({
        name: "Summer Cup '25",
        tagline: "Where Legends Rise",
        purse: 50000000,
        bidIncrement: 'Dynamic',
        ground: 'Central Stadium',
        teams: Array.from({length: 8}).map((_, i) => ({ id: i, name: `Team ${i+1}`, purse: 50000000 })),
        players: [
            { id: 101, name: "Virat K.", role: "Batsman", price: 2000000, image: "/player1.png" },
            { id: 102, name: "Rohit S.", role: "Batsman", price: 2000000, image: "/player2.png" },
            { id: 103, name: "Bumrah", role: "Bowler", price: 1500000, image: "/player3.png" },
        ]
    });
    setLoading(false);
  }, [urlId]);

  // --- HANDLERS ---

  // Player Handlers
  const handleSavePlayer = (player) => {
    let updatedPlayers = [...data.players];
    if (editingPlayer) {
        // Edit Existing
        updatedPlayers = updatedPlayers.map(p => p.id === player.id ? player : p);
    } else {
        // Add New
        updatedPlayers.push({ ...player, id: Date.now() });
    }
    setData({ ...data, players: updatedPlayers });
    setShowPlayerModal(false);
  };

  const handleDeletePlayer = (id) => {
    if(confirm("Are you sure you want to delete this player?")) {
        setData({ ...data, players: data.players.filter(p => p.id !== id) });
    }
  };

  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Simple CSV parser logic here (same as setup page)
    alert("CSV Import logic triggered for: " + file.name);
  };

  // Team Handlers
  const addTeam = () => {
    if (data.teams.length >= 20) return alert("Max 20 teams allowed.");
    const newTeam = { id: Date.now(), name: `Team ${data.teams.length + 1}`, purse: data.purse };
    setData({ ...data, teams: [...data.teams, newTeam] });
  };

  const updateTeam = (id, field, value) => {
    const updatedTeams = data.teams.map(t => t.id === id ? { ...t, [field]: value } : t);
    setData({ ...data, teams: updatedTeams });
  };

  // Save All
  const handleGlobalSave = async () => {
    setLoading(true);
    // await fetch('/api/auction/update', { method: 'POST', body: JSON.stringify({ ...data, id: urlId, key: urlKey }) })
    setTimeout(() => {
        setLoading(false);
        alert("Configuration Updated Successfully!");
    }, 1000);
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-brand">Loading Configuration...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-10 px-6 relative overflow-x-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-6">
        <div className="flex items-center gap-6">
            {/* Logo Edit */}
            <div className="relative group w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer">
                {data.logoUrl ? <Image src={data.logoUrl} fill className="object-cover" /> : <Trophy className="w-8 h-8 text-white/20" />}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="w-5 h-5 text-white" />
                </div>
            </div>
            <div>
                <input 
                    type="text" 
                    value={data.name} 
                    onChange={(e) => setData({...data, name: e.target.value})}
                    className="bg-transparent text-4xl font-tech font-bold text-white uppercase outline-none placeholder:text-white/20 w-full"
                    placeholder="TOURNAMENT NAME"
                />
                <input 
                    type="text" 
                    value={data.tagline} 
                    onChange={(e) => setData({...data, tagline: e.target.value})}
                    className="bg-transparent text-sm font-clean text-brand uppercase tracking-widest outline-none placeholder:text-brand/30 w-full mt-1"
                    placeholder="ENTER TAGLINE"
                />
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 rounded text-xs font-bold uppercase tracking-wider">Cancel</button>
            <button onClick={handleGlobalSave} className="flex items-center gap-2 px-8 py-3 bg-brand text-white font-bold uppercase tracking-widest rounded hover:bg-brand-glow transition-all shadow-[0_0_20px_rgba(230,46,46,0.2)]">
                <Save className="w-4 h-4" /> Save Changes
            </button>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="w-full max-w-6xl mb-8 flex gap-2">
        {['general', 'teams', 'players'].map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${activeTab === tab ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-transparent hover:bg-white/5'}`}
            >
                {tab} Config
            </button>
        ))}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 min-h-[500px]">
        
        {/* 1. GENERAL TAB */}
        {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Global Team Purse</label>
                    <div className="flex items-center bg-[#050505] border border-white/10 rounded-lg px-4 py-3">
                        <DollarSign className="w-4 h-4 text-brand mr-3" />
                        <input 
                            type="number" 
                            value={data.purse}
                            onChange={(e) => setData({...data, purse: e.target.value})}
                            className="bg-transparent w-full outline-none text-white font-mono" 
                        />
                    </div>
                    <p className="text-[10px] text-white/20">Changing this updates the default purse for new teams.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Ground Name</label>
                    <div className="flex items-center bg-[#050505] border border-white/10 rounded-lg px-4 py-3">
                        <MapPin className="w-4 h-4 text-white/20 mr-3" />
                        <input 
                            type="text" 
                            value={data.ground}
                            onChange={(e) => setData({...data, ground: e.target.value})}
                            className="bg-transparent w-full outline-none text-white" 
                        />
                    </div>
                </div>
            </div>
        )}

        {/* 2. TEAMS TAB */}
        {activeTab === 'teams' && (
            <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white uppercase">Franchise List ({data.teams.length})</h3>
                    <button onClick={addTeam} className="flex items-center gap-2 text-xs font-bold text-brand hover:text-white transition-colors">
                        <Plus className="w-4 h-4" /> Add Team
                    </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {data.teams.map((team, i) => (
                        <div key={team.id} className="flex items-center gap-4 bg-[#050505] p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-white/20 font-mono text-xs w-6">{(i+1).toString().padStart(2,'0')}</span>
                            
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] text-white/30 uppercase tracking-wider">Team Name</label>
                                <input 
                                    type="text" 
                                    value={team.name}
                                    onChange={(e) => updateTeam(team.id, 'name', e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 focus:border-brand/50 outline-none text-white text-sm pb-1"
                                />
                            </div>

                            <div className="w-40 space-y-1">
                                <label className="text-[9px] text-brand/60 uppercase tracking-wider">Custom Purse</label>
                                <input 
                                    type="number" 
                                    value={team.purse}
                                    onChange={(e) => updateTeam(team.id, 'purse', e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 focus:border-brand/50 outline-none text-brand font-mono text-sm pb-1 text-right"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 3. PLAYERS TAB */}
        {activeTab === 'players' && (
            <div className="animate-in fade-in h-full flex flex-col">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                            type="text" 
                            placeholder="Search Player..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:border-brand/50 outline-none"
                        />
                    </div>
                    <div className="flex gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 cursor-pointer transition-colors text-white">
                            <Upload className="w-3 h-3" /> Import CSV
                            <input type="file" className="hidden" accept=".csv" onChange={handleCsvImport} />
                        </label>
                        <button 
                            onClick={() => { setEditingPlayer(null); setShowPlayerModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-brand-glow transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add Player
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] rounded-lg border border-white/5">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-white/30 text-[10px] uppercase font-bold sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="px-6 py-3">Player Details</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Base Price</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.players
                                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((player) => (
                                <tr key={player.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3 flex items-center gap-4">
                                        <div className="w-8 h-8 rounded bg-white/10 overflow-hidden relative">
                                            {player.image && <Image src={player.image} fill className="object-cover" alt={player.name} />}
                                        </div>
                                        <span className="font-bold text-white">{player.name}</span>
                                    </td>
                                    <td className="px-6 py-3 text-white/50">{player.role}</td>
                                    <td className="px-6 py-3 text-right font-mono text-brand">₹{player.price}</td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingPlayer(player); setShowPlayerModal(true); }} className="p-1.5 hover:bg-white/10 rounded text-blue-400"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeletePlayer(player.id)} className="p-1.5 hover:bg-white/10 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>

      {/* --- PLAYER MODAL --- */}
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

// --- SUB-COMPONENT: PLAYER MODAL ---
function PlayerModal({ player, onClose, onSave }) {
    const [form, setForm] = useState(player || { name: '', role: 'All-Rounder', price: 1000000, image: '' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                
                <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                    {player ? <Edit3 className="w-5 h-5 text-brand" /> : <Plus className="w-5 h-5 text-brand" />}
                    {player ? 'Edit Player' : 'Add Custom Player'}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Full Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand/50 outline-none text-sm" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Role</label>
                            <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand/50 outline-none text-sm appearance-none">
                                <option>Batsman</option>
                                <option>Bowler</option>
                                <option>All-Rounder</option>
                                <option>Wicket Keeper</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Base Price</label>
                            <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand/50 outline-none text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Image URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input type="text" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand/50 outline-none text-sm" />
                        </div>
                    </div>

                    <button onClick={() => onSave(form)} className="w-full py-3 bg-brand text-white font-bold uppercase tracking-widest rounded hover:bg-brand-glow transition-colors mt-2">
                        Save Player
                    </button>
                </div>
            </div>
        </div>
    );
}