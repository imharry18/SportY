'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Trophy, Users, Upload, FileText, DollarSign, 
  MapPin, CheckCircle, ArrowRight, ArrowLeft, 
  HelpCircle, X, Edit3, Save, Download, Loader2
} from 'lucide-react';
import Image from 'next/image';

export default function SetupAuction() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Credentials from URL
  const urlId = searchParams.get('id');
  const urlKey = searchParams.get('key');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // CSV State
  const [readingCsv, setReadingCsv] = useState(false);
  const [parsedPlayers, setParsedPlayers] = useState([]);

  // Final Data State
  const [finalTeams, setFinalTeams] = useState([]);

  // Form Configuration
  const [config, setConfig] = useState({
    // Identity
    name: 'My Tournament', 
    type: 'Cricket',
    tagline: '',
    logoPreview: null,
    
    // Rules
    purse: 50000000,
    bidIncrement: 'Dynamic', 
    ground: '',
    // Removed squadSize as requested

    // Teams
    teamCount: 8,
    teamNames: Array(20).fill(''), // Increased array size for max 20

    // Players
    playerFile: null
  });

  useEffect(() => {
    if (!urlId || !urlKey) router.push('/join-auction');
  }, [urlId, urlKey, router]);

  // --- Handlers ---

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if(file) setConfig({...config, logoPreview: URL.createObjectURL(file)});
  };

  const handleTeamNameChange = (index, val) => {
    const newNames = [...config.teamNames];
    newNames[index] = val;
    setConfig({...config, teamNames: newNames});
  };

  const updateTeamCount = (count) => {
    setConfig({ ...config, teamCount: count });
  };

  // --- CSV Logic ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
        setConfig({...config, playerFile: file});
        setReadingCsv(true);
        setParsedPlayers([]);

        // Simple CSV Parser
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const rows = text.split('\n').slice(1); // Skip header
            
            // Simulate "Fetching" delay for effect
            setTimeout(() => {
                const players = rows.map((row, index) => {
                    const cols = row.split(',');
                    if (cols.length < 2) return null;
                    return {
                        id: index,
                        name: cols[0]?.trim() || 'Unknown',
                        role: cols[1]?.trim() || 'Player',
                        price: cols[2]?.trim() || '0',
                    };
                }).filter(Boolean).slice(0, 50); // Show preview of first 50

                setParsedPlayers(players);
                setReadingCsv(false);
            }, 1500); 
        };
        reader.readAsText(file);
    }
  };

  // --- Submission ---
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Create Teams & Update Auction
      const res = await fetch('/api/auction/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            leagueId: urlId,
            theme: config.type,
            date: new Date().toISOString(),
            teams: config.teamNames.slice(0, config.teamCount).map((name, i) => name.trim() || `Team ${i+1}`)
        }),
      });
      
      const data = await res.json();

      if(res.ok) {
        setFinalTeams(data.teams); // Save teams with codes for display
        setStep(5);
      } else {
        alert("Setup failed: " + data.message);
      }
    } catch(e) {
      console.error(e);
      alert("Network Error");
    } finally {
        setLoading(false);
    }
  };

  // --- Download Logic ---
  const downloadCredentials = () => {
    const lines = [
        "================================================",
        ` SPORTY AUCTION CREDENTIALS - ${config.name.toUpperCase()}`,
        "================================================",
        "",
        "[ ADMIN ACCESS ]",
        `League ID: ${urlId}`,
        `Passcode:  ${urlKey}`,
        "",
        "[ SPECTATOR ACCESS ]",
        `League ID: ${urlId}`,
        "(No passcode required for viewers)",
        "",
        "[ TEAM CREDENTIALS ]",
        ...finalTeams.map(t => `- ${t.name.padEnd(20)} | Code: ${t.accessCode}`),
        "",
        "================================================",
        "Keep these codes secure. Share responsibly.",
        "================================================"
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SportY_Credentials_${urlId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-12 px-6 relative overflow-hidden">
      
      {/* Background FX */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none"></div>

      {/* --- TOP: IDENTITY HEADER --- */}
      {step < 5 && (
        <div className="z-10 w-full max-w-4xl mb-10 flex flex-col items-center">
            {/* Logo Manager */}
            <div className="relative group mb-6">
                <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    {config.logoPreview ? (
                        <Image src={config.logoPreview} alt="Logo" fill className="object-cover" />
                    ) : (
                        <Trophy className="w-8 h-8 text-white/20" />
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Edit3 className="w-6 h-6 text-white" />
                        <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                    </label>
                </div>
            </div>
            <h1 className="text-3xl font-tech font-bold uppercase tracking-widest">{config.name}</h1>
            <p className="text-xs text-white/40 font-mono mt-1">LEAGUE ID: {urlId}</p>
        </div>
      )}

      {/* --- MAIN FORM CONTAINER --- */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Progress Bar */}
        {step < 5 && (
            <div className="flex justify-between mb-8 px-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 mx-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand shadow-[0_0_10px_rgba(230,46,46,0.5)]' : 'bg-white/10'}`}></div>
                ))}
            </div>
        )}

        {/* --- STEP 1: GENERAL INFO --- */}
        {step === 1 && (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 animate-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-tech font-bold text-white mb-6 uppercase flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-brand/10 text-brand flex items-center justify-center text-sm border border-brand/20">01</span> 
                    General Info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Sport Type</label>
                        <div className="relative">
                            <select 
                                value={config.type}
                                onChange={(e) => setConfig({...config, type: e.target.value})}
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white font-clean focus:border-brand/50 outline-none appearance-none"
                            >
                                <option>Cricket</option>
                                <option>Football</option>
                                <option>Volleyball</option>
                                <option>Esports</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">▼</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tagline</label>
                        <input 
                            type="text" 
                            value={config.tagline}
                            onChange={(e) => setConfig({...config, tagline: e.target.value})}
                            placeholder="e.g. Where Legends Rise"
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white font-clean focus:border-brand/50 outline-none"
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button onClick={() => setStep(2)} className="group flex items-center gap-3 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest cut-corners-sm hover:bg-brand hover:text-white transition-all">
                        Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}

        {/* --- STEP 2: RULES (Updated) --- */}
        {step === 2 && (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 animate-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-tech font-bold text-white mb-6 uppercase flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-brand/10 text-brand flex items-center justify-center text-sm border border-brand/20">02</span> 
                    Auction Rules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Team Purse</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
                            <input 
                                type="number" 
                                value={config.purse}
                                onChange={(e) => setConfig({...config, purse: e.target.value})}
                                className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-mono focus:border-brand/50 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Bid Increment</label>
                        <select 
                            value={config.bidIncrement}
                            onChange={(e) => setConfig({...config, bidIncrement: e.target.value})}
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none appearance-none"
                        >
                            <option>Dynamic (Auto-Scaling)</option>
                            <option>Static (Fixed Amount)</option>
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ground / Venue</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input 
                                type="text" 
                                value={config.ground}
                                onChange={(e) => setConfig({...config, ground: e.target.value})}
                                placeholder="e.g. Central Stadium"
                                className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand/50 outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(1)} className="text-white/40 hover:text-white flex items-center gap-2 text-sm uppercase tracking-wider font-bold"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button onClick={() => setStep(3)} className="group flex items-center gap-3 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest cut-corners-sm hover:bg-brand hover:text-white transition-all">
                        Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}

        {/* --- STEP 3: FRANCHISES (Max 20) --- */}
        {step === 3 && (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 animate-in slide-in-from-right-8 duration-500">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-tech font-bold text-white uppercase flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-brand/10 text-brand flex items-center justify-center text-sm border border-brand/20">03</span> 
                        Franchises
                    </h2>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <Users className="w-4 h-4 text-brand" />
                        <span className="font-mono text-sm font-bold">{config.teamCount} Teams</span>
                    </div>
                </div>
                <div className="mb-8">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Adjust Count (Max 20)</label>
                    <input 
                        type="range" min="2" max="20" 
                        value={config.teamCount} 
                        onChange={(e) => updateTeamCount(parseInt(e.target.value))}
                        className="w-full accent-brand h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {Array.from({length: config.teamCount}).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                            <span className="text-white/20 font-mono text-xs w-6">{(i+1).toString().padStart(2, '0')}</span>
                            <input 
                                type="text" 
                                placeholder={`Team ${i+1} Name`}
                                value={config.teamNames[i] || ''}
                                onChange={(e) => handleTeamNameChange(i, e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-brand/50 outline-none transition-colors"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(2)} className="text-white/40 hover:text-white flex items-center gap-2 text-sm uppercase tracking-wider font-bold"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button onClick={() => setStep(4)} className="group flex items-center gap-3 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest cut-corners-sm hover:bg-brand hover:text-white transition-all">
                        Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}

        {/* --- STEP 4: ROSTER & FETCHING --- */}
        {step === 4 && (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 animate-in slide-in-from-right-8 duration-500 relative">
                <h2 className="text-2xl font-tech font-bold text-white mb-6 uppercase flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-brand/10 text-brand flex items-center justify-center text-sm border border-brand/20">04</span> 
                    Player Roster
                </h2>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-white/60">Import your player database.</p>
                            <p className="text-[10px] text-brand uppercase tracking-widest mt-1">Format: Name, Type, BasePrice, ImageName</p>
                        </div>
                        <button onClick={() => setShowHelp(true)} className="text-xs flex items-center gap-2 text-white/40 hover:text-brand transition-colors"><HelpCircle className="w-4 h-4" /> Format Guide</button>
                    </div>

                    {/* Upload Box */}
                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed ${readingCsv ? 'border-brand/50 bg-brand/5' : 'border-white/10 hover:border-brand/30 hover:bg-white/[0.02]'} rounded-2xl cursor-pointer transition-all group relative overflow-hidden`}>
                        {readingCsv ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <Loader2 className="w-8 h-8 text-brand animate-spin mb-3" />
                                <p className="text-sm font-bold text-brand uppercase tracking-widest">Fetching Details...</p>
                            </div>
                        ) : config.playerFile ? (
                            <div className="z-10 flex flex-col items-center">
                                <FileText className="w-10 h-10 text-green-500 mb-3" />
                                <p className="text-lg font-bold text-white">{config.playerFile.name}</p>
                                <p className="text-xs text-white/40 mt-1">{(config.playerFile.size / 1024).toFixed(1)} KB • Click to Change</p>
                            </div>
                        ) : (
                            <div className="z-10 flex flex-col items-center">
                                <Upload className="w-8 h-8 text-white/20 mb-3 group-hover:text-brand transition-colors" />
                                <p className="text-sm font-bold text-white uppercase tracking-wider">Click to Upload CSV</p>
                            </div>
                        )}
                        <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} disabled={readingCsv} />
                    </label>

                    {/* Parsed List Preview */}
                    {parsedPlayers.length > 0 && (
                        <div className="mt-6 border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Previewing {parsedPlayers.length} Players</span>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-black/50 text-white/30 text-[10px] uppercase font-bold sticky top-0 backdrop-blur-sm">
                                        <tr>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Role</th>
                                            <th className="px-4 py-2 text-right">Base Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {parsedPlayers.map((p, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-2 font-medium text-white">{p.name}</td>
                                                <td className="px-4 py-2 text-white/60">{p.role}</td>
                                                <td className="px-4 py-2 text-right font-mono text-brand">₹{p.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(3)} className="text-white/40 hover:text-white flex items-center gap-2 text-sm uppercase tracking-wider font-bold"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading || readingCsv}
                        className="group flex items-center gap-3 px-8 py-3 bg-brand text-white font-bold uppercase tracking-widest cut-corners-sm hover:bg-brand-glow transition-all shadow-[0_0_20px_rgba(230,46,46,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : <><Save className="w-4 h-4" /> Finalize Setup</>}
                    </button>
                </div>
            </div>
        )}

        {/* --- STEP 5: CREDENTIALS DASHBOARD --- */}
        {step === 5 && (
            <div className="bg-[#0a0a0a] border border-green-500/30 rounded-3xl p-8 md:p-12 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center w-full">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-4xl font-tech font-bold text-white uppercase tracking-tighter mb-2">Setup Complete</h2>
                    <p className="text-sm text-white/50 font-clean mb-8">Distribute these unique credentials to your participants.</p>
                    
                    {/* CREDENTIALS GRID */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 text-left">
                        {/* Admin & Watch */}
                        <div className="space-y-4">
                            <div className="bg-[#050505] border border-brand/30 p-4 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 px-2 py-1 bg-brand/20 text-[9px] font-bold text-brand uppercase rounded-bl-lg">Admin</div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Admin Passcode</p>
                                <p className="text-xl font-mono text-white mt-1">{urlKey}</p>
                            </div>
                            <div className="bg-[#050505] border border-yellow-500/30 p-4 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 px-2 py-1 bg-yellow-500/20 text-[9px] font-bold text-yellow-500 uppercase rounded-bl-lg">Public</div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Spectator Access (League ID)</p>
                                <p className="text-xl font-mono text-white mt-1">{urlId}</p>
                            </div>
                        </div>

                        {/* Teams */}
                        <div className="bg-[#050505] border border-white/10 rounded-xl p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3 sticky top-0 bg-[#050505] pb-2 border-b border-white/5">Team Login Codes</p>
                            <div className="space-y-2">
                                {finalTeams.map((team, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-white/70">{team.name}</span>
                                        <span className="font-mono text-cyan-400 bg-cyan-900/10 px-2 py-0.5 rounded">{team.accessCode}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                        <button onClick={downloadCredentials} className="flex items-center justify-center gap-2 py-3 px-6 bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest rounded hover:bg-white/20 transition-colors">
                            <Download className="w-4 h-4" /> Download All as .TXT
                        </button>
                        <button onClick={() => router.push('/admin/dashboard')} className="py-3 px-8 bg-white text-black font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition-colors">
                            Enter Admin Console
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- HELP MODAL --- */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-2xl w-full relative">
                <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
                <h3 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand" /> CSV Format Guide
                </h3>
                <div className="bg-[#050505] p-2 rounded border border-white/5">
                    <div className="relative w-full aspect-video">
                        <Image src="/playersupload.png" alt="Format Guide" fill className="object-contain" />
                    </div>
                </div>
                <div className="mt-4 text-xs text-white/40 font-mono">
                    <p>Required Columns: Name, Type, BasePrice, ImageName</p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}