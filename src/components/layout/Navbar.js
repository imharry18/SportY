'use client';
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Fixtures', href: '/fixtures' },
  { name: 'Teams', href: '/teams' },
  { name: 'Analytics', href: '/analytics' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 relative drop-shadow-[0_0_15px_rgba(230,46,46,0.5)] transition-transform group-hover:scale-110 duration-300">
            <Image src="/logo.png" alt="SportY" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-tech font-bold text-white leading-none tracking-wide">
              SPORT<span className="text-brand">Y</span>
            </span>
            <span className="text-[10px] font-clean font-semibold text-white/40 tracking-[0.2em] uppercase">
              Enterprise Console
            </span>
          </div>
        </Link>
        
        {/* Navigation & Actions */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-sm font-tech font-medium text-white/60 hover:text-white hover:text-glow transition-all uppercase tracking-wider">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          
          <button className="px-8 py-2 cut-corners-sm bg-white text-black font-tech font-bold text-sm uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(230,46,46,0.4)]">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}