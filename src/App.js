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
import PlanningTab from './components/PlanningTab';

// --- Data Imports ---
import { 
    IPL_PLAYERS, 
    PLAYER_POOL, 
    IPL_TEAMS, 
    INITIAL_TEAMS 
} from './auctionData';

function App() {
    const [auctionType, setAuctionType] = useState(() => {
        return localStorage.getItem('activeAuctionType') || null;
    });
    
    const [auctionState, setAuctionState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (auctionType) {
            localStorage.setItem('activeAuctionType', auctionType);
        }
    }, [auctionType]);

    const dbPath = auctionType === 'womens' ? 'live_auction_womens' : 'live_auction_mens';
    const CURRENT_POOL = auctionType === 'womens' ? PLAYER_POOL : IPL_PLAYERS;
    const DEFAULT_TEAMS = auctionType === 'womens' ? INITIAL_TEAMS : IPL_TEAMS;

    useEffect(() => {
        if (!auctionType) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const auctionRef = ref(db, dbPath);
        const unsubscribe = onValue(auctionRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAuctionState(data);
            } else {
                const initialState = {
                    teams: DEFAULT_TEAMS,
                    currentIndex: 0,
                    currentRound: 1, 
                    soldPlayers: [],
                    unsoldPlayers: [], 
                    playersPool: [], // Pool for subsequent rounds
                    currentBid: 5000,
                    highestBidderId: null,
                    bidHistory: [],
                    activeDuelists: [],
                    gaveUpTeams: []
                };
                setAuctionState(initialState);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auctionType, dbPath, DEFAULT_TEAMS]);

    useEffect(() => {
        const savedUser = localStorage.getItem('auctionUser');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const syncToCloud = (updates) => {
        if (!auctionType) return;
        const auctionRef = ref(db, dbPath);
        update(auctionRef, updates);
    };

    const handleLogout = () => {
        localStorage.removeItem('auctionUser');
        localStorage.removeItem('activeAuctionType');
        setUser(null);
        setAuctionType(null);
    };

    // --- REFINED DERIVED LOGIC ---
    
    // 1. Determine active pool: Round 1 uses CURRENT_POOL, Round 2+ uses playersPool
    const activePoolSource = (auctionState?.playersPool && auctionState.playersPool.length > 0) 
        ? auctionState.playersPool 
        : CURRENT_POOL;

    const soldPlayerIds = new Set((auctionState?.soldPlayers || []).map(p => p.id));
    
    // 2. Filter available players from the ACTIVE pool source
    const availablePool = (activePoolSource || []).filter(p => !soldPlayerIds.has(p.id));

    // 3. Metadata and Round tracking
    const currentRoundNumber = auctionState?.currentRound || 1;
    const activeIndex = auctionState ? auctionState.currentIndex : 0;
    
    // 4. Current Player detection (returns null if we've exhausted the current pool)
    const currentPlayer = availablePool[activeIndex] || null;
    
    const recentSales = [...(auctionState?.soldPlayers || [])].reverse().slice(0, 10);

    if (!user) {
        return <Login onLoginSuccess={(userData) => setUser(userData)} />;
    }

    if (loading && auctionType) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <div className={`w-12 h-12 border-4 ${auctionType === 'womens' ? 'border-pink-500' : 'border-blue-500'} border-t-transparent rounded-full animate-spin mb-4`}></div>
                <div className="font-black italic uppercase tracking-tighter text-2xl animate-pulse">
                    LOADING {auctionType.toUpperCase()} ARENA...
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
                
                {auctionType && (
                    <ConditionalHeader
                        auctionState={auctionState || { teams: DEFAULT_TEAMS }}
                        user={user}
                        onLogout={handleLogout}
                        availableCount={availablePool.length}
                        round={currentRoundNumber}
                        recentSales={recentSales}
                        auctionType={auctionType}
                    />
                )}

                <main className="flex-1 relative overflow-hidden bg-slate-950">
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: '0.15',
                            mixBlendMode: 'luminosity'
                        }}
                    />

                    <div className="relative z-10 h-full overflow-y-auto">
                        <Routes>
                            <Route path="/setupdb" element={<Setup />} />
                            
                            <Route path="/" element={
                                <AuctionHub
                                    {...(auctionState || { teams: DEFAULT_TEAMS })}
                                    auctionType={auctionType}
                                    setAuctionType={setAuctionType}
                                    currentPlayer={currentPlayer}
                                    availableCount={availablePool.length}
                                    currentRound={currentRoundNumber}
                                    syncToCloud={syncToCloud}
                                    user={user}
                                />
                            } />
                            
                            {auctionType && auctionState && (
                                <>
                                    <Route path="/dashboard" element={<Dashboard teams={auctionState.teams} auctionType={auctionType}/>} />
                                    <Route path="/squads" element={<Squads teams={auctionState.teams} />} />
                                    <Route path="/admin" element={
                                        user.role === 'ADMIN'
                                            ? <AdminPanel 
                                                {...auctionState} 
                                                syncToCloud={syncToCloud} 
                                                playerPool={CURRENT_POOL} 
                                                initialTeams={DEFAULT_TEAMS} 
                                              />
                                            : <Navigate to="/" />
                                    } />
                                </>
                            )}
                            <Route path="/admin/planning" element={<PlanningTab />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </main>

                <Footer
                    teams={auctionState?.teams || DEFAULT_TEAMS}
                    soldPlayers={auctionState?.soldPlayers || []}
                />
            </div>
        </Router>
    );
}

export default App;