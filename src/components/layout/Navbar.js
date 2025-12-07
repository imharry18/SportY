'use client';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Fixtures', href: '/fixtures' },
  { name: 'Teams', href: '/teams' },
  { name: 'Analytics', href: '/analytics' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 w-full z-50 bg-black border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Brand Logo - Matched to Image */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 relative transition-transform group-hover:scale-110 duration-300">
            {/* Ensure logo.png is the red sporty logo from your image */}
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
        
        {/* Navigation & Actions */}
        <div className="flex items-center gap-10">
          
          {/* Nav Links - Uppercase, Gray to White hover */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>

          {/* Logic: Login Button OR Profile Menu */}
          {!user ? (
            // STATE: LOGGED OUT - Exact White Cut-Corner Button
            <Link href="/login">
              <button 
                className="px-8 py-2 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-all"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
              >
                Login
              </button>
            </Link>
          ) : (
            // STATE: LOGGED IN - Profile
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-white/5 p-1 pr-4 rounded-full transition-all border border-transparent hover:border-white/10"
              >
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold shadow-lg text-sm">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-white leading-none">{user.email.split('@')[0]}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-48 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1 z-50">
                  <Link href="/profile">
                    <button className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 hover:text-red-500 transition-colors uppercase tracking-wide">
                      Complete Profile
                    </button>
                  </Link>
                  <div className="h-px bg-white/5"></div>
                  <button 
                    onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                    }} 
                    className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-wide"
                  >
                    Logout
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