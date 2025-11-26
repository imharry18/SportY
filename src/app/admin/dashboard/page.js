'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Gavel, Users, Database, Play, Pause, SkipForward, SkipBack, CheckCircle, 
  XCircle, RotateCcw, Grid, Search, Edit3, Trash2, Plus, Shield, UserPlus,
  Zap, GripVertical, Check
} from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function AdminDashboard() {
  const router = useRouter();
  
  // -- STATE --
  const [activeTab, setActiveTab] = useState('CONSOLE'); 
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [toast, setToast] = useState(null);

  // Data
  const [auction, setAuction] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]); 
  
  // Flux State
  const [showFluxModal, setShowFluxModal] = useState(false);
  const [fluxSelection, setFluxSelection] = useState([]);
  
  // Live Auction State
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null); 
  const [isPaused, setIsPaused] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(null);

  const triggerToast = (msg, type='success') => setToast({ message: msg, type });
  const formatPrice = (p) => p >= 10000000 ? `₹ ${(p/10000000).toFixed(2)} Cr` : p >= 100000 ? `₹ ${(p/100000).toFixed(2)} L` : `₹ ${p.toLocaleString()}`;

  // -- 1. FETCH DATA --
  useEffect(() => {
    const fetchData = async () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id'); 

        if(!id) {
            setLoading(false); 
            return; 
        }

        try {
            const res = await fetch(`/api/auction/details?id=${id}`, { cache: 'no-store' });
            const data = await res.json();
            if(data.success) {
                setAuction(data.data);
                setTeams(data.data.teams);
                // Ensure players are sorted by order
                setPlayers(data.data.players);
                
                // Set initial player only once on first load
                if(loading) {
                    const firstUnsold = data.data.players.findIndex(p => !p.isSold);
                    if (firstUnsold !== -1) setCurrentPlayerIndex(firstUnsold);
                }
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [refreshKey]);

  const currentPlayer = players[currentPlayerIndex];

  // --- DRAG AND DROP HANDLERS ---
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    const copyListItems = [...players];
    const dragItemContent = copyListItems[dragItem.current];
    
    // Remove and Insert
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    // Update Local State immediately
    dragItem.current = null;
    dragOverItem.current = null;
    setPlayers(copyListItems);

    // Prepare Payload for API (Update Orders)
    const updates = copyListItems.map((p, index) => ({ id: p.id, order: index }));
    
    // Call API
    await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
    });
    triggerToast("Sequence Updated");
  };

  // --- FLUX DIVIDE HANDLERS ---
  const openFluxTool = async () => {
      setShowFluxModal(true);
      // Activate Flux Mode for Spectators
      const params = new URLSearchParams(window.location.search);
      await fetch('/api/admin/flux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ACTIVATE', auctionId: params.get('id') })
      });
  };

  const toggleFluxPlayer = async (id) => {
      const isSelected = fluxSelection.includes(id);
      let newSelection = [];
      
      if (isSelected) {
          newSelection = fluxSelection.filter(pid => pid !== id);
      } else {
          // Limit selection to team count
          if (fluxSelection.length >= teams.length) {
              return triggerToast(`Max ${teams.length} players (1 per team)`, "error");
          }
          newSelection = [...fluxSelection, id];
          
          // Trigger Silhouette on Spectator Screen for the newly clicked player
          const params = new URLSearchParams(window.location.search);
          await fetch('/api/admin/flux', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'FOCUS', auctionId: params.get('id'), focusPlayerId: id })
          });
      }
      setFluxSelection(newSelection);
  };

  const submitFlux = async () => {
      if (fluxSelection.length === 0) return;
      const params = new URLSearchParams(window.location.search);
      
      triggerToast("Dividing Flux...");
      const res = await fetch('/api/admin/flux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              action: 'EXECUTE', 
              auctionId: params.get('id'),
              playerIds: fluxSelection
          })
      });

      if (res.ok) {
          triggerToast("Unboxing initiated!");
          setShowFluxModal(false);
          setFluxSelection([]);
          setRefreshKey(k => k + 1);
      }
  };

  const closeFlux = async () => {
      setShowFluxModal(false);
      setFluxSelection([]);
      const params = new URLSearchParams(window.location.search);
      await fetch('/api/admin/flux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'RESET', auctionId: params.get('id') })
      });
  };

  // --- ACTIONS (Bid/Sell/Undo) ---
  const handleBid = (teamId) => {
    if (isPaused) return triggerToast("Auction is Paused!", "error");
    if (!currentPlayer || currentPlayer.isSold) return triggerToast("Player already sold/invalid", "error");

    let nextBid = 0;
    if (currentBid === 0) {
        nextBid = currentPlayer.price; 
    } else {
        let increment = currentBid < 10000000 ? 500000 : 2000000; 
        nextBid = currentBid + increment;
    }

    const team = teams.find(t => t.id === teamId);
    if (team.purse < nextBid) {
        return triggerToast(`Team ${team.name} has insufficient purse!`, "error");
    }

    setCurrentBid(nextBid);
    setCurrentBidder(teamId);
    triggerToast(`Bid: ${formatPrice(nextBid)} by ${team.name}`);
  };

  const handleSell = async () => {
    if (!currentBidder || !currentPlayer) return;
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'SELL',
            auctionId: id,
            playerId: currentPlayer.id,
            teamId: currentBidder,
            amount: currentBid
        })
    });

    if (res.ok) {
        triggerToast("PLAYER SOLD!");
        setCurrentBid(0);
        setCurrentBidder(null);
        setRefreshKey(k => k + 1); 
    } else {
        triggerToast("Error selling player", "error");
    }
  };

  const handleUndo = async () => {
      if (!currentPlayer.isSold) {
          setCurrentBid(0);
          setCurrentBidder(null);
          triggerToast("Bid State Reset");
          return;
      }

      if(!confirm(`Undo sale of ${currentPlayer.name}? Money will be refunded.`)) return;

      const res = await fetch('/api/admin/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              action: 'UNDO_SELL',
              playerId: currentPlayer.id
          })
      });

      if (res.ok) {
          triggerToast("Sale Undone successfully");
          setRefreshKey(k => k + 1);
      } else {
          triggerToast("Failed to undo", "error");
      }
  };

  const handleNext = () => {
    if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(prev => prev + 1);
        setCurrentBid(0);
        setCurrentBidder(null);
    }
  };

  const handlePrev = () => {
    if (currentPlayerIndex > 0) {
        setCurrentPlayerIndex(prev => prev - 1);
        setCurrentBid(0);
        setCurrentBidder(null);
    }
  };

  // --- CRUD PLAYERS ---
  const handleSavePlayer = async (playerData) => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const action = editingPlayer ? 'EDIT_PLAYER' : 'ADD_PLAYER';
    const pId = editingPlayer ? editingPlayer.id : null;

    const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action,
            auctionId: id,
            playerId: pId,
            playerData
        })
    });

    if(res.ok) {
        triggerToast(editingPlayer ? "Player Updated" : "Player Added");
        setShowPlayerModal(false);
        setRefreshKey(k => k + 1);
    }
  };

  const handleDelete = async (id) => {
      if(!confirm("Delete player?")) return;
      await fetch('/api/admin/action', {
          method: 'POST',
          body: JSON.stringify({ action: 'DELETE_PLAYER', playerId: id })
      });
      setRefreshKey(k => k + 1);
      triggerToast("Player Deleted");
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-brand">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
        
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">{toast && <div className="pointer-events-auto"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div>}</div>

        {/* --- NAVBAR --- */}
        <header className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <h1 className="font-tech font-bold text-xl uppercase tracking-widest text-white">Admin <span className="text-brand">Console</span></h1>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                <span className="text-xs text-white/40 font-mono hidden md:inline-block">{auction?.name}</span>
            </div>
            <div className="flex bg-white/5 p-1 rounded-lg">
                {[
                    { id: 'CONSOLE', icon: Gavel, label: 'Live Console' },
                    { id: 'TEAMS', icon: Users, label: 'Teams' },
                    { id: 'MANAGE', icon: Database, label: 'Database' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        <tab.icon className="w-3 h-3" /> <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
            
            {/* === TAB 1: LIVE CONSOLE === */}
            {activeTab === 'CONSOLE' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    
                    {/* LEFT: Player Card & Controls (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        
                        {/* Power Tool Bar */}
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-500" />
                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Power Tools</span>
                            </div>
                            <button 
                                onClick={openFluxTool}
                                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all"
                            >
                                FluxDivide
                            </button>
                        </div>

                        {/* Player Card */}
                        <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${currentPlayer?.isSold ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-green-500/50 text-green-500 bg-green-500/10'}`}>
                                {currentPlayer?.isSold ? 'SOLD' : (isPaused ? 'Paused' : 'Live')}
                            </div>

                            <div className="w-48 h-48 rounded-2xl bg-white/5 border border-white/10 mb-6 relative overflow-hidden group">
                                {currentPlayer?.image ? (
                                    <Image src={currentPlayer.image} fill className="object-cover" alt="Player" />
                                ) : (
                                    <Users className="w-12 h-12 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                            </div>

                            <h2 className="text-3xl font-tech font-bold text-white uppercase tracking-tight">{currentPlayer?.name || "End of List"}</h2>
                            <p className="text-brand font-mono text-sm mt-1 uppercase tracking-widest">{currentPlayer?.role}</p>
                            
                            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/30 uppercase font-bold">Base Price</p>
                                    <p className="text-xl font-mono text-white/60">{formatPrice(currentPlayer?.price || 0)}</p>
                                </div>
                                <div className="bg-brand/10 p-3 rounded-xl border border-brand/20">
                                    <p className="text-[10px] text-brand/60 uppercase font-bold">Current Bid</p>
                                    <p className="text-xl font-mono text-brand font-bold">
                                        {currentPlayer?.isSold ? formatPrice(currentPlayer.soldPrice) : formatPrice(currentBid)}
                                    </p>
                                </div>
                            </div>

                            {(currentBidder || currentPlayer?.isSold) && (
                                <div className="mt-4 w-full bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                                    <span className="text-[10px] text-white/40 uppercase font-bold">
                                        {currentPlayer?.isSold ? 'Sold To:' : 'Winning:'}
                                    </span>
                                    <span className="text-sm font-bold text-white uppercase">
                                        {teams.find(t => t.id === (currentPlayer?.teamId || currentBidder))?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Control Bar */}
                        <div className="grid grid-cols-5 gap-2">
                            <button onClick={handlePrev} disabled={currentPlayerIndex === 0} className="p-4 rounded-xl border border-white/10 bg-[#0a0a0a] text-white hover:bg-white/5 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-30">
                                <SkipBack className="w-5 h-5" />
                                <span className="text-[9px] font-bold uppercase">Prev</span>
                            </button>
                            <button onClick={() => setIsPaused(!isPaused)} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${isPaused ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'}`}>
                                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                                <span className="text-[9px] font-bold uppercase">{isPaused ? "Resume" : "Pause"}</span>
                            </button>
                            <button onClick={handleUndo} className="p-4 rounded-xl border border-red-900/30 bg-red-950/20 text-red-400 hover:bg-red-900/40 flex flex-col items-center justify-center gap-2 transition-all">
                                <RotateCcw className="w-5 h-5" />
                                <span className="text-[9px] font-bold uppercase">Undo</span>
                            </button>
                            <button onClick={handleSell} disabled={!currentBidder || currentPlayer?.isSold} className="p-4 rounded-xl border border-green-500 bg-green-600 text-white hover:bg-green-500 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:grayscale">
                                <Gavel className="w-5 h-5" />
                                <span className="text-[9px] font-bold uppercase">Sold</span>
                            </button>
                            <button onClick={handleNext} disabled={currentPlayerIndex === players.length - 1} className="p-4 rounded-xl border border-white/10 bg-white text-black hover:bg-gray-200 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-30">
                                <SkipForward className="w-5 h-5" />
                                <span className="text-[9px] font-bold uppercase">Next</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Bidding Grid (8 Cols) */}
                    <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-tech font-bold text-white uppercase flex items-center gap-2">
                                <Grid className="w-4 h-4 text-brand" /> Team Bidding Terminals
                            </h3>
                            <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Admin Control Active</div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {teams.map((team) => (
                                <button 
                                    key={team.id}
                                    onClick={() => handleBid(team.id)}
                                    disabled={team.purse < (currentBid || currentPlayer?.price) || currentPlayer?.isSold}
                                    className={`relative p-4 rounded-xl border flex flex-col items-center gap-3 transition-all active:scale-95 group ${currentBidder === team.id ? 'bg-brand border-brand' : 'bg-white/5 border-white/10 hover:border-white/30'} disabled:opacity-30 disabled:pointer-events-none`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center overflow-hidden border border-white/10">
                                        {team.logoUrl ? <Image src={team.logoUrl} width={48} height={48} alt={team.name} /> : <Shield className="w-6 h-6 text-white/20" />}
                                    </div>
                                    <div className="text-center">
                                        <h4 className={`text-sm font-bold uppercase leading-tight ${currentBidder === team.id ? 'text-white' : 'text-white/80'}`}>{team.name}</h4>
                                        <p className={`text-[10px] font-mono mt-1 ${currentBidder === team.id ? 'text-white/80' : 'text-brand'}`}>Purse: {formatPrice(team.purse)}</p>
                                    </div>
                                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${currentBidder === team.id ? 'bg-white animate-ping' : 'bg-transparent'}`}></div>
                                    
                                    <div className={`w-full py-1.5 rounded text-[10px] font-bold uppercase tracking-widest mt-1 ${currentBidder === team.id ? 'bg-white text-brand' : 'bg-white/10 text-white/40 group-hover:bg-brand group-hover:text-white'} transition-colors`}>
                                        {currentBidder === team.id ? 'Leading' : 'Place Bid'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* === TAB 2: TEAMS OVERVIEW === */}
            {activeTab === 'TEAMS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in">
                    {teams.map(team => (
                        <div key={team.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-brand/30 transition-all cursor-pointer" onClick={() => setShowTeamModal(team)}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {team.logoUrl ? <Image src={team.logoUrl} width={56} height={56} alt="logo" /> : <Shield className="w-6 h-6 text-white/20" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white uppercase">{team.name}</h3>
                                        <p className="text-xs text-white/40 font-mono">{team.accessCode}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/30 uppercase font-bold">Purse</p>
                                    <p className="text-lg font-mono text-brand font-bold">{formatPrice(team.purse)}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center text-xs text-white/60">
                                <span>Squad Size</span>
                                <span className="font-mono text-white font-bold">{players.filter(p => p.teamId === team.id).length} / 15</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* === TAB 3: DATABASE (Manage & Reorder Players) === */}
            {activeTab === 'MANAGE' && (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full animate-in fade-in">
                    <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input 
                                type="text" 
                                placeholder="Search Database..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-brand/50 outline-none"
                            />
                        </div>
                        <button onClick={() => { setEditingPlayer(null); setShowPlayerModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase hover:bg-gray-200">
                            <UserPlus className="w-4 h-4" /> Add Player
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 space-y-2">
                        {players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p, index) => (
                            <div 
                                key={p.id}
                                draggable={!searchQuery} // Disable drag when searching
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                className={`flex items-center justify-between p-3 rounded-lg border border-white/5 ${p.isSold ? 'bg-white/[0.02] opacity-50' : 'bg-[#111] hover:bg-white/[0.05] cursor-grab active:cursor-grabbing'}`}
                            >
                                <div className="flex items-center gap-4">
                                    {!searchQuery && <div className="p-2 text-white/20"><GripVertical className="w-4 h-4" /></div>}
                                    <div className="w-8 h-8 bg-white/10 rounded overflow-hidden relative">
                                        {p.image ? <Image src={p.image} fill className="object-cover" alt="img" /> : <Users className="w-4 h-4 m-2 text-white/20"/>}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{p.name}</div>
                                        <div className="text-[10px] text-white/40 font-mono uppercase">{p.role} • {formatPrice(p.price)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-[10px] font-mono text-white/20">SEQ: {index + 1}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingPlayer(p); setShowPlayerModal(true); }} className="p-1.5 bg-white/10 hover:bg-white hover:text-black rounded transition-colors"><Edit3 className="w-3 h-3" /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </main>

        {/* --- MODALS --- */}
        
        {/* FLUX MODAL */}
        {showFluxModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
               <div className="bg-[#0f0f11] border border-purple-500/30 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col relative shadow-[0_0_50px_rgba(147,51,234,0.1)]">
                   <div className="p-6 border-b border-white/10 flex justify-between items-center">
                       <div>
                           <h2 className="text-2xl font-tech font-bold text-white uppercase flex items-center gap-3">
                               <Zap className="w-6 h-6 text-purple-500" /> Flux Divide
                           </h2>
                           <p className="text-xs text-white/40 mt-1">Select {teams.length} players to randomly distribute.</p>
                       </div>
                       <button onClick={closeFlux} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white"><XCircle className="w-6 h-6" /></button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                       {players.filter(p => !p.isSold).map(p => {
                           const isSelected = fluxSelection.includes(p.id);
                           return (
                               <div 
                                   key={p.id} 
                                   onClick={() => toggleFluxPlayer(p.id)}
                                   className={`relative p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                               >
                                   {isSelected && <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                                   <div className="w-full aspect-square bg-black/30 rounded-lg mb-3 overflow-hidden relative">
                                       {p.image ? <Image src={p.image} fill className="object-cover" alt={p.name} /> : <Users className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"/>}
                                   </div>
                                   <div className="text-center">
                                       <div className="font-bold text-sm text-white truncate">{p.name}</div>
                                       <div className="text-[10px] text-white/40 uppercase">{p.role}</div>
                                   </div>
                               </div>
                           )
                       })}
                   </div>

                   <div className="p-6 border-t border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                       <div className="text-sm font-bold text-white/60">Selected: <span className="text-purple-400">{fluxSelection.length}</span> / {teams.length}</div>
                       <button 
                           onClick={submitFlux}
                           disabled={fluxSelection.length === 0}
                           className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                           Initialize Flux
                       </button>
                   </div>
               </div>
           </div>
       )}

        {/* ADD/EDIT PLAYER MODAL (Existing) */}
        {showPlayerModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
                    <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                        {editingPlayer ? <Edit3 className="w-5 h-5 text-brand" /> : <Plus className="w-5 h-5 text-brand" />}
                        {editingPlayer ? 'Edit Player' : 'New Player'}
                    </h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        handleSavePlayer({
                            name: formData.get('name'),
                            role: formData.get('role'),
                            price: formData.get('price')
                        });
                    }} className="space-y-4">
                        <div>
                            <label className="text-[10px] text-white/40 uppercase font-bold">Name</label>
                            <input name="name" defaultValue={editingPlayer?.name} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-brand/50 outline-none" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-white/40 uppercase font-bold">Role</label>
                                <select name="role" defaultValue={editingPlayer?.role || 'Batsman'} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-brand/50 outline-none">
                                    <option>Batsman</option>
                                    <option>Bowler</option>
                                    <option>All-Rounder</option>
                                    <option>Wicket Keeper</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-white/40 uppercase font-bold">Base Price</label>
                                <input name="price" type="number" defaultValue={editingPlayer?.price || 500000} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-brand/50 outline-none" required />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowPlayerModal(false)} className="flex-1 py-3 bg-white/5 text-white/60 font-bold uppercase text-xs rounded hover:bg-white/10">Cancel</button>
                            <button type="submit" className="flex-1 py-3 bg-brand text-white font-bold uppercase text-xs rounded hover:bg-brand-glow">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* TEAM DETAIL MODAL (Existing) */}
        {showTeamModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowTeamModal(null)}>
                <div className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                {showTeamModal.logoUrl ? <Image src={showTeamModal.logoUrl} width={40} height={40} alt="logo" /> : <Shield className="w-5 h-5 text-white/20" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase">{showTeamModal.name}</h3>
                                <p className="text-xs text-brand font-mono">Purse: {formatPrice(showTeamModal.purse)}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowTeamModal(null)} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white"><XCircle className="w-5 h-5" /></button>
                    </div>
                    <div className="p-0 max-h-[400px] overflow-y-auto bg-black/50">
                        <table className="w-full text-left text-sm text-white/70">
                            <thead className="bg-white/5 text-white/30 text-[10px] uppercase font-bold sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Player</th>
                                    <th className="px-6 py-3 text-right">Sold For</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {players.filter(p => p.teamId === showTeamModal.id).map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-3">{p.name} <span className="text-white/30 text-[10px] ml-2 uppercase">{p.role}</span></td>
                                        <td className="px-6 py-3 text-right font-mono text-green-400">{formatPrice(p.soldPrice)}</td>
                                    </tr>
                                ))}
                                {players.filter(p => p.teamId === showTeamModal.id).length === 0 && (
                                    <tr><td colSpan="2" className="px-6 py-8 text-center text-white/20 text-xs uppercase tracking-widest">No Players Purchased</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}