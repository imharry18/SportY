'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Wallet, Users, Zap, Shield, LogOut, X, Trophy } from 'lucide-react';

export default function TeamDashboard() {
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]); // Stores the players bought by this team
  const [loading, setLoading] = useState(true);
  const [showSquadModal, setShowSquadModal] = useState(false);

  // 1. Load Session & Fetch Squad Data
  useEffect(() => {
    const session = localStorage.getItem('sporty_team_session');
    if (!session) {
      router.push('/join-auction');
      return;
    }
    
    const parsedTeam = JSON.parse(session);
    setTeam(parsedTeam);

    // Fetch latest data to get squad and tournament name updates
    const fetchSquad = async () => {
        try {
            const res = await fetch(`/api/auction/details?id=${parsedTeam.auctionId}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                // Filter players belonging to this team
                const myPlayers = data.data.players.filter(p => p.teamId === parsedTeam.id);
                setSquad(myPlayers);
                
                // Update team info (purse/name) just in case
                const myTeamInfo = data.data.teams.find(t => t.id === parsedTeam.id);
                if(myTeamInfo) {
                    setTeam(prev => ({
                        ...prev, 
                        purse: myTeamInfo.purse,
                        auctionName: data.data.name // Ensure tournament name is fresh
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

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!team) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      
      {/* BACKGROUND FX */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

      {/* --- DASHBOARD HEADER --- */}
      <header className="sticky top-20 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-24 flex items-center justify-between relative">
          
          {/* LEFT: Team Identity */}
          <div className="flex items-center gap-6 z-10">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden group shadow-lg">
                {team.logoUrl ? (
                    <Image src={team.logoUrl} fill className="object-cover" alt={team.name} />
                ) : (
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-white/20 group-hover:text-brand transition-colors" />
                )}
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-tech font-bold text-white uppercase tracking-tight leading-none">{team.name}</h1>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Auction Connected
                </p>
            </div>
          </div>

          {/* CENTER: Tournament Name (Absolute Positioned) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center hidden lg:block">
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-3 h-3 text-brand" />
                    <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">Tournament</span>
                </div>
                <h2 className="text-xl font-tech font-bold text-white uppercase tracking-widest text-glow">{team.auctionName}</h2>
            </div>
          </div>

          {/* RIGHT: Live Stats & Squad Button */}
          <div className="flex items-center gap-6 md:gap-8 z-10">
            
            {/* Purse Stat */}
            <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
                    Remaining Purse <Wallet className="w-3 h-3" />
                </div>
                <div className="text-xl md:text-2xl font-mono text-brand font-bold">
                    ₹ {team.purse?.toLocaleString('en-IN') || '0'}
                </div>
            </div>

            {/* Separator */}
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>

            {/* Squad Button (Replaces simple text) */}
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

            {/* Logout */}
            <button onClick={handleLogout} className="ml-2 p-2 hover:bg-white/10 rounded-full text-white/20 hover:text-red-500 transition-colors" title="Leave Dashboard">
                <LogOut className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT: AUCTION SYSTEM --- */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 lg:p-10 flex flex-col gap-8 relative z-10">
        
        {/* Placeholder for Auction System */}
        <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            
            {/* Central Status */}
            <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center border border-brand/20 mx-auto animate-pulse">
                    <Zap className="w-10 h-10 text-brand" />
                </div>
                <div>
                    <h2 className="text-3xl font-tech font-bold text-white uppercase tracking-wide">Auction System Offline</h2>
                    <p className="text-sm text-white/40 font-clean mt-2 max-w-md mx-auto">
                        Waiting for the auctioneer to initialize the bidding sequence. The live feed will appear here automatically.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    Status: Standby
                </div>
            </div>
        </div>
      </main>

      {/* --- SQUAD MODAL --- */}
      {showSquadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-2xl relative shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <div>
                        <h3 className="text-2xl font-tech font-bold text-white uppercase tracking-wide">My Squad</h3>
                        <p className="text-xs text-white/40 font-mono mt-1">Total Spent: ₹ {squad.reduce((acc, p) => acc + (p.soldPrice || 0), 0).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => setShowSquadModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal List */}
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
                                            {player.image ? (
                                                <Image src={player.image} fill className="object-cover" alt={player.name} />
                                            ) : (
                                                <Users className="w-5 h-5 text-white/20" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg leading-none">{player.name}</h4>
                                            <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">{player.role}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Sold For</p>
                                        <p className="font-mono text-xl text-green-400 font-bold">₹ {(player.soldPrice || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
      )}

    </div>
  );
}