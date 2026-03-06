import React, { useState } from 'react';

const Dashboard = ({ teams }) => {
    // State to track which teams are expanded
    // Initializing with an empty object means all teams start collapsed
    const [expandedTeams, setExpandedTeams] = useState({});

    if (!teams || teams.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black italic uppercase tracking-widest animate-pulse text-slate-500">
                    Loading Strategic Data...
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

    const BASE_PRICE = 5000;
    const SQUAD_LIMIT = 8;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            {/* HEADER SECTION */}
            <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-blue-500">
                        Teams Dashboard
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
                            {teams.reduce((acc, team) => acc + (team.players?.length || 0), 0)} <span className="text-slate-600 text-sm">/ 25</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-500 text-[10px] font-black uppercase">Avg. Player Price</p>
                        <p className="text-2xl font-black text-green-500 italic">
                            ₹{Math.round(teams.reduce((acc, t) => acc + (t.players?.reduce((pAcc, p) => pAcc + p.finalPrice, 0) || 0), 0) / (teams.reduce((acc, t) => acc + (t.players?.length || 0), 0) || 1)).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* 15 TEAM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pb-20 items-start">
                {teams.map((team) => {
                    const squadCount = team.players?.length || 0;
                    const slotsRemaining = SQUAD_LIMIT - squadCount;
                    const requiredReserve = slotsRemaining > 0 ? (slotsRemaining - 1) * BASE_PRICE : 0;
                    const maxBid = slotsRemaining > 0 ? team.budget - requiredReserve : 0;
                    const isExpanded = expandedTeams[team.id];

                    return (
                        <div key={team.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300">

                            {/* Team Header (Clickable) */}
                            <div
                                onClick={() => toggleTeam(team.id)}
                                className={`p-5 ${team.color} relative overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
                            >
                                <div className="absolute -right-4 -top-4 opacity-10 text-6xl font-black italic">
                                    {squadCount}
                                </div>
                                <div className="flex justify-between items-center">
                                    <h3 className="font-black uppercase italic truncate text-sm tracking-tight pr-4">{team.name}</h3>
                                    <span className={`transform transition-transform duration-300 text-xs ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div>
                                        <p className="text-[9px] font-black opacity-70 uppercase tracking-tighter">Current Wallet</p>
                                        <p className="text-xl font-black italic">₹{team.budget?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black opacity-70 uppercase tracking-tighter text-yellow-300">Max Bid</p>
                                        <p className="text-xl font-black italic text-white drop-shadow-md">₹{maxBid.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-slate-800 h-1 w-full">
                                <div
                                    className="bg-white h-full transition-all duration-500"
                                    style={{ width: `${(squadCount / SQUAD_LIMIT) * 100}%` }}
                                ></div>
                            </div>

                            {/* Collapsible Squad List */}
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-4 space-y-2 bg-slate-900/50">
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Purchased Players</p>
                                    {team.players && team.players.length > 0 ? (
                                        team.players.map((p, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/30">
                                                <div className="leading-tight">
                                                    <p className="text-[11px] font-bold text-slate-200 truncate w-28 uppercase">{p.name}</p>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase">{p.role}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-blue-400 italic">
                                                    ₹{p.finalPrice?.toLocaleString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 flex flex-col items-center justify-center opacity-20 italic">
                                            <span className="text-3xl mb-1">🏏</span>
                                            <p className="text-[9px] font-black uppercase">No Signings Yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Footer */}
                            <div className="p-3 bg-black/40 border-t border-slate-800 text-center">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${squadCount >= SQUAD_LIMIT ? 'text-green-500' : 'text-slate-500'}`}>
                                    {squadCount >= SQUAD_LIMIT ? "✅ SQUAD COMPLETE" : `EMPTY SLOTS: ${SQUAD_LIMIT - squadCount}`}
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