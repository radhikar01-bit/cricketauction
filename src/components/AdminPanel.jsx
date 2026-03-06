import React, { useState } from 'react';
import { PLAYER_POOL, INITIAL_TEAMS } from '../auctionData';

// --- LEFT ALIGNED TABS ---
const AdminTabs = ({ activeTab, setActiveTab, soldCount, onResetClick }) => (
    <div className="flex gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-xl mb-3 w-fit">
        {[
            { id: 'assign', label: 'Manual Sale', icon: '🔨' },
            { id: 'manage', label: 'Inventory', icon: '📋' },
            { id: 'reset', label: 'Hard Reset', icon: '⚠️' }
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => tab.id === 'reset' ? onResetClick() : setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : tab.id === 'reset'
                            ? 'text-red-500/80 hover:bg-red-500/10 hover:text-red-500'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                    }`}
            >
                <span>{tab.icon}</span> {tab.label}
                {tab.id === 'manage' && <span className="ml-1 text-[9px] opacity-70">({soldCount})</span>}
            </button>
        ))}
    </div>
);

const SoldPlayerRow = ({ player, onReset }) => (
    <tr className="border-b border-slate-800/30 hover:bg-slate-800/10">
        <td className="py-2 pl-4 text-[11px] font-bold uppercase italic">{player.name}</td>
        <td className="py-2 text-[10px] uppercase text-slate-400 font-medium">{player.soldTo}</td>
        <td className="py-2 text-center font-black text-blue-500 text-xs italic">₹{player.price?.toLocaleString()}</td>
        <td className="py-2 pr-4 text-right">
            <button onClick={() => onReset(player)} className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
                </svg>
            </button>
        </td>
    </tr>
);

const AdminPanel = ({ teams = [], soldPlayers = [], syncToCloud }) => {
    const [activeTab, setActiveTab] = useState("assign");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [salePrice, setSalePrice] = useState(5000);

    const SQUAD_LIMIT = 8;
    const BASE_PRICE = 5000;

    const handleFullReset = () => {
        const confirmText = "RESET";
        const input = window.prompt(`DANGER: This will wipe all auction progress.\nType "${confirmText}" to confirm:`);

        if (input === confirmText) {
            syncToCloud({
                teams: INITIAL_TEAMS,
                soldPlayers: [],
                currentIndex: 0,
                currentBid: 5000,
                highestBidderId: null,
                totalPointsAvailable: 0,
                bidHistory: []
            });
            alert("Auction has been fully reset.");
            setActiveTab("assign");
        }
    };

    const handleMakeUnsold = (playerToUndo) => {
        if (!window.confirm(`Undo ${playerToUndo.name}?`)) return;
        const updatedSold = (soldPlayers || []).filter(p => p.id !== playerToUndo.id);
        const updatedTeams = teams.map(team => {
            if ((team.players || []).some(p => p.id === playerToUndo.id)) {
                return {
                    ...team,
                    budget: Number(team.budget) + Number(playerToUndo.price),
                    players: (team.players || []).filter(p => p.id !== playerToUndo.id)
                };
            }
            return team;
        });
        syncToCloud({ soldPlayers: updatedSold, teams: updatedTeams });
    };

    const onManualSale = () => {
        const targetTeam = teams.find(t => String(t.id) === String(selectedTeamId));
        if (!targetTeam || !selectedPlayer) return;
        const finalPrice = Number(salePrice);

        const teamPlayersCount = targetTeam.players?.length || 0;
        const slotsRemainingAfterThis = SQUAD_LIMIT - (teamPlayersCount + 1);
        const reservedAmount = slotsRemainingAfterThis * BASE_PRICE;
        const maxAllowable = targetTeam.budget - reservedAmount;

        if (finalPrice > maxAllowable) {
            alert(`Insufficient budget! Team must reserve ₹${reservedAmount.toLocaleString()} for remaining slots.`);
            return;
        }

        const updatedTeams = teams.map(t =>
            String(t.id) === String(selectedTeamId)
                ? { ...t, budget: t.budget - finalPrice, players: [...(t.players || []), { ...selectedPlayer, finalPrice }] }
                : t
        );
        const updatedSold = [...(soldPlayers || []), { ...selectedPlayer, soldTo: targetTeam.name, price: finalPrice }];

        syncToCloud({ teams: updatedTeams, soldPlayers: updatedSold });
        setSelectedPlayer(null); setSelectedTeamId(""); setSearchTerm(""); setSalePrice(5000);
    };

    const filteredPool = PLAYER_POOL.filter(p =>
        !(soldPlayers || []).some(s => s.id === p.id) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8);

    return (
        <div className="h-screen bg-[#05080f] text-white p-2 md:p-4 overflow-hidden font-sans flex flex-col">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col overflow-hidden">

                {/* LEFT ALIGNED TAB CONTAINER */}
                <div className="flex justify-start">
                    <AdminTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        soldCount={soldPlayers?.length || 0}
                        onResetClick={handleFullReset}
                    />
                </div>

                <div className="flex-1 min-h-0">
                    {activeTab === "assign" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full items-start">
                            {/* SEARCH SECTION */}
                            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl flex flex-col max-h-[85vh]">
                                <h3 className="text-[9px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2 tracking-tighter">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Select Player
                                </h3>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg focus:border-blue-600 outline-none font-bold text-xs mb-3 italic"
                                    placeholder="Find player..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setSelectedPlayer(null); }}
                                />
                                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1 max-h-[220px]">
                                    {searchTerm && !selectedPlayer && filteredPool.map(p => (
                                        <div key={p.id} onClick={() => { setSelectedPlayer(p); setSearchTerm(p.name); }} className="bg-slate-950/50 border border-slate-800 p-2 rounded-lg flex justify-between cursor-pointer hover:border-blue-500 items-center group transition-all">
                                            <div>
                                                <div className="text-[11px] font-black uppercase italic group-hover:text-blue-400">{p.name}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase">{p.role}</div>
                                            </div>
                                            <span className="text-blue-500 font-black text-[10px] italic">₹{p.basePrice?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {selectedPlayer && (
                                        <div className="bg-blue-600 p-3 rounded-lg text-center font-[1000] uppercase italic text-sm animate-in zoom-in duration-200">
                                            {selectedPlayer.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ASSIGNMENT SECTION */}
                            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl">
                                <h3 className="text-[9px] font-black uppercase text-slate-500 mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span> Assignment
                                </h3>
                                <div className="space-y-3">
                                    <select className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-bold text-[10px] uppercase outline-none focus:border-blue-600" value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}>
                                        <option value="">Select Team...</option>
                                        {teams.map(t => <option key={t.id} value={t.id} disabled={(t.players?.length || 0) >= SQUAD_LIMIT}>{t.name} ({(t.players?.length || 0)}/8)</option>)}
                                    </select>
                                    <div>
                                        <input type="number" className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg font-black text-xl text-blue-500 text-center outline-none focus:border-blue-500" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                                    </div>
                                    <button onClick={onManualSale} disabled={!selectedPlayer || !selectedTeamId} className="w-full py-3 rounded-lg bg-blue-600 font-[1000] uppercase italic text-[11px] disabled:opacity-20 transition-all active:scale-95 shadow-lg shadow-blue-900/10">
                                        Confirm Sale 🔨
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl overflow-hidden h-full flex flex-col max-h-[75vh]">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 sticky top-0 z-10">
                                        <tr className="text-[9px] uppercase text-slate-500 font-black">
                                            <th className="p-3 pl-4">Player</th>
                                            <th className="p-3">Team</th>
                                            <th className="p-3 text-center">Price</th>
                                            <th className="p-3 pr-4 text-right">Reset</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/30">
                                        {soldPlayers?.length > 0 ? [...soldPlayers].reverse().map(p => <SoldPlayerRow key={p.id} player={p} onReset={handleMakeUnsold} />) : <tr><td colSpan="4" className="p-10 text-center text-[10px] opacity-20 uppercase font-black tracking-widest">No Players Sold</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-2 flex justify-start pl-2">
                    <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.3em] italic">Auction Engine v2.5 • Admin Terminal</p>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AdminPanel;