'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

// Components
import DashboardHeader from '@/components/team/DashboardHeader';
import PlayerArena from '@/components/team/PlayerArena';
import { FluxAnimating, FluxResult } from '@/components/team/FluxViews';
import NewSigningModal from '@/components/team/modals/NewSigningModal';
import { SquadModal, EditTeamModal } from '@/components/team/modals/SquadModal'; 

export default function TeamDashboard() {
  const router = useRouter();
  
  // -- STATE --
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]);
  const [auctionState, setAuctionState] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // -- ANIMATION & EVENT REFS --
  const [newSigning, setNewSigning] = useState(null);
  const previousSquadCount = useRef(0);
  const previousPurse = useRef(0); 
  const isFirstLoad = useRef(true); // <--- FIX: Prevents popup on refresh
  const [purseExchanged, setPurseExchanged] = useState(false);
  
  // -- FLUX STATE MANAGEMENT --
  const [fluxMode, setFluxMode] = useState('IDLE'); // 'IDLE' | 'ANIMATING' | 'SHOW_RESULT'
  const [fluxCountdown, setFluxCountdown] = useState(10);
  const lastProcessedFluxId = useRef(''); 

  // Modals
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const triggerToast = (msg, type) => setToast({ message: msg, type });

  // 1. Session & Polling Logic
  useEffect(() => {
    const session = localStorage.getItem('sporty_team_session');
    if (!session) { router.push('/join-auction'); return; }
    
    const initialTeam = JSON.parse(session);
    setTeam(initialTeam);
    
    previousPurse.current = initialTeam.purse;

    // Load last processed Flux ID
    const savedFluxId = localStorage.getItem('last_seen_flux_id');
    if (savedFluxId) lastProcessedFluxId.current = savedFluxId;

    const pollData = async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${initialTeam.auctionId}`, { cache: 'no-store' });
            const data = await res.json();
            
            if (data.success) {
                const newState = data.data;
                const myLatestTeamData = newState.teams.find(t => t.id === initialTeam.id);
                const myPlayers = newState.players.filter(p => p.teamId === initialTeam.id);

                // --- FIX: SILENT SYNC ON REFRESH ---
                if (isFirstLoad.current) {
                    previousSquadCount.current = myPlayers.length;
                    if (myLatestTeamData) previousPurse.current = myLatestTeamData.purse;
                    isFirstLoad.current = false;
                    
                    // Just update state, don't trigger events
                    setAuctionState(newState);
                    setSquad(myPlayers);
                    if(myLatestTeamData) setTeam(prev => ({ ...prev, ...myLatestTeamData }));
                    return; 
                }

                // --- ROBUST PURSE SYNC ---
                if (myLatestTeamData && team) {
                    if (myLatestTeamData.purse !== previousPurse.current) {
                        setPurseExchanged(true); 
                        setTimeout(() => setPurseExchanged(false), 2000);
                        
                        previousPurse.current = myLatestTeamData.purse;

                        setTeam(prev => ({
                            ...prev,
                            purse: myLatestTeamData.purse,
                            themeColor: myLatestTeamData.themeColor || prev.themeColor
                        }));
                    }
                }

                // --- FLUX LOGIC (Fixed Loop) ---
                const serverFluxState = newState.fluxData?.state || 'IDLE';
                const currentFluxId = newState.fluxData?.matches 
                    ? `${newState.fluxData.matches.length}_${newState.fluxData.matches[0].playerId}` 
                    : 'none';

                if (serverFluxState === 'ANIMATING') {
                    // FIX: Only start animation if we are totally IDLE.
                    // If we are already 'ANIMATING' (timer running) or 'SHOW_RESULT' (done), ignore server.
                    if (fluxMode === 'IDLE') {
                        setFluxMode('ANIMATING');
                        setFluxCountdown(10); 
                    }
                } 
                else if (serverFluxState === 'REVEAL') {
                    // Only show result if we haven't seen this specific ID yet
                    if (currentFluxId !== lastProcessedFluxId.current && fluxMode !== 'SHOW_RESULT') {
                        setFluxMode('SHOW_RESULT');
                    }
                } 
                else if (serverFluxState === 'IDLE') {
                    if (fluxMode !== 'IDLE') setFluxMode('IDLE');
                }

                // --- DETECT NEW SIGNING ---
                // Only trigger if we are NOT in any Flux mode
                if (myPlayers.length > previousSquadCount.current) {
                    if (fluxMode === 'IDLE' && newState.fluxData?.state === 'IDLE') {
                        const newestPlayer = myPlayers[myPlayers.length - 1];
                        setNewSigning(newestPlayer);
                    }
                }
                previousSquadCount.current = myPlayers.length;
                
                setAuctionState(newState);
                setSquad(myPlayers);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    // Run once immediately
    pollData();
    
    // Run every 1s
    const interval = setInterval(pollData, 1000);

    return () => clearInterval(interval);
  }, [router, fluxMode]); // Removed fluxCountdown from dep array to prevent re-running poll logic on tick

  // 2. Local Flux Timer
  useEffect(() => {
      let timer;
      if (fluxMode === 'ANIMATING') {
          if (fluxCountdown > 0) {
              timer = setInterval(() => setFluxCountdown(prev => prev - 1), 1000);
          } else {
              setFluxMode('SHOW_RESULT');
          }
      }
      return () => clearInterval(timer);
  }, [fluxMode, fluxCountdown]);

  // 3. Handle "Continue" Button Click
  const handleFluxContinue = () => {
      const currentFluxId = auctionState.fluxData?.matches 
        ? `${auctionState.fluxData.matches.length}_${auctionState.fluxData.matches[0].playerId}` 
        : 'none';
      
      lastProcessedFluxId.current = currentFluxId;
      localStorage.setItem('last_seen_flux_id', currentFluxId);

      setFluxMode('IDLE');
  };

  const handleLogout = () => { localStorage.removeItem('sporty_team_session'); router.push('/join-auction'); };
  
  const handleUpdateTeam = async (updatedData) => {
    try {
        const res = await fetch('/api/team/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId: team.id, ...updatedData })
        });
        const data = await res.json();
        if (data.success) {
            setTeam(prev => ({ ...prev, ...updatedData }));
            const currentSession = JSON.parse(localStorage.getItem('sporty_team_session') || '{}');
            localStorage.setItem('sporty_team_session', JSON.stringify({ ...currentSession, ...updatedData }));
            triggerToast("Team profile updated!");
            setShowEditModal(false);
        } else {
            triggerToast("Update failed", "error");
        }
    } catch (e) { triggerToast("Network error", "error"); }
  };

  if (loading || !auctionState) return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono uppercase tracking-widest animate-pulse">Connecting Satellite...</div>;

  // --- VIEW RENDER LOGIC ---
  
  // 1. Flux Animation View
  if (fluxMode === 'ANIMATING') return <FluxAnimating timeLeft={fluxCountdown} />;
  
  // 2. Flux Result View
  if (fluxMode === 'SHOW_RESULT') return <FluxResult auctionState={auctionState} team={team} onContinue={handleFluxContinue} />;

  // 3. Standard Dashboard View
  const activePlayer = auctionState.activePlayer;
  const isPlayerSold = activePlayer?.isSold;
  const soldToMyTeam = isPlayerSold && activePlayer?.teamId === team.id;
  const soldToOtherTeam = isPlayerSold && activePlayer?.teamId !== team.id;
  const winningTeamName = isPlayerSold ? auctionState.teams.find(t => t.id === activePlayer.teamId)?.name : null;
  const themeColor = team.themeColor || '#E62E2E';
  const statusColor = soldToMyTeam ? '#22C55E' : (soldToOtherTeam ? '#EF4444' : themeColor);

  return (
    <div className="h-screen text-white flex flex-col overflow-hidden relative transition-colors duration-1000 bg-gradient-to-br from-[#0a0a0a] to-[#121212]">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none mix-blend-screen transition-colors duration-1000" style={{ backgroundColor: statusColor, opacity: 0.15 }}></div>

      {toast && <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none"><div className="pointer-events-auto"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div></div>}

      <DashboardHeader 
        team={team} 
        auctionName={auctionState.name} 
        purse={team.purse} 
        squadCount={squad.length} 
        purseExchanged={purseExchanged} 
        onEdit={() => setShowEditModal(true)} 
        onShowSquad={() => setShowSquadModal(true)} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 relative z-10 flex flex-col justify-center items-center p-6 lg:p-8">
        <PlayerArena 
            activePlayer={activePlayer}
            auctionState={auctionState}
            team={team}
            isPlayerSold={isPlayerSold}
            soldToMyTeam={soldToMyTeam}
            soldToOtherTeam={soldToOtherTeam}
            winningTeamName={winningTeamName}
            statusColor={statusColor}
        />
      </main>

      {/* Show New Signing Modal ONLY if we are not in Flux Mode */}
      {fluxMode === 'IDLE' && (
          <NewSigningModal player={newSigning} onClose={() => setNewSigning(null)} />
      )}
      
      {showSquadModal && <SquadModal squad={squad} onClose={() => setShowSquadModal(false)} totalSpent={squad.reduce((a, b) => a + (b.soldPrice || 0), 0)} />}
      {showEditModal && <EditTeamModal team={team} onClose={() => setShowEditModal(false)} onSave={handleUpdateTeam} />}
    </div>
  );
}