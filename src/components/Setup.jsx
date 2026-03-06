import React from 'react';
import { ref, set } from "firebase/database";
import { db } from "../firebase";
import { INITIAL_TEAMS, PLAYER_POOL } from '../auctionData';

const Setup = () => {
    const handleInitialize = () => {
        if (window.confirm("Upload local JSON data to Cloud? This overwrites everything!")) {
            // Push everything to the 'live_auction' path
            set(ref(db, 'live_auction'), {
                teams: INITIAL_TEAMS,
                playerPool: PLAYER_POOL, // Pushing the player list too!
                currentIndex: 0,
                soldPlayers: [],
                currentBid: 5000,
                highestBidderId: null,
                bidHistory: []
            })
                .then(() => alert("✅ Database Ready! JSON data uploaded to Firebase."))
                .catch((err) => alert("❌ Error: " + err.message));
        }

        };

    return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-blue-500/30 text-center max-w-md shadow-2xl">
                <h1 className="text-3xl font-black italic uppercase mb-4">Database Setup</h1>
                <p className="text-slate-400 text-sm mb-8">
                    Click below to sync your <code className="text-blue-400">auctionData.js</code> file with the Firebase Cloud Database.
                </p>
                <button
                    onClick={handleInitialize}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    🚀 Upload JSON to Cloud
                </button>
            </div>
        </div>
    );
};

export default Setup;