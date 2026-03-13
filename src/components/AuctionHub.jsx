import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from './PlayerCard';


const AuctionHub = ({
    teams = [],
    currentIndex = 0,
    soldPlayers = [],
    unsoldPlayers = [],
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
    const lastProcessedId = useRef(null); 
    const prevRoundRef = useRef(currentRound);

    const FALLBACK_BASE = 5000;
    const BID_INCREMENT = 10000;
    const SQUAD_LIMIT = 8;

    useEffect(() => {
        if (currentRound > prevRoundRef.current) setPhaseOverlay(true);
        prevRoundRef.current = currentRound;
    }, [currentRound]);

    useEffect(() => {
        const currentLength = soldPlayers?.length || 0;
        const lastSold = soldPlayers[currentLength - 1];
        if (currentLength > prevSoldLength.current && lastSold && lastSold.id !== lastProcessedId.current) {
            lastProcessedId.current = lastSold.id;
            setSoldOverlay({
                show: true,
                playerName: lastSold.name,
                teamName: lastSold.soldTo,
                teamColor: lastSold.teamColor || 'bg-blue-600'
            });
            const timer = setTimeout(() => {
                setSoldOverlay(p => ({ ...p, show: false }));
            }, 3500);
            return () => clearTimeout(timer);
        }
        prevSoldLength.current = currentLength;
    }, [soldPlayers]);

    const handleBid = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;
        const teamPlayers = team.players || [];
        if (teamPlayers.length >= SQUAD_LIMIT) return alert(`Squad Full for ${team.name}!`);
        const isAlreadyInDuel = (activeDuelists || []).includes(teamId);
        if (!isAlreadyInDuel && (activeDuelists || []).length >= 2) {
            return alert("Auction Arena is full! A team must FOLD before you can enter the race.");
        }
        const playerBase = currentPlayer?.basePrice || FALLBACK_BASE;
        const nextBidAmount = highestBidderId ? currentBid + BID_INCREMENT : playerBase;
        const slotsRemaining = SQUAD_LIMIT - teamPlayers.length;
        const reserveForOthers = (slotsRemaining - 1) * FALLBACK_BASE;
        const maxPossibleBid = team.budget - reserveForOthers;
        if (nextBidAmount > team.budget) return alert(`Not enough budget!`);
        if (nextBidAmount > maxPossibleBid) return alert(`Budget error: Must reserve funds for remaining squad slots.`);
        syncToCloud({
            currentBid: nextBidAmount,
            highestBidderId: teamId,
            bidHistory: [{ 
                id: Date.now(), teamId, team: team.name, amount: nextBidAmount, color: team.color 
            }, ...(bidHistory || [])].slice(0, 3),
            activeDuelists: isAlreadyInDuel ? activeDuelists : [...(activeDuelists || []), teamId],
            gaveUpTeams: (gaveUpTeams || []).filter(id => id !== teamId)
        });
    };

    const handleGiveUp = (teamId) => {
        if (String(highestBidderId) === String(teamId)) return;
        syncToCloud({ 
            activeDuelists: (activeDuelists || []).filter(id => id !== teamId), 
            gaveUpTeams: [...(gaveUpTeams || []), teamId] 
        });
    };

    const handleHammerDown = () => {
        if (user.role !== 'ADMIN' || !currentPlayer) return;
        setSoldOverlay({ show: false, playerName: '', teamName: '', teamColor: '' });
        const isSold = highestBidderId !== null;
        let updatedUnsold = [...(unsoldPlayers || [])];
        let updatedSold = [...(soldPlayers || [])];
        let updatedTeams = [...teams];
        if (isSold) {
            const winningTeam = teams.find(t => t.id === highestBidderId);
            updatedTeams = teams.map(t => t.id === highestBidderId ? {
                ...t,
                budget: t.budget - currentBid,
                players: [...(t.players || []), { ...currentPlayer, finalPrice: currentBid }]
            } : t);
            updatedSold.push({ 
                ...currentPlayer, id: currentPlayer.id || `sold-${Date.now()}`,
                soldTo: winningTeam.name, price: currentBid, teamColor: winningTeam.color 
            });
        } else {
            updatedUnsold.push({ ...currentPlayer });
        }
        const isLastPlayer = (currentIndex >= availableCount - 1);
        const updateData = {
            teams: updatedTeams, soldPlayers: updatedSold, activeDuelists: [], gaveUpTeams: [], 
            currentBid: FALLBACK_BASE, highestBidderId: null, bidHistory: []
        };
        if (isLastPlayer) {
            if (updatedUnsold.length > 0) {
                updateData.currentIndex = 0;
                updateData.currentRound = currentRound + 1;
                updateData.playersPool = updatedUnsold;
                updateData.unsoldPlayers = [];
            } else { updateData.currentPlayer = null; }
        } else {
            updateData.currentIndex = isSold ? currentIndex : currentIndex + 1;
            updateData.unsoldPlayers = updatedUnsold;
        }
        syncToCloud(updateData);
    };

    if (!auctionType) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
                <h1 className="text-7xl font-black italic uppercase mb-12">Select League</h1>
                <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
                    <button onClick={() => setAuctionType('mens')} className="p-16 rounded-[3rem] bg-slate-900 border border-blue-500/20 hover:bg-slate-800 transition-colors text-center">
                        <h2 className="text-5xl font-black italic uppercase">Men's</h2>
                        <p className="text-blue-400 mt-2 font-black uppercase text-xs tracking-widest">IPL 2026 EDITION</p>
                    </button>
                    <button onClick={() => setAuctionType('womens')} className="p-16 rounded-[3rem] bg-slate-900 border border-pink-500/20 hover:bg-slate-800 transition-colors text-center">
                        <h2 className="text-5xl font-black italic uppercase">Women's</h2>
                        <p className="text-pink-400 mt-2 font-black uppercase text-xs tracking-widest">WPL 2026 EDITION</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-slate-950 text-white overflow-hidden flex flex-col relative">
            {/* COMPACT HEADER */}
            <header className="h-14 flex items-center justify-between px-6 bg-slate-900 border-b border-white/5 shrink-0 z-20">
                <button onClick={() => setAuctionType(null)} className="text-[10px] font-black uppercase tracking-widest opacity-70 hover:opacity-100 flex items-center gap-2">
                    <span className="text-lg">←</span> Exit Arena
                </button>
                <div className="px-4 py-1 rounded-full bg-slate-800 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                    {auctionType} Live • Round {currentRound}
                </div>
            </header>

            <main className="flex-1 overflow-hidden px-4 py-4 lg:px-8 flex flex-col min-h-0">
                {!currentPlayer ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <h2 className="text-7xl font-[1000] italic uppercase text-slate-200">Auction Complete</h2>
                        <button onClick={() => setAuctionType(null)} className="mt-8 px-10 py-5 bg-white text-black rounded-full font-black uppercase italic text-lg shadow-2xl">Return to Lobby</button>
                    </div>
                ) : (
                    <div className="max-w-[1600px] mx-auto w-full flex flex-col h-90 min-h-0">
                        {/* TOP SECTION: PLAYER + BIDDING */}
                        <div className="grid grid-cols-12 gap-6 flex-[2] min-h-0 mb-6">
                            
                            {/* PLAYER HERO */}
                            <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0">
                                <div className="flex-1 bg-slate-900/60 rounded-[3rem] border border-white/5 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <PlayerCard 
                                            player={currentPlayer} currentRound={currentRound} availableCount={availableCount} 
                                            currentIndex={currentIndex} basePrice={currentPlayer?.basePrice || FALLBACK_BASE} 
                                            currentBid={currentBid} highestBidderId={highestBidderId} bidIncrement={BID_INCREMENT} 
                                        />
                                    </div>
                                    <div className="absolute bottom-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                                        PROSPECT {currentIndex + 1} OF {availableCount}
                                    </div>
                                </div>
                                {user.role === 'ADMIN' && (
                                    <button 
                                        onClick={handleHammerDown} 
                                        className="mt-4 w-full py-5 rounded-[2rem] bg-green-600 text-black text-xl font-[1000] italic uppercase border-b-4 border-slate-950 shrink-0"
                                    >
                                        {highestBidderId ? "🔨 HAMMER DOWN" : "⏭️ SKIP PLAYER"}
                                    </button>
                                )}
                            </div>

                            {/* BIDDING ARENA */}
                            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 min-h-0">
                                <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 shrink-0 shadow-2xl flex justify-between items-center">
                                    <div>
                                        <p className="text-blue-500 font-black tracking-[0.3em] text-[10px] uppercase mb-2">Current Valuation</p>
                                        <div className="text-7xl font-[1000] tracking-tighter leading-none text-white">
                                            <span className="text-2xl text-slate-500 font-bold mr-1 italic">₹</span>
                                            {currentBid.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-500 font-black text-[9px] uppercase mb-2 tracking-widest">Leading Bidder</p>
                                        {highestBidderId ? (
                                            <div className={`px-8 py-3 rounded-2xl text-xl font-black uppercase italic shadow-xl ring-1 ring-white/20 ${teams.find(t => t.id === highestBidderId)?.color}`}>
                                                {teams.find(t => t.id === highestBidderId)?.name}
                                            </div>
                                        ) : (
                                            <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em]">
                                                Awaiting Bid
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 bg-slate-900/20 rounded-[3rem] border border-white/5 p-6 min-h-0">
                                    <div className="grid grid-cols-4 xl:grid-cols-5 gap-3 h-full overflow-y-auto pr-2 custom-scrollbar content-start">
                                        {teams.map(team => {
                                            const isLeading = String(highestBidderId) === String(team.id);
                                            const isDuelist = (activeDuelists || []).includes(team.id);
                                            const canBid = (activeDuelists || []).length < 2 || isDuelist;
                                            const isLowBudget = team.budget < (currentBid + BID_INCREMENT);
                                            const isDisabled = isLeading || !canBid || (gaveUpTeams || []).includes(team.id);

                                            return (
                                                <div key={team.id} className={`flex flex-col transition-all duration-300 ${isDisabled && !isLeading ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                                                    <button
                                                        onClick={() => handleBid(team.id)}
                                                        disabled={isDisabled}
                                                        className={`relative flex-1 flex flex-col items-center justify-center py-5 rounded-[2rem] border-2 transition-all ${
                                                            isLeading ? 'bg-white border-white scale-105 z-10 shadow-2xl' : 
                                                            isDuelist ? 'bg-slate-800 border-blue-500' : 'bg-slate-900 border-white/5 hover:border-white/20'
                                                        }`}
                                                    >
                                                        <span className={`text-[8px] font-black uppercase mb-1 truncate w-full text-center px-2 ${isLeading ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {team.name}
                                                        </span>
                                                        <div className={`font-black uppercase italic leading-none text-base ${isLeading ? 'text-slate-950' : 'text-white'}`}>
                                                            {isLeading ? 'HOLD' : isLowBudget ? 'OUT' : 'BID'}
                                                        </div>
                                                        <div className={`text-[9px] font-bold mt-1 ${isLeading ? 'text-slate-600' : 'text-slate-400'}`}>
                                                            ₹{(team.budget / 100000).toFixed(1)}L
                                                        </div>
                                                    </button>
                                                    {isDuelist && !isLeading && (
                                                        <button onClick={() => handleGiveUp(team.id)} className="mt-2 py-1 text-[8px] font-black uppercase rounded-lg bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500/20 transition-all">
                                                            FOLD
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM SECTION: RECENTLY SOLD */}
                        
                    </div> 
                )}
            </main>

            {phaseOverlay && <RoundOverlay currentRound={currentRound} onClose={() => setPhaseOverlay(false)} />}
            {soldOverlay.show && <SoldOverlay data={soldOverlay} onClose={() => setSoldOverlay(p => ({...p, show: false}))} />}
        </div>
    );
};

const RoundOverlay = ({ currentRound, onClose }) => (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
        <h2 className="text-9xl font-[1000] italic uppercase text-white mb-6 tracking-tighter">Round {currentRound}</h2>
        <button onClick={onClose} className="px-14 py-6 bg-white text-black rounded-full font-black uppercase italic text-xl shadow-2xl">Enter Arena →</button>
    </div>
);

const SoldOverlay = ({ data, onClose }) => (
    <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/95 transition-all duration-500">
        <div className="relative text-center p-6">
            <h2 className="text-5xl font-black italic uppercase text-white/30 mb-2 tracking-[0.2em]">PLAYER SOLD</h2>
            <div className="bg-slate-900 border border-white/10 rounded-[3.5rem] p-14 mb-8 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-1 font-black italic rounded-lg">DEAL!</div>
                <h3 className="text-6xl font-black uppercase italic mb-8 text-white tracking-tighter">{data.playerName}</h3>
                <div className={`px-14 py-6 rounded-3xl text-4xl font-black uppercase italic shadow-lg ${data.teamColor} text-white`}>
                    {data.teamName}
                </div>
            </div>
            <button onClick={onClose} className="px-14 py-6 bg-white text-black rounded-full font-black uppercase italic text-sm tracking-widest opacity-50 hover:opacity-100">Close</button>
        </div>
    </div>
);

export default AuctionHub;