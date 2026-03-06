import React, { useState, useEffect, useRef } from 'react';
import SquadModal from './SquadModal';
import LiveTicker from './LiveTicker';
import PlayerCard from './PlayerCard';

const AuctionHub = ({
    teams = [],
    currentIndex = 0,
    soldPlayers = [],
    currentBid = 5000,
    highestBidderId = null,
    bidHistory = [],
    syncToCloud,
    currentPlayer,
    availableCount = 0,
    currentRound = 1,
    user = {},
    activeDuelists = [],
    gaveUpTeams = []
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    // --- NEW STATE FOR SOLD OVERLAY ---
    const [soldOverlay, setSoldOverlay] = useState({ show: false, playerName: '', teamName: '', teamColor: '' });

    // --- ROUND TRANSITION LOGIC ---
    const [showRoundOverlay, setShowRoundOverlay] = useState(false);
    const prevRoundRef = useRef(currentRound);

    useEffect(() => {
        if (currentRound > prevRoundRef.current) {
            setShowRoundOverlay(true);
            const timer = setTimeout(() => setShowRoundOverlay(false), 5000);
            prevRoundRef.current = currentRound;
            return () => clearTimeout(timer);
        }
        prevRoundRef.current = currentRound;
    }, [currentRound]);

    const BASE_PRICE = 5000;
    const BID_INCREMENT = 10000;
    const SQUAD_LIMIT = 8;

    // --- LOGIC FUNCTIONS ---
    const handleBid = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        if (!team || (user.role === 'OWNER' && user.teamId !== String(teamId))) return;

        const isAlreadyInDuel = activeDuelists.includes(teamId);
        if (!isAlreadyInDuel && activeDuelists.length >= 2) {
            alert("Arena Full! A team must 'Give Up' before you can enter.");
            return;
        }

        const nextBidAmount = highestBidderId ? currentBid + BID_INCREMENT : BASE_PRICE;
        const teamPlayers = team.players || [];
        if (teamPlayers.length >= SQUAD_LIMIT) return;

        const slotsRemaining = SQUAD_LIMIT - teamPlayers.length;
        const reservedAmount = (slotsRemaining - 1) * BASE_PRICE;
        const maxAllowableBid = team.budget - reservedAmount;

        if (nextBidAmount > maxAllowableBid) {
            alert(`Insufficient Funds! You need ₹${reservedAmount.toLocaleString()} for your remaining slots.`);
            return;
        }
        if (highestBidderId === teamId) return;

        const newDuelists = isAlreadyInDuel ? activeDuelists : [...activeDuelists, teamId];
        const newEntry = { id: Date.now(), teamId: teamId, team: team.name, amount: nextBidAmount, color: team.color };

        syncToCloud({
            currentBid: nextBidAmount,
            highestBidderId: teamId,
            bidHistory: [newEntry, ...(bidHistory || [])].slice(0, 3),
            activeDuelists: newDuelists,
            gaveUpTeams: (gaveUpTeams || []).filter(id => id !== teamId)
        });
    };

    const handleGiveUp = (teamId) => {
        if (String(highestBidderId) === String(teamId)) return;
        const newDuelists = (activeDuelists || []).filter(id => id !== teamId);
        const newGaveUp = [...(gaveUpTeams || []), teamId];
        syncToCloud({ activeDuelists: newDuelists, gaveUpTeams: newGaveUp });
    };

    const handleHammerDown = () => {
        if (user.role !== 'ADMIN') return;
        const resetAuctionState = { activeDuelists: [], gaveUpTeams: [], currentBid: BASE_PRICE, highestBidderId: null, bidHistory: [] };

        if (highestBidderId) {
            const winningTeam = teams.find(t => t.id === highestBidderId);
            
            // Trigger the Sold Notification
            setSoldOverlay({
                show: true,
                playerName: currentPlayer.name,
                teamName: winningTeam.name,
                teamColor: winningTeam.color
            });

            // Auto-hide after 5 seconds
            setTimeout(() => {
                setSoldOverlay(prev => ({ ...prev, show: false }));
            }, 5000);

            const updatedTeams = teams.map(t => {
                if (t.id === highestBidderId) {
                    return {
                        ...t,
                        budget: t.budget - currentBid,
                        players: [...(t.players || []), { ...currentPlayer, finalPrice: currentBid }]
                    };
                }
                return t;
            });

            syncToCloud({
                ...resetAuctionState,
                teams: updatedTeams,
                soldPlayers: [...(soldPlayers || []), { ...currentPlayer, soldTo: winningTeam.name, price: currentBid }],
                currentIndex: currentIndex + 1,
            });
        } else {
            syncToCloud({ ...resetAuctionState, currentIndex: currentIndex + 1 });
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white font-sans relative overflow-hidden">

            {/* --- SOLD PLAYER OVERLAY (The new modal) --- */}
            {soldOverlay.show && (
                <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl transition-all duration-500 animate-in fade-in">
                    <div className="text-center p-12 rounded-[3rem] border border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                        <div className="text-6xl mb-6">🔨</div>
                        <h2 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-white mb-4">
                            CONGRATULATIONS
                        </h2>
                        <div className={`inline-block px-8 py-4 rounded-2xl text-2xl md:text-4xl font-black uppercase italic mb-8 shadow-2xl ${soldOverlay.teamColor}`}>
                            {soldOverlay.playerName}
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-slate-300">
                            is now a part of <span className="text-white underline decoration-blue-500 underline-offset-8">{soldOverlay.teamName}</span>
                        </p>
                        
                        <button 
                            onClick={() => setSoldOverlay(prev => ({ ...prev, show: false }))}
                            className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
                        >
                            [ Close Details ]
                        </button>
                    </div>
                </div>
            )}

            {/* --- ROUND OVERLAY --- */}
            {showRoundOverlay && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-xl transition-all duration-700">
                    <div className="text-center animate-in zoom-in slide-in-from-bottom-10 duration-500">
                        <span className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-2xl shadow-blue-500/50">Next Phase</span>
                        <h2 className="text-7xl md:text-9xl font-[1000] italic uppercase tracking-tighter text-white drop-shadow-2xl">
                            Round {currentRound}
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-500 mx-auto mt-6 rounded-full animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
                        <button
                            onClick={() => setShowRoundOverlay(false)}
                            className="mt-12 px-10 py-3 bg-white text-black rounded-full font-black uppercase italic text-sm hover:scale-110 transition-transform"
                        >
                            Enter Arena
                        </button>
                    </div>
                </div>
            )}

            <div className="pt-8 pb-20 px-4 max-w-5xl mx-auto relative z-10">
                {!currentPlayer ? (
                    <div className="text-center py-24 flex flex-col items-center bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/10 shadow-2xl">
                        <h2 className="text-5xl font-black text-green-500 uppercase italic tracking-tighter mb-6">Auction Concluded</h2>
                        <button onClick={() => window.location.reload()} className="bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs border border-white/10 px-6 py-3 rounded-full transition-all">
                            Review All Squads
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* LEFT: PLAYER CARD */}
                        <div className="lg:col-span-5 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <PlayerCard
                                player={currentPlayer}
                                currentRound={currentRound}
                                availableCount={availableCount}
                                currentIndex={currentIndex}
                                basePrice={BASE_PRICE}
                                currentBid={currentBid}
                                highestBidderId={highestBidderId}
                                bidIncrement={BID_INCREMENT}
                            />
                        </div>

                        {/* RIGHT: ARENA */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* LIVE BID DISPLAY */}
                            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                                <p className="text-blue-400 font-black tracking-[0.5em] text-[10px] uppercase mb-3">Live Valuation</p>
                                <div className="text-7xl md:text-8xl font-[1000] tracking-tighter text-white mb-6 drop-shadow-md">
                                    <span className="text-2xl text-slate-500 italic mr-2">₹</span>
                                    {currentBid.toLocaleString()}
                                </div>

                                {highestBidderId ? (
                                    <div className={`inline-block px-10 py-3 rounded-full text-xl font-black uppercase italic shadow-2xl animate-bounce ring-2 ring-white/20 ${teams.find(t => t.id === highestBidderId)?.color}`}>
                                        {teams.find(t => t.id === highestBidderId)?.name}
                                    </div>
                                ) : (
                                    <div className="text-slate-500 font-black text-sm uppercase italic tracking-widest animate-pulse">Waiting for Opening Bid</div>
                                )}
                            </div>

                            {/* DUEL GRID */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {teams.map(team => {
                                    const isDuelist = (activeDuelists || []).includes(team.id);
                                    const canEnter = (activeDuelists || []).length < 2 && !(gaveUpTeams || []).includes(team.id);
                                    const isMyTeam = user.role === 'ADMIN' || user.teamId === String(team.id);
                                    const isLeading = String(highestBidderId) === String(team.id);

                                    return (
                                        <div key={team.id} className="flex flex-col gap-1 group">
                                            <button
                                                onClick={() => handleBid(team.id)}
                                                disabled={!isMyTeam || isLeading || (!isDuelist && !canEnter)}
                                                className={`p-3 rounded-2xl transition-all duration-300 ${team.color} ${(!isMyTeam || (!isDuelist && !canEnter)) ? 'opacity-20 grayscale scale-95' : 'hover:scale-105 hover:brightness-125 shadow-lg'} ${isLeading ? 'ring-4 ring-white z-20 scale-110 shadow-blue-500/50' : ''}`}
                                            >
                                                <p className="text-[8px] font-black uppercase truncate mb-1 opacity-80">{team.name}</p>
                                                <p className="text-xs font-black italic">{isLeading ? "WINNING" : (isDuelist ? "BID NOW" : "ENTER")}</p>
                                            </button>

                                            {isDuelist && isMyTeam && (
                                                <button
                                                    onClick={() => handleGiveUp(team.id)}
                                                    disabled={isLeading}
                                                    className={`py-2 text-[9px] font-black uppercase rounded-xl transition-all ${isLeading ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-red-500/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30'}`}
                                                >
                                                    {isLeading ? "Locked" : "Give Up"}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ADMIN ACTION */}
                            {user.role === 'ADMIN' && (
                                <button
                                    onClick={handleHammerDown}
                                    className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-blue-700 to-blue-600 text-2xl font-[1000] italic uppercase tracking-tighter hover:from-blue-600 hover:to-blue-500 transition-all shadow-2xl shadow-blue-900/60 mt-2 border-t border-white/20 active:scale-[0.98]"
                                >
                                    {highestBidderId ? "🔨 SOLD - HAMMER DOWN" : "⏭️ SKIP PLAYER"}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionHub;