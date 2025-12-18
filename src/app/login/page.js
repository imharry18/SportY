'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // 1. Import AuthContext

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // 2. Get the login function from Context
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
        // 3. TELL THE APP WE ARE LOGGED IN! (This updates the Navbar)
        login(data.user); 
        
        // 4. Redirect to home
        router.push('/'); 
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex items-center justify-center relative overflow-hidden py-10">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-sm p-6 relative z-10">
        <div className="bg-black border border-white/10 rounded-2xl p-8 shadow-2xl relative">
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-10 h-10 relative mb-4">
               <Image src="/logo.png" alt="SportY" fill className="object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">Welcome Back</h1>
            <p className="text-gray-500 text-xs mt-1">Enter credentials to access console.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-xs text-center font-bold">{error}</div>}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})} 
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-all text-sm" 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Password</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm({...form, password: e.target.value})} 
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-all text-sm" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-2 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/register" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider font-bold">
              Create New Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}