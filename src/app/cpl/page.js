'use client';
import { useState } from 'react';
import Image from 'next/image';
// 👇 Added 'Trophy' to imports to fix your error
import { 
  Calendar, MapPin, Clock, Users, Shield, Flame, 
  ArrowRight, BookOpen, X, Trophy, CheckCircle, Info 
} from 'lucide-react';
import Footer from '@/components/layout/Footer';

// --- IMPORT DATA ---
import { CPL_TEAMS } from '@/data/cplTeams';
import { CPL_FIXTURES } from '@/data/cplFixtures';
import { CPL_RULES } from '@/data/cplRules'; // <--- New Import

export default function CPLPage() {
  const [activeTab, setActiveTab] = useState('TEAMS'); 
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-amber-500/30 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-amber-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[5000ms]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-md">
                <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Season 03 is Here</span>
            </div>

            <h1 className="text-8xl md:text-[10rem] font-tech font-bold uppercase leading-[0.8] tracking-tight drop-shadow-2xl">
                <span className="text-white">Campus</span><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">League</span>
            </h1>

            <p className="text-white/50 text-lg font-clean max-w-xl mx-auto border-l-2 border-amber-500/30 pl-6 text-left md:text-center md:border-l-0 md:border-t-2 md:pt-6 md:pl-0">
                Witness the clash of 8 elite franchises battling for the ultimate glory. Strategy, passion, and skill collide in Season 3.
            </p>

            <div className="flex gap-4 mt-4">
                <button 
                    onClick={() => setShowRulesModal(true)}
                    className="group px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-amber-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-2"
                >
                    <BookOpen className="w-4 h-4" /> Rule Book
                </button>
            </div>
        </div>
      </section>

      {/* --- MAIN CONTENT TABS --- */}
      <main id="content-grid" className="max-w-[1400px] mx-auto px-6 py-24 relative z-10">
        <div className="flex justify-center mb-16">
            <div className="bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md flex gap-2">
                {['TEAMS', 'FIXTURES'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                            activeTab === tab 
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* TEAMS GRID */}
        {activeTab === 'TEAMS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
                {CPL_TEAMS.map((team, i) => (
                    <div key={team.id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 overflow-hidden hover:border-amber-500/50 transition-colors duration-500 flex flex-col h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col items-center text-center gap-6 flex-1">
                            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 shadow-2xl overflow-hidden" style={{ borderColor: `${team.color}33` }}>
                                <Image src={team.logo} alt={team.name} fill className="object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                <Shield className="w-10 h-10 absolute z-[-1]" style={{ color: team.color }} />
                                <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-white text-black font-tech font-bold flex items-center justify-center rounded-lg shadow-lg text-sm z-10">0{i+1}</div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-tech font-bold text-white uppercase leading-none mb-2 break-words">{team.name}</h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{team.desc}</p>
                                <div className="h-px w-12 bg-white/10 mx-auto my-3"></div>
                                <p className="text-xs font-mono text-white/60 uppercase tracking-widest">Cap: <span className="text-white font-bold">{team.captain}</span></p>
                            </div>
                            <div className="mt-auto w-full pt-4">
                                <button onClick={() => setSelectedTeam(team)} className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-2">
                                    <Users className="w-3 h-3" /> View Squad
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* FIXTURES LIST */}
        {activeTab === 'FIXTURES' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-in slide-in-from-bottom-8 duration-500">
                {CPL_FIXTURES.map((fix) => (
                    <div key={fix.id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-orange-500/30 transition-all hover:bg-white/[0.01]">
                        <div className="flex flex-row md:flex-col items-center gap-2 md:gap-1 min-w-[100px] border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6 border-dashed">
                            <Calendar className="w-5 h-5 text-orange-500 mb-1" />
                            <div className="text-center">
                                <span className="block text-xl font-bold text-white uppercase">{fix.date}</span>
                                <span className="block text-[10px] font-mono text-white/40">{fix.time}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                            <span className="text-xl md:text-3xl font-tech font-bold text-white uppercase text-center">{fix.teamA}</span>
                            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-widest">VS</span>
                            <span className="text-xl md:text-3xl font-tech font-bold text-white uppercase text-center">{fix.teamB}</span>
                        </div>
                        <div className="min-w-[140px] text-center md:text-right pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 border-dashed">
                            <div className="flex items-center justify-center md:justify-end gap-2 mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                <MapPin className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Venue</span>
                            </div>
                            <span className="text-sm font-medium text-white">{fix.venue}</span>
                        </div>
                    </div>
                ))}
                <div className="mt-12 p-8 border border-white/10 border-dashed rounded-2xl text-center bg-white/[0.02]">
                    <Clock className="w-6 h-6 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40 font-mono uppercase tracking-widest">More fixtures to be announced post-auction</p>
                </div>
            </div>
        )}
      </main>

      {/* --- RULE BOOK MODAL (DYNAMIC) --- */}
      {showRulesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col relative shadow-2xl animate-in zoom-in-95 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-[#0f0f11] flex justify-between items-center shrink-0">
                    <h2 className="text-2xl font-tech font-bold text-white uppercase flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-amber-500" /> Official Rule Book <span className="text-white/20 text-sm font-mono">v3.0</span>
                    </h2>
                    <button onClick={() => setShowRulesModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-[#050505] custom-scrollbar space-y-8">
                    {CPL_RULES.map((rule) => (
                        <section key={rule.id}>
                            <h3 className={`${rule.color} font-bold uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2`}>{rule.title}</h3>
                            
                            {/* Case 1: Simple Grid Content */}
                            {rule.content && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rule.content.map((item, i) => (
                                        <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                            <div className="text-xl font-bold text-white">{item.label}</div>
                                            <div className="text-[10px] text-white/40 uppercase">{item.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Case 2: List Items */}
                            {rule.list && (
                                <ul className="space-y-3 text-sm text-white/70 font-clean">
                                    {rule.list.map((li, i) => (
                                        <li key={i} className="flex gap-3"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {li}</li>
                                    ))}
                                </ul>
                            )}

                            {/* Case 3: Cards (Penalties) */}
                            {rule.cards && (
                                <div className="space-y-4">
                                    {rule.cards.map((card, i) => (
                                        <div key={i} className={`flex items-start gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-lg`}>
                                            <card.icon className={`w-5 h-5 ${card.iconColor} shrink-0 mt-0.5`} />
                                            <div>
                                                <div className={`text-sm font-bold ${card.titleColor}`}>{card.title}</div>
                                                <div className="text-xs text-white/50 mt-1">{card.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                    <p className="text-center text-[10px] text-white/30 uppercase tracking-widest font-mono pt-4">Umpire's decision is final in all situations.</p>
                </div>
            </div>
        </div>
      )}

      {/* --- SQUAD MODAL --- */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col relative shadow-2xl animate-in zoom-in-95 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-[#0a0a0a] flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden" style={{ borderColor: selectedTeam.color }}>
                             <div className="relative w-full h-full">
                                <Image src={selectedTeam.logo} alt={selectedTeam.name} fill className="object-cover" />
                             </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-tech font-bold text-white uppercase leading-none">{selectedTeam.name}</h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Full Squad Roster</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedTeam(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#050505] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedTeam.squad.map((player, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.06] transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 font-mono">
                                    {idx + 1}
                                </div>
                                <span className="text-sm font-medium text-white">{player}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t border-white/10 bg-[#0a0a0a] text-center">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Total Players: {selectedTeam.squad.length}</span>
                </div>
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
}