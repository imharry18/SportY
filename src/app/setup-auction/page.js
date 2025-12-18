'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Layers, Users, Save, CheckCircle, Copy } from 'lucide-react';

export default function SetupAuction() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get credentials from URL (if redirected from Create)
  const urlId = searchParams.get('id');
  const urlKey = searchParams.get('key');

  const [step, setStep] = useState(1); // 1=Details, 2=Teams, 3=Done
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    theme: 'Sci-Fi Sport',
    date: '',
    teamCount: 8,
  });
  const [teamNames, setTeamNames] = useState(Array(8).fill(''));
  const [generatedTeams, setGeneratedTeams] = useState([]);

  // If no ID provided, kick them out (Basic protection)
  useEffect(() => {
    if (!urlId) router.push('/join-auction');
  }, [urlId, router]);

  // Handle Team Count Change
  const handleCountChange = (e) => {
    const count = parseInt(e.target.value);
    setConfig({ ...config, teamCount: count });
    setTeamNames(Array(count).fill(''));
  };

  const handleTeamNameChange = (index, value) => {
    const newNames = [...teamNames];
    newNames[index] = value;
    setTeamNames(newNames);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auction/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            leagueId: urlId,
            theme: config.theme,
            date: config.date,
            teams: teamNames.filter(n => n.trim() !== '') // Remove empty names
        }),
      });
      
      const data = await res.json();
      if(res.ok) {
        setGeneratedTeams(data.teams);
        setStep(3);
      } else {
        alert(data.message);
      }
    } catch(e) {
      console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-6">
            <h1 className="text-4xl font-tech font-bold uppercase text-white">Console <span className="text-brand">Setup</span></h1>
            <p className="text-xs font-mono text-white/40 mt-1">LEAGUE_ID: {urlId}</p>
        </div>

        {/* --- STEP 1: EVENT DETAILS --- */}
        {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand uppercase tracking-widest">Event Theme</label>
                        <div className="flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3">
                            <Layers className="w-5 h-5 text-white/20 mr-3" />
                            <input 
                                type="text" 
                                value={config.theme} 
                                onChange={(e) => setConfig({...config, theme: e.target.value})}
                                className="bg-transparent w-full outline-none font-clean text-sm" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand uppercase tracking-widest">Event Date</label>
                        <div className="flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3">
                            <Calendar className="w-5 h-5 text-white/20 mr-3" />
                            <input 
                                type="date" 
                                value={config.date} 
                                onChange={(e) => setConfig({...config, date: e.target.value})}
                                className="bg-transparent w-full outline-none font-clean text-sm uppercase" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-brand uppercase tracking-widest">Total Franchises</label>
                    <input 
                        type="range" min="2" max="16" 
                        value={config.teamCount} 
                        onChange={handleCountChange}
                        className="w-full accent-brand"
                    />
                    <div className="text-right font-tech text-2xl font-bold">{config.teamCount} Teams</div>
                </div>

                <button onClick={() => setStep(2)} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest cut-corners-sm hover:scale-105 transition-transform">
                    Next: Squad Names
                </button>
            </div>
        )}

        {/* --- STEP 2: TEAM NAMES --- */}
        {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
                <h2 className="text-xl font-bold uppercase tracking-wide">Enter Franchise Names</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamNames.map((name, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-white/20 font-mono text-sm w-6">0{i+1}</span>
                            <input 
                                type="text" 
                                placeholder={`Team ${i+1} Name`}
                                value={name}
                                onChange={(e) => handleTeamNameChange(i, e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-brand/50 outline-none transition-colors"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="px-6 py-3 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/5">Back</button>
                    <button onClick={handleFinalSubmit} disabled={loading} className="px-8 py-3 bg-brand text-white font-bold uppercase tracking-widest cut-corners-sm hover:bg-brand-glow transition-colors flex items-center gap-2">
                        {loading ? 'Processing...' : <><Save className="w-4 h-4" /> Finalize Setup</>}
                    </button>
                </div>
            </div>
        )}

        {/* --- STEP 3: GENERATED CODES --- */}
        {step === 3 && (
            <div className="animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-4 mb-8 bg-green-500/10 p-6 border border-green-500/20 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase">Initialization Complete</h2>
                        <p className="text-xs text-white/50">Auction is now marked as "SETUP". Teams can log in using these codes.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedTeams.map((team) => (
                        <div key={team.id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/10 rounded-lg group hover:border-brand/30 transition-colors">
                            <span className="font-bold text-white">{team.name}</span>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-brand font-bold bg-brand/10 px-2 py-1 rounded text-sm">{team.accessCode}</span>
                                <Copy className="w-4 h-4 text-white/20 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(team.accessCode)} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button onClick={() => router.push('/')} className="text-sm text-white/40 hover:text-white border-b border-white/10 hover:border-white pb-1 transition-all">Return to Dashboard</button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}