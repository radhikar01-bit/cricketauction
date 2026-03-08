import React from 'react';
import { ref, set } from "firebase/database";
import { db } from "../firebase";
import { INITIAL_TEAMS, PLAYER_POOL, IPL_TEAMS, IPL_PLAYERS } from '../auctionData';

const Setup = () => {
    const handleInitialize = (type) => {
        const isWomens = type === 'womens';
        const path = isWomens ? 'live_auction_womens' : 'live_auction_mens';
        
        // This selects the data from your auctionData.js file
        const teams = isWomens ? INITIAL_TEAMS : IPL_TEAMS;

        if (window.confirm(`DANGER: This will wipe all current progress and reset the ${type.toUpperCase()} auction. Continue?`)) {
            set(ref(db, path), {
                teams: teams,
                currentIndex: 0,
                soldPlayers: [],
                currentBid: 5000,
                highestBidderId: null,
                bidHistory: [],
                activeDuelists: [],
                gaveUpTeams: []
            })
            .then(() => alert(`✅ ${type.toUpperCase()} Arena Initialized Successfully!`))
            .catch((error) => alert(`❌ Error: ${error.message}`));
        }
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/10 text-center max-w-lg shadow-2xl">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⚙️</span>
                </div>
                
                <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-4">Database Terminal</h1>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                    Initialize or Reset your Firebase nodes. This will sync your <code className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded">auctionData.js</code> teams to the cloud.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={() => handleInitialize('womens')} 
                        className="group flex items-center justify-between bg-pink-600 hover:bg-pink-500 p-6 rounded-2xl transition-all active:scale-95"
                    >
                        <span className="font-black uppercase italic text-xl">Setup Women's WPL</span>
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-bold">WPL 2026</span>
                    </button>

                    <button 
                        onClick={() => handleInitialize('mens')} 
                        className="group flex items-center justify-between bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl transition-all active:scale-95"
                    >
                        <span className="font-black uppercase italic text-xl">Setup Men's IPL</span>
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-bold">IPL 2026</span>
                    </button>
                </div>

                <p className="mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    Warning: This action cannot be undone
                </p>
            </div>
        </div>
    );
};

export default Setup;