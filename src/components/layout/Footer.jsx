'use client';
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020202] mt-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Brand Column */}
            <div className="md:col-span-4 flex flex-col gap-6">
                <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-8 h-8 relative grayscale">
                        <Image src="/logo.png" alt="SportY" fill className="object-contain" />
                    </div>
                    <span className="text-xl font-tech font-bold text-white tracking-wide">
                        SPORT<span className="text-brand">Y</span>
                    </span>
                </div>
                <p className="text-sm text-white/40 font-clean leading-relaxed max-w-xs">
                    The advanced operating system for campus leagues. Elevating collegiate sports with professional-grade tools.
                </p>
                <div className="flex gap-4">
                    {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                        <a key={i} href="#" className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:bg-white hover:text-black hover:border-white transition-all">
                            <Icon className="w-4 h-4" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2">
                <h4 className="text-white font-bold font-tech uppercase tracking-widest mb-6 text-sm">Platform</h4>
                <ul className="flex flex-col gap-3 text-sm text-white/40 font-clean">
                    {['Tournaments', 'Auctions', 'Players', 'Scoring'].map(item => (
                        <li key={item}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>

            <div className="md:col-span-2">
                <h4 className="text-white font-bold font-tech uppercase tracking-widest mb-6 text-sm">Resources</h4>
                <ul className="flex flex-col gap-3 text-sm text-white/40 font-clean">
                    {['Documentation', 'API Access', 'Guide', 'Support'].map(item => (
                        <li key={item}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
                    ))}
                </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-4">
                <h4 className="text-white font-bold font-tech uppercase tracking-widest mb-6 text-sm">Stay Updated</h4>
                <p className="text-xs text-white/30 mb-4">Get the latest feature updates and league news.</p>
                <div className="flex">
                    <input type="email" placeholder="Enter email address" className="bg-white/5 border border-white/10 text-white px-4 py-2 text-sm w-full focus:outline-none focus:border-brand/50 font-mono" />
                    <button className="px-6 py-2 bg-brand text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-glow transition-colors">
                        Join
                    </button>
                </div>
            </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-widest font-mono">
            <span>© 2025 SportY Inc. All rights reserved.</span>
            <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>

      </div>
    </footer>
  );
}