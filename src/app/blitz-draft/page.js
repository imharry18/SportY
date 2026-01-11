'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Timer, Zap, ArrowRight, Shield, Rocket, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx'; 

// --- HELPER: Rolling Number Animation ---
function NumberTicker({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 500; // Animation speed in ms (Fast)
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth speed
      const ease = 1 - Math.pow(1 - progress, 3); 
      
      const current = Math.floor(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue.toLocaleString('en-IN')}</>;
}

// ✅ FINAL Google Drive Image Resolver (SAFE + STABLE)
const resolveImage = (imgString) => {
  if (!imgString) return null;

  const url = imgString.trim();
  let fileId = null;

  // open?id=FILE_ID
  if (url.includes("open?id=")) {
    fileId = url.split("open?id=")[1];
  }

  // file/d/FILE_ID/view
  else if (url.includes("/file/d/")) {
    fileId = url.split("/d/")[1]?.split("/")[0];
  }

  if (fileId) {
    // 🔥 Thumbnail API (best possible from Drive)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  }

  // Local / absolute fallback
  if (!url.startsWith("http") && !url.startsWith("/")) {
    return `/${url}`;
  }

  return url;
};

// --- HELPER: Parse Currency ---
const parseCurrency = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  
  const clean = value.toString().toUpperCase().replace(/,/g, '');
  const num = parseFloat(clean);
  
  if (isNaN(num)) return 0;
  
  if (clean.includes('L')) return num * 100000;
  if (clean.includes('CR')) return num * 10000000;
  if (clean.includes('K')) return num * 1000;
  
  return num; 
};

export default function BlitzDraftPage() {
  const [view, setView] = useState('LANDING'); 
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // --- ARENA STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [direction, setDirection] = useState(0); 
  
  // NEW: Track Image Loading
  const [imageLoading, setImageLoading] = useState(true);

  // --- FILE UPLOAD ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      let parsedData = [];

      try {
        if (file.name.endsWith('.csv')) {
          const text = new TextDecoder().decode(new Uint8Array(bstr));
          const rows = text.split('\n').slice(1);
          parsedData = rows.map(row => {
              const cols = row.split(',');
              if (cols.length < 2) return null;
              return {
                  name: cols[0]?.trim(),
                  price: parseCurrency(cols[1]?.trim()),
                  role: cols[2]?.trim(),
                  image: resolveImage(cols[3])
              };
          }).filter(Boolean);
        } else {
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const jsonData = XLSX.utils.sheet_to_json(ws);
          
          parsedData = jsonData.map(row => ({
              name: row['Name'] || row['name'],
              price: parseCurrency(row['BasePrice'] || row['baseprice'] || row['Price']),
              role: row['Role'] || row['role'] || row['Category'],
              image: resolveImage(row['ImageLink'] || row['imagelink'] || row['Image'])
          }));
        }
        setRoster(parsedData);
      } catch (err) {
        console.error(err);
        alert("Error parsing file.");
      }
      setLoading(false);
    };

    if (file.name.endsWith('.csv')) reader.readAsArrayBuffer(file);
    else reader.readAsBinaryString(file);
  };

  // --- HELPER: Change Player & Reset Loading ---
  const changePlayer = (newIndex, newDirection) => {
      const player = roster[newIndex];
      setDirection(newDirection);
      setCurrentIndex(newIndex);
      setCurrentBid(player.price);
      
      // If player has an image, start loading. Else show immediately.
      if (player.image) {
          setImageLoading(true);
      } else {
          setImageLoading(false);
      }
  };

  // --- CONTROLS ---
  const handleKeyDown = useCallback((e) => {
    if (view !== 'ARENA') return;

    const getIncrement = (price) => {
        if (price < 10000000) return 2000000;   
        if (price < 100000000) return 10000000; 
        return 20000000;                      
    };
    const increment = getIncrement(currentBid);

    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            setCurrentBid(prev => prev + increment);
            break;
        case 'ArrowDown':
            e.preventDefault();
            const basePrice = roster[currentIndex].price;
            setCurrentBid(prev => Math.max(basePrice, prev - increment));
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (currentIndex < roster.length - 1) {
                changePlayer(currentIndex + 1, 1);
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (currentIndex > 0) {
                changePlayer(currentIndex - 1, -1);
            }
            break;
    }
  }, [view, currentBid, currentIndex, roster]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);


  // --- VIEW RENDERING ---

  if (view === 'LANDING') {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
            <div className="max-w-4xl px-6 text-center z-10 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                    <Timer className="w-10 h-10 text-yellow-500" />
                </div>
                <h1 className="text-7xl font-tech font-bold uppercase tracking-tighter mb-4">Blitz <span className="text-yellow-500">Draft</span></h1>
                <p className="text-white/50 text-xl font-clean mb-10">High-speed auction console.</p>
                <button onClick={() => setView('SETUP')} className="bg-yellow-500 text-black px-10 py-4 font-bold uppercase tracking-widest cut-corners-sm hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                    Initialize System <ArrowRight className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
  }

  if (view === 'SETUP') {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative">
            <div className="w-full max-w-2xl z-10">
                <button onClick={() => setView('LANDING')} className="text-white/40 hover:text-white mb-6 flex items-center gap-2 uppercase text-xs font-bold"><ChevronLeft className="w-4 h-4" /> Back</button>
                <div className="bg-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10 relative overflow-hidden">
                    <h2 className="text-3xl font-tech font-bold uppercase mb-2">Import Data</h2>
                    <p className="text-white/40 text-sm mb-8">Headers: <strong>Name, BasePrice, Role, ImageLink</strong>.</p>
                    <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all ${fileName ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10 hover:border-white/30'}`}>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv, .xlsx" className="hidden" />
                        {loading ? <Loader2 className="w-8 h-8 text-yellow-500 animate-spin"/> : fileName ? (
                            <div className="text-center"><FileSpreadsheet className="w-8 h-8 text-yellow-500 mx-auto mb-2"/><p className="text-white font-bold">{fileName}</p><p className="text-xs text-white/40">{roster.length} Players</p></div>
                        ) : (
                            <div className="text-center"><Upload className="w-8 h-8 text-white/20 mx-auto mb-2"/><p className="text-sm font-bold uppercase">Click to Upload</p></div>
                        )}
                    </div>
                    {roster.length > 0 && (
                        <div className="mt-6">
                            <button onClick={() => { setCurrentBid(roster[0].price); setView('ARENA'); }} className="w-full py-4 bg-yellow-500 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                                Enter Arena <Zap className="w-5 h-5 fill-current"/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  }

  // --- THE BLITZ ARENA ---
  if (view === 'ARENA') {
    const player = roster[currentIndex];

    return (
        <div className="h-screen bg-black text-white flex flex-col relative overflow-hidden">
            {/* BG Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Top Bar */}
            <div className="relative z-10 p-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Live Auction Feed</span>
                </div>
                <div className="text-xs font-mono text-white/20 uppercase tracking-widest">
                    Player {currentIndex + 1} / {roster.length}
                </div>
                <Link href="/" className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                    Exit Console
                </Link>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="flex-1 flex items-center justify-center relative z-10 px-12 pb-12">
                <div key={player.name} className={`flex flex-col md:flex-row w-full h-full gap-16 items-center animate-in fade-in zoom-in-95 duration-500 ${direction > 0 ? 'slide-in-from-right-10' : 'slide-in-from-left-10'}`}>
                    
                    {/* LEFT: CLEAN IMAGE CARD */}
                    <div className="w-full md:w-[45%] h-full max-h-[80vh] relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 opacity-50 pointer-events-none"></div>
                        
                        {/* Loading Spinner Over Image */}
                        {imageLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0a0a0a]">
                                <Loader2 className="w-16 h-16 text-yellow-500 animate-spin mb-4" />
                                <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest">Retrieving Asset...</span>
                            </div>
                        )}

                        {player.image ? (
                            <img 
                                src={player.image} 
                                alt={player.name} 
                                onLoad={() => setImageLoading(false)} // Reveal on load
                                className={`w-full h-full object-contain p-4 transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                <Shield className="w-32 h-32 text-white/10" />
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DATA & PRICE */}
                    {/* If Loading, hide this entire panel or show skeleton */}
                    <div className={`flex-1 flex flex-col justify-center items-start h-full transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}>
                        
                        {/* 1. Role Badge */}
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-white/10 border border-white/10 rounded-full text-sm font-bold text-yellow-500 uppercase tracking-[0.2em] shadow-lg">
                                {player.role || 'Uncategorized'}
                            </span>
                        </div>

                        {/* 2. Player Name (Huge) */}
                        <h1 className="text-7xl md:text-9xl font-tech font-bold text-white uppercase leading-[0.85] tracking-tighter mb-12 drop-shadow-xl break-words w-full">
                            {player.name}
                        </h1>

                        {/* 3. Divider */}
                        <div className="w-32 h-1 bg-yellow-500/50 mb-12 rounded-full"></div>

                        {/* 4. Price Console */}
                        <div className="w-full">
                            <div className="flex items-end justify-between mb-2">
                                <p className="text-white/40 font-mono text-sm uppercase tracking-[0.3em] font-bold">
                                    Current Valuation
                                </p>
                                <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-wider bg-green-900/10 px-3 py-1 rounded-full border border-green-900/30">
                                    <ArrowRight className="w-3 h-3 -rotate-45" /> Trending Up
                                </div>
                            </div>
                            
                            {/* Animated Ticker */}
                            <div className="text-[7rem] md:text-[9rem] leading-none font-tech font-bold text-white tracking-tighter drop-shadow-2xl flex items-baseline">
                                <span className="text-5xl opacity-20 mr-4 font-clean">₹</span>
                                <NumberTicker value={currentBid} />
                            </div>
                        </div>

                        {/* 5. Base Price Small */}
                        <div className="mt-8 text-white/20 font-mono text-xs uppercase tracking-widest">
                            Base: ₹ {player.price.toLocaleString()}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
  }

  return null;
}