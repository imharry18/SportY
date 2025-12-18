'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Copy, CheckCircle, ArrowRight, Shield, Zap, Upload } from 'lucide-react';

export default function CreateAuction() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1 = Input, 2 = Success/Credentials
  const [formData, setFormData] = useState({ name: '', logo: null });
  const [generatedCreds, setGeneratedCreds] = useState({ leagueId: '', passcode: '' });
  const [copied, setCopied] = useState(false);

  // 1. Auth Protection
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  // 2. Handle Creation
  const handleCreate = (e) => {
    e.preventDefault();
    // Simulate ID Generation (In production, this comes from your DB)
    const mockLeagueId = `CPL-${Math.random().toString(36).substr(2, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    const mockPasscode = Math.random().toString(36).slice(-8).toUpperCase();
    
    setGeneratedCreds({ leagueId: mockLeagueId, passcode: mockPasscode });
    setStep(2);
  };

  const copyToClipboard = () => {
    const text = `League ID: ${generatedCreds.leagueId}\nPasscode: ${generatedCreds.passcode}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null; // Prevent flash

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center relative overflow-hidden py-20 px-6">
      
      {/* Background FX */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none animate-pulse"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* --- STEP 1: INPUT DETAILS --- */}
        {step === 1 && (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 lg:p-14 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h1 className="text-5xl font-tech font-bold text-white mb-2 uppercase tracking-tight">
                Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-glow">Protocol</span>
              </h1>
              <p className="text-white/40 font-clean text-sm mb-10 border-l-2 border-brand/30 pl-4">
                Configure your tournament parameters. System will generate secure credentials.
              </p>

              <form onSubmit={handleCreate} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand uppercase tracking-[0.2em]">Tournament Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-6 py-4 text-white font-tech text-xl focus:outline-none focus:border-brand/50 transition-all placeholder:text-white/10"
                    placeholder="ENTER LEAGUE NAME..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand uppercase tracking-[0.2em]">League Logo (Optional)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-brand/30 hover:bg-white/[0.02] transition-all group/upload">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-white/20 mb-2 group-hover/upload:text-brand transition-colors" />
                        <p className="text-xs text-white/30 uppercase tracking-widest">Click to Upload</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>

                <button type="submit" className="w-full group relative px-8 py-5 bg-white text-black cut-corners-sm overflow-hidden transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <Zap className="w-5 h-5 group-hover:text-white transition-colors" />
                        <span className="font-tech font-bold text-xl uppercase tracking-widest group-hover:text-white transition-colors">Generate Lobby</span>
                    </div>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- STEP 2: SUCCESS & CREDENTIALS --- */}
        {step === 2 && (
          <div className="bg-[#0a0a0a] border border-green-500/20 rounded-[2rem] p-10 lg:p-14 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Success Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-8">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <div>
                    <h2 className="text-3xl font-tech font-bold text-white uppercase">System Ready</h2>
                    <p className="text-xs text-white/40 font-mono">CREDENTIALS_GENERATED_SUCCESSFULLY</p>
                </div>
            </div>

            {/* Credentials Card */}
            <div className="bg-[#050505] border border-white/10 rounded-xl p-6 relative group mb-8">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">League ID</div>
                        <div className="text-2xl font-mono text-brand-glow font-bold tracking-wider">{generatedCreds.leagueId}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Passcode</div>
                        <div className="text-2xl font-mono text-white font-bold tracking-wider">{generatedCreds.passcode}</div>
                    </div>
                </div>
                
                {/* Copy Button */}
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors group/copy"
                    title="Copy Credentials"
                >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-white/40 group-hover/copy:text-white" />}
                </button>
            </div>

            <div className="flex flex-col gap-3">
                <p className="text-center text-xs text-white/30 mb-2 uppercase tracking-widest">Share these credentials with your team owners</p>
                
                <button 
                    onClick={() => router.push(`/setup-auction?id=${generatedCreds.leagueId}&key=${generatedCreds.passcode}`)}
                    className="w-full py-4 bg-brand hover:bg-brand-glow ..."
                >
                    Proceed to Setup <ArrowRight className="w-5 h-5" />
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}