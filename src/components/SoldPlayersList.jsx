import React from 'react';

const SoldPlayersTable = ({ soldPlayers = [] }) => {
    return (
        <div className="mt-8 bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-xl shrink-0">
            <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                    <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter text-white">
                        Sold Gallery <span className="text-slate-500 ml-2 text-sm not-italic font-bold">({soldPlayers.length})</span>
                    </h3>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400/60 bg-yellow-400/5 px-4 py-1.5 rounded-full border border-yellow-400/10">
                    Live Updates
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar max-h-64 overflow-y-auto pr-2">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">
                            <th className="pb-2 pl-6">Player</th>
                            <th className="pb-2">Type</th>
                            <th className="pb-2">Acquired By</th>
                            <th className="pb-2 text-right pr-6">Final Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {soldPlayers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-12 text-center text-slate-600 font-bold uppercase italic tracking-widest text-xs">
                                    No players sold yet in this session
                                </td>
                            </tr>
                        ) : (
                            [...soldPlayers].reverse().map((player, idx) => (
                                <tr key={idx} className="group hover:scale-[1.01] transition-transform duration-300">
                                    <td className="py-4 pl-6 bg-white/5 rounded-l-2xl border-y border-l border-white/5 group-hover:bg-white/10">
                                        <div className="font-black uppercase italic text-white">{player.name}</div>
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">{player.role || 'Player'}</div>
                                    </td>
                                    <td className="py-4 bg-white/5 border-y border-white/5 group-hover:bg-white/10">
                                        <span className="text-[10px] font-black px-2 py-1 bg-slate-800 rounded text-slate-400 uppercase">
                                            {player.category || 'Base'}
                                        </span>
                                    </td>
                                    <td className="py-4 bg-white/5 border-y border-white/5 group-hover:bg-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-4 rounded-full ${player.teamColor || 'bg-blue-600'}`}></div>
                                            <div className="font-black text-xs uppercase text-slate-200">{player.soldTo}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-6 bg-white/5 rounded-r-2xl border-y border-r border-white/5 group-hover:bg-white/10 text-right">
                                        <div className="text-yellow-400 font-black italic">
                                            ₹{(player.price / 100000).toFixed(1)}L
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SoldPlayersTable;