import React from 'react';

const PlayerCard = ({
    player,
    currentRound,
    availableCount,
    currentIndex,
    basePrice,
    currentBid,
    highestBidderId,
    bidIncrement,
    handleHammerDown, // Pass this function as a prop
    userRole          // Pass user.role as a prop
}) => {
    if (!player) return null;

    const nextBid = highestBidderId ? currentBid + bidIncrement : basePrice;
    const DEFAULT_CRICKET_IMG = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop";

    return (
        <div className="w-full flex flex-col gap-2 bg-slate-900/40 p-5 rounded-[2rem] shadow-xl">
            
            {/* ROW 1: HEADER & ADMIN ACTIONS */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                        <img
                            src={player.image || DEFAULT_CRICKET_IMG}
                            alt={player.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-blue-500 font-black text-[9px] tracking-[0.4em] uppercase mb-0.5">
                            ROUND {currentRound} • PLAYER #{currentIndex + 1}
                        </p>
                        <h2 className="text-3xl font-[900] italic tracking-tighter uppercase leading-none text-white">
                            {player.name}
                        </h2>
                    </div>
                </div>

                {/* INTEGRATED ADMIN CONTROLS */}
                {userRole === 'ADMIN' && (
                    <button 
                        onClick={handleHammerDown}
                        className={`h-20 px-8 rounded-2xl font-[1000] italic uppercase transition-all flex flex-col items-center justify-center gap-1 shrink-0
                            ${highestBidderId 
                                ? 'bg-white text-black hover:bg-slate-200' 
                                : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'}`}
                    >
                        <span className="text-2xl leading-none">{highestBidderId ? "🔨" : "⏭️"}</span>
                        <span className="text-[10px] tracking-widest">{highestBidderId ? "HAMMER" : "SKIP"}</span>
                    </button>
                )}
            </div>

            {/* ROW 2: DATA TABLE (NOW 4 COLUMNS) */}
            <div className="grid grid-cols-4 gap-4 py-4 border-y border-white/5">
                <div className="flex flex-col">
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Country</span>
                    <span className="text-white font-black text-sm uppercase truncate">{player.country || "PROSPECT"}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Role</span>
                    <span className="text-blue-400 font-black text-sm uppercase italic">{player.role}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Base Price</span>
                    <span className="text-white font-black text-sm italic">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Status</span>
                    <span className="text-slate-400 font-black text-sm uppercase">{availableCount - currentIndex} LEFT</span>
                </div>
            </div>

            {/* ROW 3: BIDDING STATUS */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                    <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Current Valuation</p>
                    <p className="text-3xl font-[1000] text-white italic">
                        <span className="text-sm text-slate-500 mr-1 italic">₹</span>
                        {currentBid.toLocaleString()}
                    </p>
                </div>
                <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                    <p className="text-green-500/60 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Next Minimum</p>
                    <p className="text-3xl font-[1000] text-green-400 italic">
                        <span className="text-sm text-green-700 mr-1 italic">₹</span>
                        {nextBid.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;