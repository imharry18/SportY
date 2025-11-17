'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

// --- IMPORT NEW COMPONENTS ---
import AdminHeader from '@/components/admin/AdminHeader';
import ConsoleTab from '@/components/admin/ConsoleTab';
import TeamsTab from '@/components/admin/TeamsTab';
import ManageTab from '@/components/admin/ManageTab';
import FluxModal from '@/components/admin/modals/FluxModal';
import PlayerModal from '@/components/admin/modals/PlayerModal';
import TeamDetailModal from '@/components/admin/modals/TeamDetailModal';

export default function AdminDashboard() {
  const router = useRouter();
  
  // -- STATE --
  const [activeTab, setActiveTab] = useState('CONSOLE'); 
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [toast, setToast] = useState(null);

  const [auction, setAuction] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]); 
  
  // Live Auction State
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null); 
  const [isPaused, setIsPaused] = useState(false);

  // Modal States
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(null);
  const [showFluxModal, setShowFluxModal] = useState(false);
  const [fluxSelection, setFluxSelection] = useState([]);

  // Drag Refs
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Helpers
  const triggerToast = (msg, type='success') => setToast({ message: msg, type });
  const formatPrice = (p) => p >= 10000000 ? `₹ ${(p/10000000).toFixed(2)} Cr` : p >= 100000 ? `₹ ${(p/100000).toFixed(2)} L` : `₹ ${p.toLocaleString()}`;

  // Sync Helper
  const syncActivePlayer = async (player) => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if(!player || !id) return;
      await fetch('/api/admin/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'SET_ACTIVE', auctionId: id, playerId: player.id })
      });
  };

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id'); 
        if(!id) { setLoading(false); return; }

        try {
            const res = await fetch(`/api/auction/details?id=${id}`, { cache: 'no-store' });
            const data = await res.json();
            if(data.success) {
                setAuction(data.data);
                setTeams(data.data.teams);
                setPlayers(data.data.players);
                if(loading) {
                    const firstUnsoldIndex = data.data.players.findIndex(p => !p.isSold);
                    if (firstUnsoldIndex !== -1) {
                        setCurrentPlayerIndex(firstUnsoldIndex);
                        syncActivePlayer(data.data.players[firstUnsoldIndex]);
                    }
                }
            }
        } catch(e) { console.error(e); } 
        finally { setLoading(false); }
    };
    fetchData();
  }, [refreshKey]);
 
  const currentPlayer = players[currentPlayerIndex];

  // --- HANDLERS ---
  
  const handleBid = async (teamId) => {
    if (isPaused) return triggerToast("Auction Paused", "error");
    if (!currentPlayer || currentPlayer.isSold) return triggerToast("Invalid Player", "error");

    let nextBid = currentBid === 0 ? currentPlayer.price : currentBid + (currentBid < 10000000 ? 500000 : 2000000);
    const team = teams.find(t => t.id === teamId);
    
    if (team.purse < nextBid) return triggerToast("Insufficient Purse", "error");

    setCurrentBid(nextBid);
    setCurrentBidder(teamId);
    
    const params = new URLSearchParams(window.location.search);
    await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PLACE_BID', auctionId: params.get('id'), teamId, amount: nextBid })
    });
  };

  

  const handleSell = async () => {
    if (!currentBidder) return;
    const params = new URLSearchParams(window.location.search);
    const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SELL', auctionId: params.get('id'), playerId: currentPlayer.id, teamId: currentBidder, amount: currentBid })
    });
    if (res.ok) {
        triggerToast("Player Sold");
        setCurrentBid(0);
        setCurrentBidder(null);
        setRefreshKey(k => k + 1);
    }
  };

  const handleUndo = async () => {
      if(!confirm(`Undo sale of ${currentPlayer.name}?`)) return;
      await fetch('/api/admin/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'UNDO_SELL', playerId: currentPlayer.id })
      });
      triggerToast("Undone");
      setRefreshKey(k => k + 1);
  };

  const handleNav = (dir) => {
      const newIndex = dir === 'next' ? currentPlayerIndex + 1 : currentPlayerIndex - 1;
      if (newIndex >= 0 && newIndex < players.length) {
          setCurrentPlayerIndex(newIndex);
          setCurrentBid(0);
          setCurrentBidder(null);
          syncActivePlayer(players[newIndex]);
      }
  };

  const handleDrag = async (start, end) => {
      const list = [...players];
      const item = list[start];
      list.splice(start, 1);
      list.splice(end, 0, item);
      setPlayers(list);
      
      const updates = list.map((p, i) => ({ id: p.id, order: i }));
      await fetch('/api/admin/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates })
      });
      triggerToast("Reordered");
  };

  const handleSavePlayer = async (data) => {
      const params = new URLSearchParams(window.location.search);
      const action = editingPlayer ? 'EDIT_PLAYER' : 'ADD_PLAYER';
      const res = await fetch('/api/admin/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, auctionId: params.get('id'), playerId: editingPlayer?.id, playerData: data })
      });
      if(res.ok) {
          triggerToast("Saved");
          setShowPlayerModal(false);
          setRefreshKey(k => k + 1);
      }
  };

  const handleDelete = async (id) => {
      if(!confirm("Delete?")) return;
      await fetch('/api/admin/action', {
          method: 'POST',
          body: JSON.stringify({ action: 'DELETE_PLAYER', playerId: id })
      });
      triggerToast("Deleted");
      setRefreshKey(k => k + 1);
  };

