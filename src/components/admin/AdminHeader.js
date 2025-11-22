import { Gavel, Users, Database } from 'lucide-react';

export default function AdminHeader({ auctionName, activeTab, setActiveTab }) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h1 className="font-tech font-bold text-xl uppercase tracking-widest text-white">Admin <span className="text-brand">Console</span></h1>
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <span className="text-xs text-white/40 font-mono hidden md:inline-block">{auctionName}</span>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg">
            {[{ id: 'CONSOLE', icon: Gavel, label: 'Live Console' },{ id: 'TEAMS', icon: Users, label: 'Teams' },{ id: 'MANAGE', icon: Database, label: 'Database' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                    <tab.icon className="w-3 h-3" /> <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
        </div>
    </header>
  );
}