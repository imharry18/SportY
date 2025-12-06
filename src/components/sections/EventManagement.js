'use client';
import { Trophy, Calendar, ArrowRight, Plus, Grip, Layers, Activity } from 'lucide-react';

// MOCK DATA: Toggle 'hasEvents' to false to see the empty state UI
const USER_STATE = {
  hasEvents: true, 
  events: [
    { id: 1, name: "Inter-Year Cricket Bash", role: "Admin", status: "LIVE", type: "T-10" },
    { id: 2, name: "CS Dept. Futsal Cup", role: "Player", status: "UPCOMING", type: "5v5" }
  ]
};

export default function EventManagementSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center py-20 px-6 bg-[#030303] border-t border-white/5 overflow-hidden">
      
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* --- LEFT SIDE: THE PITCH (Features) --- */}
        <div className="flex flex-col justify-center gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-0.5 bg-brand"></span>
                <span className="text-brand font-mono text-xs uppercase tracking-[0.3em]">Control Center</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-tech font-bold text-white uppercase leading-[0.9]">
              Total <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-glow">Dominance.</span>
            </h2>
            <p className="text-white/50 text-lg font-clean leading-relaxed max-w-md border-l-2 border-white/5 pl-6">
              A unified command center for your tournaments. Initialize brackets, handle digital registrations, and manage live scoring effortlessly.
            </p>
          </div>

          {/* Minimal Feature List */}
          <div className="grid gap-4">
            {[
                { icon: Grip, label: "Digital Forms", desc: "Paperless Registration" },
                { icon: Layers, label: "Auto-Fixtures", desc: "Instant Bracket Generation" },
                { icon: Activity, label: "Live Stats", desc: "Real-time NRR & Points" }
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-brand/30 hover:bg-white/[0.04] transition-all group">
                    <div className="p-2 bg-black rounded-lg border border-white/10 text-white/40 group-hover:text-brand transition-colors">
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold font-tech uppercase tracking-wide group-hover:text-brand-glow transition-colors">{item.label}</h4>
                        <p className="text-xs text-white/30 font-mono">{item.desc}</p>
                    </div>
                </div>
            ))}
          </div>

          {/* Action Button */}
          <button className="group w-fit flex items-center gap-3 px-8 py-4 border border-white/20 text-white cut-corners-sm hover:bg-brand hover:border-brand transition-all shadow-lg hover:shadow-brand/20">
            <Plus className="w-5 h-5" />
            <span className="font-tech font-bold text-lg uppercase tracking-wider">Initialize New Event</span>
          </button>

        </div>

        {/* --- RIGHT SIDE: USER DASHBOARD --- */}
        <div className="relative h-full min-h-[500px] flex flex-col justify-center">
            
            {/* Glow Behind */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-brand/10 blur-[100px] rounded-full"></div>

            <div className="bg-[#080808] border border-white/10 cut-corners p-1 relative overflow-hidden shadow-2xl group hover:border-brand/40 transition-colors duration-500">
                <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
                
                <div className="bg-[#050505] p-8 md:p-10 relative h-full flex flex-col">
                    
                    <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
                        <div>
                            <h3 className="text-3xl font-tech font-bold text-white uppercase tracking-tight">My Events</h3>
                            <p className="text-xs font-mono text-white/30 mt-1">DASHBOARD_VIEW_v2</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Sync Active</span>
                        </div>
                    </div>

                    {/* CONDITIONAL CONTENT */}
                    {USER_STATE.hasEvents ? (
                        <div className="flex flex-col gap-4">
                            {USER_STATE.events.map((event, i) => (
                                <div key={event.id} className="group/card relative flex items-center justify-between p-6 bg-white/[0.02] border-l-[3px] border-brand/50 hover:bg-white/[0.05] hover:border-brand transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-brand/5 translate-x-[-100%] group-hover/card:translate-x-0 transition-transform duration-500"></div>
                                    
                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center font-tech font-bold text-xl text-white/50 group-hover/card:text-white group-hover/card:border-brand/50 transition-all">
                                            0{event.id}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white leading-none mb-2 group-hover/card:text-brand-glow transition-colors">{event.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/60 uppercase">{event.role}</span>
                                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{event.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 text-right">
                                        <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${event.status === 'LIVE' ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
                                            ● {event.status}
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-white/20 ml-auto group-hover/card:text-white group-hover/card:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                            
                            <div className="mt-4 pt-4 border-t border-dashed border-white/10 text-center">
                                <p className="text-xs font-mono text-white/30">Showing 2 of 2 Active Events</p>
                            </div>
                        </div>
                    ) : (
                        // EMPTY STATE UI
                        <div className="flex flex-col items-center justify-center text-center py-16 gap-6 opacity-60">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                                <Trophy className="w-10 h-10 text-white/20" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-xl font-tech uppercase tracking-wide">No Active Events</h4>
                                <p className="text-xs font-mono text-white/40 mt-2 max-w-xs mx-auto">You haven't participated in or created any tournaments yet. Start your journey now.</p>
                            </div>
                            <button className="text-brand font-bold text-xs uppercase tracking-widest hover:text-white transition-colors border-b border-brand hover:border-white pb-0.5">
                                + Create First Event
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>

      </div>
    </section>
  );
}