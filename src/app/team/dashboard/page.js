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
  const [purseExchanged, setPurseExchanged] = useState(false);
  
  // Flux State
  const [fluxTimer, setFluxTimer] = useState(30);
  const [showFluxResult, setShowFluxResult] = useState(false);

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
    
    // Initialize Ref to current purse so we don't flash on load
    previousPurse.current = initialTeam.purse;

    const pollData = async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${initialTeam.auctionId}`, { cache: 'no-store' });
            const data = await res.json();
            
            if (data.success) {
                const newState = data.data;
                const myLatestTeamData = newState.teams.find(t => t.id === initialTeam.id);
                const myPlayers = newState.players.filter(p => p.teamId === initialTeam.id);

                // --- FIX: ROBUST PURSE SYNC ---
                if (myLatestTeamData) {
                    // Compare Server Data vs Local Ref
                    if (myLatestTeamData.purse !== previousPurse.current) {
                        console.log("Purse Update Detected:", previousPurse.current, "->", myLatestTeamData.purse);
                        
                        setPurseExchanged(true); 
                        setTimeout(() => setPurseExchanged(false), 2000);
                        
                        // Update Ref
                        previousPurse.current = myLatestTeamData.purse;

                        // Update State
                        setTeam(prev => ({
                            ...prev,
                            purse: myLatestTeamData.purse,
                            themeColor: myLatestTeamData.themeColor || prev.themeColor
                        }));
                    }
                }

                // --- DETECT NEW SIGNING ---
                if (myPlayers.length > previousSquadCount.current) {
                    // Avoid triggering on first load (0 -> X)
                    if (previousSquadCount.current !== 0) {
                        const newestPlayer = myPlayers[myPlayers.length - 1];
                        if (newState.fluxData?.state !== 'REVEAL') {
                            setNewSigning(newestPlayer);
                        }
                    }
                }
                previousSquadCount.current = myPlayers.length;

                // --- FLUX ---
                if (newState.fluxData?.state === 'REVEAL' && auctionState?.fluxData?.state !== 'REVEAL') {
                    setShowFluxResult(true);
                    setFluxTimer(30);
                }
                
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
  }, [router]); // Removed dependencies to prevent interval resets

  // 2. Flux Timer Logic
  useEffect(() => {
      // Auto-close flux result if server resets to IDLE
      if (auctionState?.fluxData?.state === 'IDLE' && showFluxResult) {
          handleFluxContinue();
      }

      if (showFluxResult && fluxTimer > 0) {
          const timer = setInterval(() => setFluxTimer(prev => prev - 1), 1000);
          return () => clearInterval(timer);
      } else if (fluxTimer === 0) {
          handleFluxContinue();
      }
  }, [showFluxResult, fluxTimer, auctionState]);

  const handleFluxContinue = () => {
      setShowFluxResult(false);
      setLoading(true); 
      setTimeout(() => setLoading(false), 500); 
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

  // Render Logic
  if (auctionState.fluxData?.state === 'ANIMATING') return <FluxAnimating />;
  if (showFluxResult) return <FluxResult auctionState={auctionState} team={team} onContinue={handleFluxContinue} timer={fluxTimer} />;

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

      <NewSigningModal player={newSigning} onClose={() => setNewSigning(null)} />
      {showSquadModal && <SquadModal squad={squad} onClose={() => setShowSquadModal(false)} totalSpent={squad.reduce((a, b) => a + (b.soldPrice || 0), 0)} />}
      {showEditModal && <EditTeamModal team={team} onClose={() => setShowEditModal(false)} onSave={handleUpdateTeam} />}
    </div>
  );
}