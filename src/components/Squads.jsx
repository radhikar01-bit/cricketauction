import React, { useState } from 'react';

const Squads = ({ teams = [] }) => {
    const [activeTeamId, setActiveTeamId] = useState(teams[0]?.id || null);
    const activeTeam = teams.find(t => t.id === activeTeamId);

    // Logic Constants
    const SQUAD_LIMIT = 8;
    const MIN_BID = 5000;

    // Calculations
    const totalSpent = activeTeam?.players?.reduce((sum, player) => sum + (player.finalPrice || 0), 0) || 0;
    const playersCount = activeTeam?.players?.length || 0;
    const emptySlots = SQUAD_LIMIT - playersCount;

    // Calculate Max Bid: Purse - (remaining slots - 1) * min_bid
    // If squad is full, max bid is 0.
    const maxBid = playersCount < SQUAD_LIMIT
        ? Math.max(0, (activeTeam?.budget || 0) - (Math.max(0, emptySlots - 1) * MIN_BID))
        : 0;

    return (
        <div className="min-h-screen bg-transparent p-3 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* 1. HEADER */}
                <div className="mb-6 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter text-white">
                        Squad <span className="text-blue-500">Profiles</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-1">
                        Select franchise to view roster
                    </p>
                </div>

                {/* 2. TEAM SELECTION */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-8">
                    {teams.map((team) => (
                        <button
                            key={team.id}
                            onClick={() => setActiveTeamId(team.id)}
                            className={`py-2 px-2 rounded-lg font-black uppercase italic text-[10px] transition-all duration-200 border-2 text-center truncate ${activeTeamId === team.id
                                    ? `${team.color} border-white shadow-lg scale-[1.02]`
                                    : `bg-slate-900/60 border-white/5 text-slate-500 hover:border-white/20`
                                }`}
                        >
                            {team.name}
                        </button>
                    ))}
                </div>

                {/* 3. ACTIVE SQUAD DISPLAY */}
                {activeTeam ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* LEFT: TEAM STATS CARD */}
                        <div className="lg:col-span-4">
                            <div className={`rounded-[1.5rem] p-6 shadow-2xl lg:sticky lg:top-24 ${activeTeam.color}`}>
                                <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter mb-4">
                                    {activeTeam.name}
                                </h2>

                                <div className="space-y-4">
                                    <div className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                        <p className="text-[9px] font-black uppercase opacity-70 tracking-widest">Rem. Purse</p>
                                        <p className="text-2xl font-[1000] italic">₹{activeTeam.budget?.toLocaleString()}</p>
                                    </div>

                                    {/* MAX BID HIGHLIGHT */}
                                    <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-inner">
                                        <p className="text-[9px] font-black uppercase text-white/80 tracking-widest">Max Next Bid Allowed</p>
                                        <p className="text-2xl font-[1000] italic text-white">₹{maxBid.toLocaleString()}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
                                            <p className="text-[8px] font-black uppercase opacity-70">Players</p>
                                            <p className="text-lg font-black">{playersCount} / {SQUAD_LIMIT}</p>
                                        </div>
                                        <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
                                            <p className="text-[8px] font-black uppercase opacity-70">Total Spent</p>
                                            <p className="text-sm font-black truncate">₹{totalSpent.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: PLAYER LIST */}
                        <div className="lg:col-span-8">
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 md:p-8 min-h-[400px]">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                                    <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-400">
                                        Signed Roster
                                    </h3>
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">
                                        {playersCount} Slots Filled
                                    </span>
                                </div>

                                {activeTeam.players && activeTeam.players.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {activeTeam.players.map((player, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-xl flex justify-between items-center transition-all group"
                                            >
                                                <div className="truncate">
                                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-tighter mb-0.5">{player.role}</p>
                                                    <p className="text-sm font-black uppercase italic leading-none truncate text-white">{player.name}</p>
                                                </div>
                                                <div className="text-right ml-2 flex-shrink-0">
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Price</p>
                                                    <p className="text-xs font-black italic text-white">₹{player.finalPrice?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 opacity-20">
                                        <div className="text-5xl mb-4">🏏</div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">War-room is empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-600 font-black uppercase italic text-xs tracking-widest">
                        Please select a team to review
                    </div>
                )}
            </div>
        </div>
    );
};

export default Squads;