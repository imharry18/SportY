'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateAuction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'CPL Season 3',
    budget: '50000000', // 5 Crore default
    passcode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auction/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect to Admin Dashboard on success (we'll build this later)
        alert('Auction Created Successfully!');
        router.push('/'); 
      } else {
        alert('Error creating auction.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl p-6 relative z-10">
        
        {/* Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-tech text-white mb-2">
              Initialize <span className="text-cyan-400">Protocol</span>
            </h1>
            <p className="text-white/40 font-clean text-sm">Configure the parameters for the new auction event.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input 1: Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Tournament Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-clean"
              />
            </div>

            {/* Input 2: Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Team Budget (Purse)</label>
              <div className="relative">
                <span className="absolute left-6 top-4 text-white/30">₹</span>
                <input 
                  type="number" 
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                />
              </div>
            </div>

            {/* Input 3: Passcode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Room Access Code</label>
              <input 
                type="text" 
                placeholder="CPL-2025-SECRET"
                value={formData.passcode}
                onChange={(e) => setFormData({...formData, passcode: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-mono tracking-wider"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 mt-4 bg-white hover:bg-cyan-400 hover:scale-[1.02] text-black font-bold text-lg rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing...' : 'Deploy Auction Server'}
              {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            </button>

          </form>

          {/* Back Button */}
          <button onClick={() => router.back()} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors">
            ✕
          </button>
        </div>

      </div>
    </div>
  );
}