import React, { useState } from 'react';
const SquadModal = ({ team, isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    if (!isOpen || !team) return null;

    const filteredPlayers = team.players.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className={`p-6 ${team.color} flex justify-between items-center`}>
                    <div>
                        <h2 className="text-3xl font-black italic text-white">{team.name}</h2>
                        <p className="text-white/80 font-bold text-sm">Squad Value: ₹{(100000 - team.budget).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="bg-black/20 hover:bg-black/40 p-2 rounded-full text-white text-2xl font-bold">×</button>
                </div>

                {/* Search & List */}
                <div className="p-6">
                    <input
                        type="text"
                        placeholder="Search squad players..."
                        className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredPlayers.length > 0 ? (
                            filteredPlayers.map((p, i) => (
                                <div key={i} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center border border-slate-700">
                                    <div>
                                        <p className="font-bold text-white text-sm">{p.name}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{p.role}</p>
                                    </div>
                                    <p className="font-black text-blue-400 italic">₹{p.finalPrice.toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-2 text-center text-slate-600 py-10 italic">No players found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; export default SquadModal;