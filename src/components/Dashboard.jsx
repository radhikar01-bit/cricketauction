import React, { useState } from 'react';

const Dashboard = ({ teams, auctionType }) => {
    const [expandedTeams, setExpandedTeams] = useState({});

    // Dynamic Constants based on Arena
    const isWomens = auctionType === 'womens';
    const BASE_PRICE = 5000;
    const SQUAD_LIMIT = 8; // Common standard for both
    const THEME_COLOR = isWomens ? 'text-pink-500' : 'text-blue-500';

    if (!teams || teams.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans">
                <div className={`w-12 h-12 border-4 ${isWomens ? 'border-pink-500' : 'border-blue-500'} border-t-transparent rounded-full animate-spin mb-4`}></div>
                <p className="font-black italic uppercase tracking-widest animate-pulse text-slate-500">
                    Loading {auctionType?.toUpperCase()} Strategic Data...
                </p>
            </div>
        );
    }

    const toggleTeam = (teamId) => {
        setExpandedTeams(prev => ({
            ...prev,
            [teamId]: !prev[teamId]
        }));
    };

    const toggleAll = (expand) => {
        if (!expand) {
            setExpandedTeams({});
        } else {
            const allExpanded = {};
            teams.forEach(t => allExpanded[t.id] = true);
            setExpandedTeams(allExpanded);
        }
    };

    const totalSpent = teams.reduce((acc, t) => acc + (t.players?.reduce((pAcc, p) => pAcc + p.finalPrice, 0) || 0), 0);
    const totalPlayers = teams.reduce((acc, team) => acc + (team.players?.length || 0), 0);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            {/* LEAGUE BADGE */}
            <div className={`inline-block px-4 py-1 rounded-full border mb-4 text-[10px] font-black uppercase tracking-widest ${isWomens ? 'bg-pink-500/10 border-pink-500/30 text-pink-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-500'}`}>
                {isWomens ? "Women's Premier League" : "Indian Premier League"} Arena
            </div>

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6 gap-6">
                <div>
                    <h1 className={`text-5xl font-[1000] italic uppercase tracking-tighter ${THEME_COLOR}`}>
                        Strategic Dashboard
                    </h1>
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={() => toggleAll(true)}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full font-black uppercase tracking-widest transition-colors"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={() => toggleAll(false)}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full font-black uppercase tracking-widest transition-colors"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>

                <div className="flex gap-10">
                    <div className="hidden md:block text-right border-r border-slate-800 pr-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase">Market Activity</p>
                        <p className="text-2xl font-black text-white">
                            {totalPlayers} <span className="text-slate-600 text-sm">/ {teams.length * SQUAD_LIMIT}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-500 text-[10px] font-black uppercase">Avg. Player Price</p>
                        <p className="text-2xl font-black text-green-500 italic">
                            ₹{Math.round(totalSpent / (totalPlayers || 1)).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* TEAM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20 items-start">
                {teams.map((team) => {
                    const squadCount = team.players?.length || 0;
                    const slotsRemaining = SQUAD_LIMIT - squadCount;
                    const requiredReserve = slotsRemaining > 0 ? (slotsRemaining - 1) * BASE_PRICE : 0;
                    const maxBid = slotsRemaining > 0 ? team.budget - requiredReserve : 0;
                    const isExpanded = expandedTeams[team.id];

                    return (
                        <div key={team.id} className={`bg-slate-900 border ${isExpanded ? 'border-slate-600' : 'border-slate-800'} rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300`}>

                            {/* Team Header */}
                            <div
                                onClick={() => toggleTeam(team.id)}
                                className={`p-5 ${team.color} relative overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
                            >
                                <div className="absolute -right-4 -top-4 opacity-20 text-6xl font-black italic">
                                    {squadCount}
                                </div>
                                <div className="flex justify-between items-center relative z-10">
                                    <h3 className="font-black uppercase italic truncate text-sm tracking-tight pr-4">{team.name}</h3>
                                    <span className={`transform transition-transform duration-300 text-xs ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                                </div>

                                <div className="flex justify-between items-end mt-4 relative z-10">
                                    <div>
                                        <p className="text-[9px] font-black opacity-70 uppercase tracking-tighter">Purse Left</p>
                                        <p className="text-xl font-black italic">₹{team.budget?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black opacity-70 uppercase tracking-tighter text-yellow-300">Max Bid</p>
                                        <p className="text-xl font-black italic text-white drop-shadow-md">₹{maxBid.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-slate-800 h-1.5 w-full">
                                <div
                                    className="bg-white h-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    style={{ width: `${(squadCount / SQUAD_LIMIT) * 100}%` }}
                                ></div>
                            </div>

                            {/* Collapsible Squad List */}
                            <div className={`transition-all duration-500 ease-in-out overflow-y-auto ${isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-4 space-y-2 bg-slate-950/50">
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Signings</p>
                                    {team.players && team.players.length > 0 ? (
                                        team.players.map((p, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-xl border border-white/5">
                                                <div className="leading-tight">
                                                    <p className="text-[11px] font-bold text-slate-200 truncate w-28 uppercase">{p.name}</p>
                                                    <p className={`text-[8px] font-black uppercase ${isWomens ? 'text-pink-400' : 'text-blue-400'}`}>{p.role}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-white italic">
                                                    ₹{p.finalPrice?.toLocaleString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 flex flex-col items-center justify-center opacity-20 italic">
                                            <p className="text-[9px] font-black uppercase">No Signings</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Footer */}
                            <div className="p-3 bg-black/40 border-t border-slate-800 text-center">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${squadCount >= SQUAD_LIMIT ? 'text-green-500' : 'text-slate-500'}`}>
                                    {squadCount >= SQUAD_LIMIT ? "✅ SQUAD FULL" : `SLOTS LEFT: ${SQUAD_LIMIT - squadCount}`}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;