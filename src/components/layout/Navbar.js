'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // 1. Import usePathname
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';

// Define your navigation links here
const NAV_LINKS = [
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Fixtures', href: '/fixtures' },
  { name: 'Teams', href: '/teams' },
  { name: 'Analytics', href: '/analytics' },
];

export default function Navbar() {
  const pathname = usePathname(); // 2. Get the current route
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 3. HIDE NAVBAR LOGIC
  // If we are on the blitz-draft page, render nothing (null)
  if (pathname === '/blitz-draft') {
    return null;
  }

  return (
    <header className="sticky top-0 w-full z-50 bg-[#050505] border-b border-white/10 backdrop-blur-md bg-opacity-80">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* --- BRAND LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 relative transition-transform group-hover:scale-110 duration-300">
            <Image src="/logo.png" alt="SportY" fill className="object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-sans font-bold text-white leading-none tracking-wide">
              SPORT<span className="text-red-600">Y</span>
            </span>
            <span className="text-[9px] font-sans font-medium text-gray-500 tracking-[0.2em] uppercase mt-0.5">
              Enterprise Console
            </span>
          </div>
        </Link>
        
        {/* --- NAVIGATION & ACTIONS --- */}
        <div className="flex items-center gap-10">
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Vertical Divider */}
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>

          {/* --- AUTH LOGIC --- */}
          {!user ? (
            // OPTION A: NOT LOGGED IN (Show Login Button)
            <Link href="/login">
              <button 
                className="px-8 py-2 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
              >
                Login
              </button>
            </Link>
          ) : (
            // OPTION B: LOGGED IN (Show Profile Icon)
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-white/5 p-1 pr-4 rounded-full transition-all border border-transparent hover:border-white/10"
              >
                {/* User Avatar Circle */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold shadow-lg text-sm">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                
                {/* User Name Display */}
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-white leading-none">
                    {user.fullName || user.email.split('@')[0]}
                  </p>
                  <p className="text-[9px] text-red-400 font-mono mt-0.5">
                    {user.role || 'PLAYER'}
                  </p>
                </div>
              </button>

              {/* --- DROPDOWN MENU --- */}
              {showProfileMenu && (
                <div className="absolute right-0 top-14 w-48 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  
                  {/* Option 1: My Account */}
                  <Link href="/profile">
                    <button 
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 hover:text-cyan-400 transition-colors uppercase tracking-wide flex items-center gap-2"
                    >
                      <span>👤</span> My Account
                    </button>
                  </Link>

                  <div className="h-px bg-white/5 mx-2"></div>
                  
                  {/* Option 2: Logout */}
                  <button 
                    onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                    }} 
                    className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-wide flex items-center gap-2"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}