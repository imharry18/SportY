'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Basic Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // 2. Call the API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Success: Send them to login
        alert("Account created! Please log in.");
        router.push('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-6 relative z-10">
        
        {/* Register Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-10 h-10 relative mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
               <Image src="/logo.png" alt="SportY" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-clean font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-white/40 text-xs mt-1">Join the SportY ecosystem today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-bold">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-clean text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Password</label>
              <input 
                type="password" 
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-clean text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                className={`w-full bg-[#050505] border rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none transition-all font-clean text-sm ${
                    form.confirmPassword && form.password !== form.confirmPassword 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-white/10 focus:border-cyan-500/50'
                }`}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-2 bg-white hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wide rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#0a0a0a] px-2 text-white/30 font-bold">Or</span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm text-white hover:text-cyan-400 transition-colors font-medium border-b border-white/20 hover:border-cyan-400 pb-0.5">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}