// ... (imports remain same)

// ... inside AdminDashboard component ...

  // Flux Actions
  const handleFlux = async (action, payload = {}) => {
      const params = new URLSearchParams(window.location.search);
      const auctionId = params.get('id');
      
      if(action === 'OPEN') {
          setShowFluxModal(true);
          await fetch('/api/admin/flux', { method: 'POST', body: JSON.stringify({ action: 'ACTIVATE', auctionId }) });
      }
      else if(action === 'TOGGLE') {
          const id = payload.id;
          let newSel = fluxSelection.includes(id) ? fluxSelection.filter(x => x !== id) : [...fluxSelection, id];
          if(newSel.length > teams.length) return triggerToast(`Max ${teams.length} players`, "error");
          
          setFluxSelection(newSel);
          
          // Only focus if adding
          if(!fluxSelection.includes(id)) {
              await fetch('/api/admin/flux', { method: 'POST', body: JSON.stringify({ action: 'FOCUS', auctionId, focusPlayerId: id }) });
          }
      }
      else if(action === 'SUBMIT') {
          // 1. Start Animation Phase
          triggerToast("Miracle Flux Initiated (10s)...");
          await fetch('/api/admin/flux', { method: 'POST', body: JSON.stringify({ action: 'START_ANIMATION', auctionId }) });
          
          // 2. Close Modal immediately so Admin sees the animation too
          setShowFluxModal(false);

          // 3. Wait 12 Seconds, then Execute
          setTimeout(async () => {
              const res = await fetch('/api/admin/flux', { 
                  method: 'POST', 
                  body: JSON.stringify({ action: 'EXECUTE', auctionId, playerIds: fluxSelection }) 
              });
              
              if(res.ok) {
                  triggerToast("Flux Complete!");
                  setFluxSelection([]);
                  setRefreshKey(k => k + 1);
              }
          }, 10000); // 10 Seconds Delay
      }
      else if(action === 'CLOSE') {
          setShowFluxModal(false);
          setFluxSelection([]);
          await fetch('/api/admin/flux', { method: 'POST', body: JSON.stringify({ action: 'RESET', auctionId }) });
      }
  };

// ... (rest of the file remains same)

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-brand">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">{toast && <div className="pointer-events-auto"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div>}</div>

        <AdminHeader auctionName={auction?.name} activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
            {activeTab === 'CONSOLE' && (
                <ConsoleTab 
                    teams={teams} 
                    currentPlayer={currentPlayer} 
                    currentBid={currentBid} 
                    currentBidder={currentBidder}
                    isPaused={isPaused}
                    onBid={handleBid}
                    onSell={handleSell}
                    onUndo={handleUndo}
                    onNext={() => handleNav('next')}
                    onPrev={() => handleNav('prev')}
                    onPause={() => setIsPaused(!isPaused)}
                    onFlux={() => handleFlux('OPEN')}
                    formatPrice={formatPrice}
                    hasPrev={currentPlayerIndex > 0}
                    hasNext={currentPlayerIndex < players.length - 1}
                />
            )}
            
            {activeTab === 'TEAMS' && (
                <TeamsTab 
                    teams={teams} 
                    players={players} 
                    formatPrice={formatPrice} 
                    onTeamClick={setShowTeamModal} 
                />
            )}
            
            {activeTab === 'MANAGE' && (
                <ManageTab 
                    players={players} 
                    teams={teams}
                    formatPrice={formatPrice}
                    onEdit={(p) => { setEditingPlayer(p); setShowPlayerModal(true); }}
                    onDelete={handleDelete}
                    onAdd={() => { setEditingPlayer(null); setShowPlayerModal(true); }}
                    onDragStart={(i) => dragItem.current = i}
                    onDragEnter={(i) => dragOverItem.current = i}
                    onDragEnd={() => handleDrag(dragItem.current, dragOverItem.current)}
                />
            )}
        </main>

        {showFluxModal && <FluxModal players={players} teams={teams} selection={fluxSelection} onClose={() => handleFlux('CLOSE')} onToggle={(id) => handleFlux('TOGGLE', {id})} onSubmit={() => handleFlux('SUBMIT')} />}
        {showPlayerModal && <PlayerModal player={editingPlayer} onClose={() => setShowPlayerModal(false)} onSave={handleSavePlayer} />}
        {showTeamModal && <TeamDetailModal team={showTeamModal} players={players} formatPrice={formatPrice} onClose={() => setShowTeamModal(null)} />}
    </div>
  );
}