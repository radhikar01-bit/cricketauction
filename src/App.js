import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ref, onValue, update } from "firebase/database";
import { db } from "./firebase";

// Components
import AuctionHub from './components/AuctionHub';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Setup from './components/Setup';
import Login from './components/LoginScreen';
import Footer from './components/Footer';
import ConditionalHeader from './components/ConditionalHeader';
import Squads from './components/Squads';

import { INITIAL_TEAMS, PLAYER_POOL } from './auctionData';

function App() {
    const [auctionState, setAuctionState] = useState({
        teams: INITIAL_TEAMS,
        currentIndex: 0,
        soldPlayers: [],
        currentBid: 5000,
        highestBidderId: null,
        bidHistory: [],
        activeDuelists: [],
        gaveUpTeams: []
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auctionRef = ref(db, 'live_auction');
        const unsubscribe = onValue(auctionRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setAuctionState(data);
            setLoading(false);
        });

        const savedUser = localStorage.getItem('auctionUser');
        if (savedUser) setUser(JSON.parse(savedUser));

        return () => unsubscribe();
    }, []);

    const syncToCloud = (updates) => {
        const auctionRef = ref(db, 'live_auction');
        update(auctionRef, updates);
    };

    const handleLogout = () => {
        localStorage.removeItem('auctionUser');
        setUser(null);
    };

    // --- LOGIC ---
    const soldPlayerIds = new Set((auctionState.soldPlayers || []).map(p => p.id));
    const availablePool = PLAYER_POOL.filter(p => !soldPlayerIds.has(p.id));

    // Stable Round Logic based on current available pool size
    const poolSize = availablePool.length || 1;
    const currentRoundNumber = Math.floor(auctionState.currentIndex / poolSize) + 1;
    const activeIndex = auctionState.currentIndex % poolSize;
    const currentPlayer = availablePool[activeIndex];
    const recentSales = [...(auctionState.soldPlayers || [])].reverse().slice(0, 10);

    if (loading && !window.location.pathname.includes('setupdb')) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-black italic tracking-tighter text-2xl animate-pulse">
                LOADING ARENA...
            </div>
        );
    }

    if (!user) {
        return <Login onLoginSuccess={(userData) => setUser(userData)} />;
    }

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
                <ConditionalHeader
                    auctionState={auctionState}
                    user={user}
                    onLogout={handleLogout}
                    availableCount={availablePool.length}
                    round={currentRoundNumber}
                    recentSales={recentSales}
                />

                {/* THE MAIN ARENA CONTAINER */}
                <main className="flex-1 relative overflow-hidden bg-slate-950">

                    {/* BACKGROUND IMAGE LAYER */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: '0.25', // Visible but not distracting
                            mixBlendMode: 'luminosity' // Makes it look premium/integrated
                        }}
                    />

                    {/* VIGNETTE OVERLAY (Darkens edges to focus on center) */}
                    <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none opacity-80" />

                    {/* SCROLLABLE CONTENT LAYER */}
                    <div className="relative z-10 h-full overflow-y-auto">
                        <Routes>
                            <Route path="/setupdb" element={<Setup />} />
                            {auctionState?.teams && (
                                <>
                                    <Route path="/" element={
                                        <AuctionHub
                                            {...auctionState}
                                            currentPlayer={currentPlayer}
                                            availableCount={availablePool.length}
                                            currentRound={currentRoundNumber}
                                            syncToCloud={syncToCloud}
                                            user={user}
                                        />
                                    } />
                                    <Route path="/dashboard" element={<Dashboard {...auctionState} />} />
                                    <Route path="/squads" element={<Squads teams={auctionState.teams} />} />
                                    <Route path="/admin" element={
                                        user.role === 'ADMIN'
                                            ? <AdminPanel {...auctionState} syncToCloud={syncToCloud} />
                                            : <Navigate to="/" />
                                    } />
                                </>
                            )}
                        </Routes>
                    </div>
                </main>

                <Footer
                    teams={auctionState.teams}
                    soldPlayers={auctionState.soldPlayers || []}
                />
            </div>
        </Router>
    );
}

export default App;