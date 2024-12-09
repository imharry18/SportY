'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Copy, CheckCircle, ArrowRight, Zap, Upload } from 'lucide-react';

export default function CreateAuction() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1 = Input, 2 = Success/Credentials
  const [loading, setLoading] = useState(false); // Added loading state
  const [formData, setFormData] = useState({ name: '', logo: null });
  const [generatedCreds, setGeneratedCreds] = useState({ leagueId: '', passcode: '' });
  const [copied, setCopied] = useState(false);

  // 1. Auth Protection
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  // Helper: Generate Random String
  const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Helper: Generate League ID (ABC-DEF-GHIJ)
  const generateLeagueId = () => {
    const part1 = generateRandomString(3);
    const part2 = generateRandomString(3);
    const part3 = generateRandomString(4);
    return `${part1}-${part2}-${part3}`;
  };

  // 2. Handle Creation (Updated to Save to DB)
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    
    // Generate IDs locally
    const newLeagueId = generateLeagueId();
    const newPasscode = generateRandomString(10); 
    
    try {
        // CALL THE API TO SAVE TO DATABASE
        const res = await fetch('/api/auction/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newLeagueId,        // Send the generated ID
                name: formData.name,
                passcode: newPasscode   // Send the generated Passcode
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setGeneratedCreds({ leagueId: newLeagueId, passcode: newPasscode });
            setStep(2);
        } else {
            alert(data.message || "Failed to create lobby");
        }
    } catch (error) {
        console.error(error);
        alert("Network error occurred");
    } finally {
        setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = `League ID: ${generatedCreds.leagueId}\nPasscode: ${generatedCreds.passcode}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null; 

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center relative overflow-hidden py-12 px-6">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none animate-pulse"></div>

      <div className="max-w-lg w-full relative z-10">
        
        {/* --- STEP 1: INPUT DETAILS --- */}
        {step === 1 && (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header */}
            <div className="relative z-10 mb-8 text-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Protocol v3.0</span>
               </div>
              <h1 className="text-4xl md:text-5xl font-tech font-bold text-white mb-3 uppercase tracking-tighter leading-none">
                Initialize <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-glow">Lobby.</span>
              </h1>
              <p className="text-white/40 font-clean text-xs leading-relaxed max-w-[280px] mx-auto">
                Configure tournament parameters to deploy auction.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-6 relative z-10">
              
              {/* Input Group */}
              <div className="space-y-1.5 group/input">
                <label className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] ml-1 group-focus-within/input:text-brand-glow transition-colors">Tournament Name</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white font-tech text-xl focus:outline-none focus:border-brand/50 transition-all placeholder:text-white/10 focus:shadow-[0_0_30px_rgba(230,46,46,0.1)]"
                        placeholder="E.G. SUMMER CUP '25"
                        required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none">
                        <Zap className="w-5 h-5" />
                    </div>
                </div>
              </div>

              {/* Upload Group */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] ml-1">League Identity</label>
                <label className="relative flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-brand/30 hover:bg-white/[0.02] transition-all group/upload overflow-hidden">
                  <div className="absolute inset-0 bg-brand/5 scale-0 group-hover/upload:scale-100 transition-transform duration-500 rounded-xl origin-center"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center pt-2 pb-3">
                      <Upload className="w-6 h-6 text-white/20 mb-2 group-hover/upload:text-brand transition-colors transform group-hover/upload:-translate-y-1" />
                      <p className="text-[10px] text-white/30 uppercase tracking-widest group-hover/upload:text-white transition-colors">Upload Emblem</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loading} // Disable while saving
                className="w-full group/btn relative px-6 py-4 bg-white text-black cut-corners-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(230,46,46,0.4)] mt-2 disabled:opacity-50"
              >
                  <div className="absolute inset-0 bg-brand translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                      <span className="font-tech font-bold text-lg uppercase tracking-widest group-hover/btn:text-white transition-colors">
                        {loading ? 'Saving to Database...' : 'Generate System'}
                      </span>
                      {!loading && <ArrowRight className="w-5 h-5 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />}
                  </div>
              </button>

            </form>
          </div>
        )}

        {/* --- STEP 2: SUCCESS & CREDENTIALS --- */}
        {step === 2 && (
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-3xl p-8 md:p-10 relative overflow-hidden animate-in zoom-in-95 duration-500 shadow-[0_0_100px_rgba(34,197,94,0.1)]">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute top-6 right-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>

            <div className="flex flex-col items-center text-center mb-8 relative z-10">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-4 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-tech font-bold text-white uppercase tracking-tight">System Ready</h2>
                <p className="text-[10px] font-mono text-green-400 mt-2 uppercase tracking-widest border border-green-500/20 px-3 py-1 rounded bg-green-900/10">Credentials Generated Successfully</p>
            </div>

            {/* Credentials Card */}
            <div className="bg-[#050505] border border-white/10 rounded-xl p-1 relative group/card mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
                <div className="bg-[#080808] p-5 rounded-lg relative z-10">
                    <div className="grid grid-cols-1 gap-6 relative">
                        {/* League ID */}
                        <div className="space-y-1">
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                                <span className="w-1 h-1 bg-brand rounded-full"></span> League ID
                            </div>
                            <div className="text-2xl font-tech text-white font-bold tracking-wider">{generatedCreds.leagueId}</div>
                        </div>
                        
                        <div className="h-px w-full bg-white/5"></div>

                        {/* Passcode */}
                        <div className="space-y-1">
                            <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                                <span className="w-1 h-1 bg-brand rounded-full"></span> Passcode
                            </div>
                            <div className="text-2xl font-tech text-brand-glow font-bold tracking-wider blur-sm hover:blur-none transition-all duration-300 cursor-pointer" title="Hover to reveal">
                                {generatedCreds.passcode}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Copy Button */}
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors group/copy z-20"
                    title="Copy Credentials"
                >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-white/40 group-hover/copy:text-white" />}
                </button>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest">Share these credentials securely with your franchise owners.</p>
                
                <button 
                    onClick={() => router.push(`/setup-auction?id=${generatedCreds.leagueId}&key=${generatedCreds.passcode}`)}
                    className="w-full group/next relative px-6 py-4 bg-brand text-white cut-corners-sm overflow-hidden transition-all hover:bg-brand-glow shadow-[0_0_30px_rgba(230,46,46,0.3)]"
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="font-tech font-bold text-lg uppercase tracking-widest">Proceed to Setup</span>
                        <ArrowRight className="w-5 h-5 group-hover/next:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}