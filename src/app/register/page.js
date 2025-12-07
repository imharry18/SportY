// Add these fields to your state
const [form, setForm] = useState({ 
  email: '', password: '', confirmPassword: '',
  fullName: '', age: '', playerRole: 'Batsman', battingStyle: 'Right-hand', bowlingStyle: 'None'
});

// ... Inside your form JSX, add these inputs BEFORE the email input ...

{/* Full Name */}
<div className="space-y-1">
  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Full Name</label>
  <input 
    type="text" 
    placeholder="e.g. Virat Kohli"
    value={form.fullName}
    onChange={(e) => setForm({...form, fullName: e.target.value})}
    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-clean text-sm"
    required
  />
</div>

{/* Age & Role Row */}
<div className="grid grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Age</label>
      <input 
        type="number" 
        value={form.age}
        onChange={(e) => setForm({...form, age: e.target.value})}
        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
        required
      />
    </div>
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Role</label>
      <select 
        value={form.playerRole}
        onChange={(e) => setForm({...form, playerRole: e.target.value})}
        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm appearance-none"
      >
        <option>Batsman</option>
        <option>Bowler</option>
        <option>All-Rounder</option>
        <option>Wicketkeeper</option>
      </select>
    </div>
</div>

{/* Styles Row */}
<div className="grid grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Batting Style</label>
      <select 
        value={form.battingStyle}
        onChange={(e) => setForm({...form, battingStyle: e.target.value})}
        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
      >
        <option>Right-hand</option>
        <option>Left-hand</option>
      </select>
    </div>
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Bowling Style</label>
      <select 
        value={form.bowlingStyle}
        onChange={(e) => setForm({...form, bowlingStyle: e.target.value})}
        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
      >
        <option>None</option>
        <option>Right-arm Fast</option>
        <option>Right-arm Spin</option>
        <option>Left-arm Fast</option>
        <option>Left-arm Spin</option>
      </select>
    </div>
</div>