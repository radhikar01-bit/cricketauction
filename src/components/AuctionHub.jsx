import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from './PlayerCard';

const AuctionHub = ({
    teams = [],
    currentIndex = 0,
    soldPlayers = [],
    unsoldPlayers = [], // Track players who weren't bought
    currentBid = 5000,
    highestBidderId = null,
    bidHistory = [],
    syncToCloud,
    currentPlayer,
    availableCount = 0,
    currentRound = 1,
    user = {},
    activeDuelists = [],
    gaveUpTeams = [],
    auctionType = null, 
    setAuctionType 
}) => {
    const [soldOverlay, setSoldOverlay] = useState({ show: false, playerName: '', teamName: '', teamColor: '' });
    const [phaseOverlay, setPhaseOverlay] = useState(false);
    const prevSoldLength = useRef(soldPlayers?.length || 0);

    // --- SPECIAL LOGIC: ID SEQUENCE TRACKER ---
    // Tracks the ID of the last player seen to detect when the pool resets/loops
    const lastSeenPlayerId = useRef(null);

    // --- STANDARDIZED PRICING CONSTANTS ---
    const BASE_PRICE = 5000;
    const BID_INCREMENT = 10000;
    const SQUAD_LIMIT = 8;

    // --- ROUND CHANGE DETECTION (ID LOGIC) ---
    useEffect(() => {
        if (currentPlayer && lastSeenPlayerId.current !== null) {
            // Logic: If the incoming ID is smaller than the previous one, a new round has started
            if (Number(currentPlayer.id) < Number(lastSeenPlayerId.current)) {
                setPhaseOverlay(true);
            }
        }
        if (currentPlayer) {
            lastSeenPlayerId.current = currentPlayer.id;
        }
    }, [currentPlayer]);

    // --- SOLD OVERLAY LOGIC ---
    useEffect(() => {
        if (soldPlayers && soldPlayers.length > prevSoldLength.current) {
            const lastSold = soldPlayers[soldPlayers.length - 1];
            setSoldOverlay({
                show: true,
                playerName: lastSold.name,
                teamName: lastSold.soldTo,
                teamColor: lastSold.teamColor || 'bg-blue-600'
            });
            prevSoldLength.current = soldPlayers.length;
        }
        prevSoldLength.current = soldPlayers?.length || 0;
    }, [soldPlayers]);

    const handleBid = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;

        const isAlreadyInDuel = activeDuelists.includes(teamId);
        if (!isAlreadyInDuel && activeDuelists.length >= 2) {
            alert("Arena Full! Only 2 teams can duel at a time.");
            return;
        }

        const nextBidAmount = highestBidderId ? currentBid + BID_INCREMENT : (currentPlayer?.basePrice || BASE_PRICE);
        
        const teamPlayers = team.players || [];
        const slotsRemaining = SQUAD_LIMIT - teamPlayers.length;
        const reservedAmount = (slotsRemaining - 1) * BASE_PRICE;
        const maxAllowableBid = team.budget - reservedAmount;

        if (nextBidAmount > maxAllowableBid) {
            alert(`Insufficient Funds for ${team.name}! Must keep ${BASE_PRICE} for remaining slots.`);
            return;
        }

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
        if (user.role !== 'ADMIN' || !currentPlayer) return;

        // --- IMPROVED LOGIC: Check if this is truly the last player ---
        // availableCount comes from App.jsx based on availablePool.length
       const isLastPlayerInSet = (currentIndex >= availableCount - 1);
        
       
        const resetAuctionState = { 
            activeDuelists: [], 
            gaveUpTeams: [], 
            currentBid: BASE_PRICE, 
            highestBidderId: null, 
            bidHistory: [] 
        };

        let updateData = { ...resetAuctionState };

        // 1. PROCESS CURRENT PLAYER (Sold or Unsold)
        let updatedUnsold = [...(unsoldPlayers || [])];
        let updatedSold = [...(soldPlayers || [])];
        let updatedTeams = [...teams];

        if (highestBidderId) {
            const winningTeam = teams.find(t => t.id === highestBidderId);
            updatedTeams = teams.map(t => {
                if (t.id === highestBidderId) {
                    return {
                        ...t,
                        budget: t.budget - currentBid,
                        players: [...(t.players || []), { ...currentPlayer, finalPrice: currentBid }]
                    };
                }
                return t;
            });
            updatedSold.push({ 
                ...currentPlayer, 
                soldTo: winningTeam.name, 
                price: currentBid, 
                teamColor: winningTeam.color 
            });
        } else {
            // Player was skipped/unsold - add to the buffer
            updatedUnsold.push({ ...currentPlayer });
        }

        // Apply these to our update object
        updateData.teams = updatedTeams;
        updateData.soldPlayers = updatedSold;

        // 2. CALCULATE ROUND PROGRESSION
        if (isLastPlayerInSet) {
            // We've reached the end of the current pool
            //alert("Moving");
            if (updatedUnsold.length > 0) {
                // MOVE TO NEXT ROUND: Take the buffer we just built and make it the NEW pool
                updateData.currentIndex = 0; 
                updateData.currentRound = (currentRound || 1) + 1;
                updateData.playersPool = updatedUnsold; // This is the magic for Round 2
                updateData.unsoldPlayers = []; // Clear buffer for the new round
               // alert(`Round ${currentRound} Complete! Moving ${updatedUnsold.length} players to Round ${currentRound + 1}`);
            } else {
                // Truly finished: No one left anywhere
                updateData.currentIndex = currentIndex + 1; 
                updateData.playersPool = []; 
                updateData.unsoldPlayers = [];
            }
        } else {
            // Just move to the next player in the existing pool
            updateData.currentIndex = currentIndex + 1;
            updateData.unsoldPlayers = updatedUnsold; // Keep carrying the buffer forward
        }

        syncToCloud(updateData);
    };

    if (!auctionType) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-2">Auction Arena</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-sm">Select Your League</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                    <button onClick={() => setAuctionType('mens')} className="group relative p-16 rounded-[3rem] bg-slate-900 border border-blue-500/20 hover:border-blue-500/60 transition-all duration-500 shadow-2xl overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-9xl opacity-10 group-hover:rotate-12 transition-transform">🏏</div>
                        <h2 className="text-5xl font-black italic uppercase relative z-10">Men's</h2>
                        <p className="text-blue-400 mt-2 font-black uppercase tracking-widest text-xs relative z-10">IPL 2026 Edition</p>
                    </button>
                    <button onClick={() => setAuctionType('womens')} className="group relative p-16 rounded-[3rem] bg-slate-900 border border-pink-500/20 hover:border-pink-500/60 transition-all duration-500 shadow-2xl overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-9xl opacity-10 group-hover:-rotate-12 transition-transform">🔥</div>
                        <h2 className="text-5xl font-black italic uppercase relative z-10">Women's</h2>
                        <p className="text-pink-400 mt-2 font-black uppercase tracking-widest text-xs relative z-10">WPL 2026 Edition</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white font-sans relative">
            
            {/* --- PHASE COMPLETE OVERLAY --- */}
            {phaseOverlay && (
                <div className="fixed inset-0 z-[500] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-32 h-32 bg-blue-600/20 rounded-full flex items-center justify-center mb-8 border border-blue-500/50">
                        <span className="text-6xl animate-bounce">🏁</span>
                    </div>
                    <h2 className="text-7xl md:text-9xl font-[1000] italic uppercase text-white mb-4 tracking-tighter">Round {currentRound}</h2>
                    <p className="text-blue-400 text-xl font-bold uppercase tracking-[0.4em] mb-12">
                        ID Sequence Reset • Entering Unsold Pool
                    </p>
                    <button 
                        onClick={() => setPhaseOverlay(false)}
                        className="px-16 py-6 bg-white text-black rounded-full font-[1000] uppercase italic text-xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    >
                        Continue Auction →
                    </button>
                </div>
            )}

            {/* --- SOLD CONGRATULATIONS OVERLAY --- */}
            {soldOverlay.show && (
                <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500 overflow-hidden">
                    <div className={`absolute inset-0 opacity-30 blur-[120px] animate-pulse ${soldOverlay.teamColor}`}></div>
                    <div className="relative z-10 text-center p-6 flex flex-col items-center">
                        <h2 className="text-5xl md:text-8xl font-[1000] italic uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-8 leading-tight">
                            Congratulations
                        </h2>
                        <div className="bg-slate-900/90 border border-white/20 rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden mb-12">
                            <h3 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-6">
                                {soldOverlay.playerName}
                            </h3>
                            <div className={`px-10 py-5 rounded-2xl text-3xl md:text-5xl font-[1000] uppercase italic ${soldOverlay.teamColor} text-white`}>
                                {soldOverlay.teamName}
                            </div>
                        </div>
                        <button 
                            onClick={() => setSoldOverlay(prev => ({ ...prev, show: false }))}
                            className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black uppercase italic tracking-widest text-sm hover:scale-105 transition-all"
                        >
                            <span>Continue</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            )}

            {/* --- TOP NAV --- */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-[100]">
                <button onClick={() => setAuctionType(null)} className="bg-slate-900/80 hover:bg-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                    ← Exit {auctionType} Arena
                </button>
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em]">
                    {auctionType} Live • Round {currentRound} • ID: {currentPlayer?.id}
                </div>
            </div>

            <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
                {!currentPlayer ? (
                    <div className="text-center py-32 bg-slate-900/40 backdrop-blur-md rounded-[4rem] border border-white/5">
                        <h2 className="text-6xl font-black text-slate-700 uppercase italic">Auction Complete</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5">
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

                        <div className="lg:col-span-7 flex flex-col gap-8">
                            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl">
                                <p className="text-blue-500 font-black tracking-[0.5em] text-xs uppercase mb-4">Current Valuation</p>
                                <div className="text-8xl md:text-9xl font-[1000] tracking-tighter text-white mb-8">
                                    <span className="text-3xl text-slate-600 mr-2">₹</span>
                                    {currentBid.toLocaleString()}
                                </div>
                                {highestBidderId ? (
                                    <div className={`inline-block px-12 py-4 rounded-full text-2xl font-black uppercase italic shadow-2xl animate-pulse ${teams.find(t => t.id === highestBidderId)?.color}`}>
                                        {teams.find(t => t.id === highestBidderId)?.name}
                                    </div>
                                ) : (
                                    <div className="text-slate-600 font-black text-sm uppercase tracking-[0.3em]">Opening Bid Required</div>
                                )}
                            </div>

                            {user.role === 'ADMIN' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                        {teams.map(team => {
                                            const isLeading = String(highestBidderId) === String(team.id);
                                            const isDuelist = (activeDuelists || []).includes(team.id);
                                            const canEnter = (activeDuelists || []).length < 2 && !(gaveUpTeams || []).includes(team.id);

                                            return (
                                                <div key={team.id} className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleBid(team.id)}
                                                        disabled={isLeading || (!isDuelist && !canEnter)}
                                                        className={`p-4 rounded-2xl transition-all duration-300 ${team.color} ${isLeading ? 'ring-4 ring-white scale-105 shadow-xl' : (!isDuelist && !canEnter ? 'opacity-20 grayscale' : 'opacity-100 hover:scale-105')}`}
                                                    >
                                                        <p className="text-[8px] font-black uppercase truncate mb-1">{team.name}</p>
                                                        <p className="text-xs font-black italic">{isLeading ? "LEADING" : "ENTER"}</p>
                                                    </button>
                                                    {isDuelist && (
                                                        <button
                                                            onClick={() => handleGiveUp(team.id)}
                                                            disabled={isLeading}
                                                            className={`py-1.5 text-[10px] font-black uppercase rounded-xl border transition-all ${isLeading ? 'bg-transparent border-white/10 text-white/20' : 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                                                        >
                                                            Give Up
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button onClick={handleHammerDown} className="w-full py-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-blue-700 text-3xl font-[1000] italic uppercase tracking-tighter shadow-3xl hover:brightness-110 active:scale-95 transition-all">
                                        {highestBidderId ? "🔨 SOLD - HAMMER DOWN" : "⏭️ SKIP PLAYER"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionHub;