import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import TeamMarquee from './TeamMarquee'; // Import the new component
const NavLink = ({ to, label, icon, isDanger }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isActive ? (isDanger ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-white text-black shadow-lg') : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
            <span className="text-xs">{icon}</span>
            <span className="hidden md:inline">{label}</span>
        </Link>
    );
};

const ConditionalHeader = ({ user, onLogout, availableCount, round, recentSales }) => {
    const location = useLocation();

   

    if (location.pathname.includes('setupdb')) return null;

    return (
        <header className="sticky top-0 z-[100] flex flex-col w-full shadow-2xl">

            {/* --- TOP BAR: LIVE TICKER --- */}
            <div className="bg-white overflow-hidden flex h-10 items-center border-b border-blue-400/20 relative">
                <div className="bg-blue-800 text-blue-100 text-[12px] font-black px-4 h-full flex items-center uppercase italic tracking-tighter z-20 shadow-[5px_0_15px_rgba(0,0,0,0.3)]">
                    LIVE UPDATES
                </div>

                <div className="flex whitespace-nowrap animate-marquee items-center text-blue-800">
                    {recentSales && recentSales.length > 0 ? (
                        recentSales.map((player, idx) => (
                            <span key={idx} className="flex items-center mx-6">
                                <span className="text-blue-800 text-[9px] font-bold uppercase mr-2">{player.role}</span>
                                <span className="font-black uppercase italic text-[11px] mr-2">{player.name}</span>
                                <span className="text-blue-800 font-black text-[11px]">₹{player.price?.toLocaleString()}</span>
                                <span className="ml-2 text-[9px] text-blue-800 font-black uppercase">→ {player.soldTo}</span>
                                <span className="mx-4 opacity-30 text-white">|</span>
                            </span>
                        ))
                    ) : (
                        <span className="text-blue-800 text-[10px] font-black uppercase tracking-widest px-10">
                            The Arena is open. Waiting for the first lock...
                        </span>
                    )}
                </div>
            </div>

            {/* --- MIDDLE BAR: TEAM LOGO MARQUEE --- */}
            {/*      <TeamMarquee />*/}  

            {/* --- BOTTOM BAR: NAVIGATION --- */}
            <div className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-white text-sm">
                            {user.role[0]}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-[11px] font-[1000] uppercase italic leading-none">{user.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">PHASE {round}</span>
                                <span className="text-[8px] font-black text-slate-700">/</span>
                                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">{availableCount} LEFT</span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-2">
                        <NavLink to="/" label="Auction Arena" icon="⚔️" />
                        <NavLink to="/dashboard" label="Dashboard" icon="📈" />
                        <NavLink to="/squads" label="Squads" icon="🏏" />
                        {user.role === 'ADMIN' && <NavLink to="/admin" label="Control Center" icon="🛡️" isDanger />}

                        <button onClick={onLogout} className="ml-3 p-2 text-slate-600 hover:text-red-500 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default ConditionalHeader;