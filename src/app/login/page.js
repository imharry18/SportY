'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Success: Redirect to home or dashboard
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex items-center justify-center relative overflow-hidden">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-6 relative z-10">
        
        {/* Login Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 relative mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
               <Image src="/logo.png" alt="SportY" fill className="object-contain" />
            </div>
            <h1 className="text-3xl font-clean font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-white/40 text-sm mt-1">Enter your credentials to access the console.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-bold">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-clean"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest pl-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-clean"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wide rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#0a0a0a] px-2 text-white/30 font-bold">New Here?</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link href="/register" className="text-sm text-white hover:text-cyan-400 transition-colors font-medium border-b border-white/20 hover:border-cyan-400 pb-0.5">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}