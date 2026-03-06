import React from 'react';

const TeamCard = ({ team }) => {
    // Logic for Minimum Reserve (Assuming 8 players total, 5k base price)
    const BASE_PRICE = 5000;
    const slotsRemaining = 8 - team.players.length;
    // Reserve 5k for every player still needed (excluding the current one)
    const requiredReserve = Math.max(0, (slotsRemaining - 1) * BASE_PRICE);
    const maxPossibleBid = team.budget - requiredReserve;

    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl w-60 h-72 shadow-xl flex flex-col transition-all hover:border-slate-600">

            {/* Team Header */}
            <div className="flex justify-between items-start mb-2">
                <div className={`w-3 h-3 rounded-full mt-1 ${team.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Squad: {team.players.length} / 8
                </span>
            </div>

            <h3 className="font-bold text-xs truncate uppercase text-slate-200 mb-1">{team.name}</h3>

            <div className="flex justify-between items-end mb-3">
                <div>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Wallet</p>
                    <p className="text-lg font-black text-yellow-500 leading-none italic">₹{team.budget.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Max Bid</p>
                    <p className="text-sm font-bold text-green-400 leading-none">₹{maxPossibleBid.toLocaleString()}</p>
                </div>
            </div>

            {/* THE PLAYER LIST WITH PRICES */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar border-t border-slate-800 pt-3">
                {team.players.length > 0 ? (
                    team.players.map((player, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center text-[10px] bg-slate-800/40 p-2 rounded border border-slate-700/30 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-200 group-hover:text-white truncate w-28">
                                    {player.name}
                                </span>
                                <span className="text-[8px] text-slate-500 uppercase tracking-tighter">
                                    {player.role}
                                </span>
                            </div>
                            <span className="font-black text-blue-400 italic">
                                ₹{player.finalPrice.toLocaleString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <span className="text-2xl">🏟️</span>
                        <p className="text-[8px] font-bold uppercase mt-1">No Signings</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamCard;