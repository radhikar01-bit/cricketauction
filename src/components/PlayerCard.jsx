import React from 'react';

const PlayerCard = ({
    player,
    currentRound,
    availableCount,
    currentIndex,
    basePrice,
    currentBid,
    highestBidderId,
    bidIncrement
}) => {
    if (!player) return null;

    const nextBid = highestBidderId ? currentBid + bidIncrement : basePrice;

    const nameParts = player.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // High-impact cricket placeholder image
    const DEFAULT_CRICKET_IMG = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop";

    return (
        <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-blue-500/30">

            {/* 1. PLAYER IMAGE SECTION */}
            <div className="relative w-full h-80 mb-6 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/50 flex items-center justify-center">

                {/* Background Decorative Initial */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none z-0">
                    <span className="text-[18rem] font-black italic text-white leading-none">
                        {player.name[0]}
                    </span>
                </div>

                {/* The Image (Real or Headshot Placeholder) */}
                <img
                    src={player.image || DEFAULT_CRICKET_IMG}
                    alt={player.name}
                    className={`relative z-10 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ${!player.image ? 'opacity-40 grayscale contrast-125' : ''}`}
                />

                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 z-20"></div>

                {/* Category/Country Badge */}
                <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
                    <span className="bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl ring-1 ring-white/10">
                        {player.country || "ELITE PROSPECT"}
                    </span>
                </div>
            </div>

            {/* 2. PLAYER IDENTITY */}
            <div className="relative px-2 z-30">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex-1">
                        <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-1">
                            Round {currentRound}
                        </p>
                        <h2 className="text-5xl font-[1000] italic tracking-tighter uppercase leading-[0.85] text-white">
                            {firstName}<br />
                            <span className="text-slate-400">{lastName}</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-700 font-black text-[9px] uppercase tracking-widest leading-none mb-1">Squad No.</p>
                        <p className="text-white font-mono text-sm opacity-30">#{currentIndex + 1}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <p className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 font-black uppercase tracking-widest italic text-[10px]">
                        {player.role}
                    </p>
                    <span className="h-1 w-1 bg-slate-800 rounded-full"></span>
                    <p className="text-slate-500 font-bold text-[10px] uppercase">
                        {availableCount} Left in Pool
                    </p>
                </div>

                {/* 3. PRICE INFO TABLE */}
                <div className="grid grid-cols-2 gap-px bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-800">
                    <div className="bg-slate-950/40 p-4">
                        <p className="text-slate-600 text-[8px] font-black uppercase mb-1 tracking-widest">Base Value</p>
                        <p className="text-xl font-black text-slate-300">₹{basePrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 border-l border-slate-800">
                        <p className="text-slate-600 text-[8px] font-black uppercase mb-1 tracking-widest">Next Bid</p>
                        <p className="text-xl font-black text-green-500">₹{nextBid.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Aesthetic Glow Element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        </div>
    );
};

export default PlayerCard;