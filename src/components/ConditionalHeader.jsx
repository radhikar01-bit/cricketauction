import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, label, icon, isDanger, activeColorClass, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <Link 
            to={to} 
            onClick={onClick}
            className={`px-4 py-3 md:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 md:gap-2 w-full md:w-auto
            ${isActive 
                ? (isDanger ? 'bg-red-600 text-white shadow-lg' : `${activeColorClass} text-white shadow-lg`) 
                : 'text-slate-400 md:text-slate-500 hover:text-white hover:bg-slate-800'}`}
        >
            <span className="text-sm md:text-xs">{icon}</span>
            <span>{label}</span>
        </Link>
    );
};

const ConditionalHeader = ({ user, onLogout, availableCount, round, recentSales, auctionType }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isWomens = auctionType === 'womens';
    const themeColor = isWomens ? 'bg-pink-600' : 'bg-blue-600';
    const textColor = isWomens ? 'text-pink-500' : 'text-blue-500';
    const tickerBg = isWomens ? 'bg-pink-800' : 'bg-blue-800';
    const tickerBorder = isWomens ? 'border-pink-400/20' : 'border-blue-400/20';

    if (location.pathname.includes('setupdb')) return null;

    return (
        <header className="sticky top-0 z-[100] flex flex-col w-full shadow-2xl">
            {/* --- TOP BAR: LIVE TICKER --- */}
            <div className={`bg-white overflow-hidden flex h-10 items-center border-b ${tickerBorder} relative`}>
                <div className={`${tickerBg} text-white text-[10px] md:text-[12px] font-black px-4 h-full flex items-center z-20 shadow-[5px_0_15px_rgba(0,0,0,0.3)]`}>
                    LIVE
                </div>
                <div className="flex whitespace-nowrap animate-marquee items-center text-slate-800">
                   {/* Ticker Content... */}
                   {recentSales?.map((player, idx) => (
                        <span key={idx} className="flex items-center mx-6 font-bold text-[11px]">
                            {player.name} <span className={`ml-1 ${textColor}`}>₹{player.price}</span>
                        </span>
                   ))}
                </div>
            </div>

            {/* --- BOTTOM BAR: NAVIGATION --- */}
            <div className="bg-slate-950/95 backdrop-blur-xl border-b border-white/5 relative">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    
                    {/* LEFT: Logo/User Info Area */}
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 md:w-9 md:h-9 ${themeColor} rounded-lg flex items-center justify-center font-black italic text-white text-xs shadow-lg`}>
                            {user.role[0]}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-[10px] md:text-[11px] font-[1000] uppercase italic leading-none">
                                {user.name} 
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[8px] font-black ${textColor} uppercase`}>PHASE {round}</span>
                                <span className="text-[8px] font-black text-green-500 uppercase">{availableCount} LEFT</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Desktop Nav & Mobile Toggle */}
                    <div className="flex items-center gap-2">
                        {/* Desktop-only Nav */}
                        <nav className="hidden md:flex items-center gap-2">
                            <NavLink to="/" label="Arena" icon="⚔️" activeColorClass={themeColor} />
                            <NavLink to="/dashboard" label="Dashboard" icon="📈" activeColorClass={themeColor} />
                            <NavLink to="/squads" label="Squads" icon="🏏" activeColorClass={themeColor} />
                            {user.role === 'ADMIN' && (
                                <>
                                    <NavLink to="/admin" label="Control" icon="🛡️" isDanger activeColorClass="bg-red-600" />
                                    <NavLink to="/admin/planning" label="Planning" icon="📋" activeColorClass="bg-blue-600" />
                                </>
                            )}
                            <button onClick={onLogout} className="ml-2 p-2 text-slate-500 hover:text-red-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </nav>

                        {/* Mobile Menu Toggle Button (Stays next to logo) */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE DROPDOWN (Pops out under the header) */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top duration-200">
                        <NavLink to="/" label="Arena" icon="⚔️" activeColorClass={themeColor} onClick={() => setIsMenuOpen(false)} />
                        <NavLink to="/dashboard" label="Dashboard" icon="📈" activeColorClass={themeColor} onClick={() => setIsMenuOpen(false)} />
                        <NavLink to="/squads" label="Squads" icon="🏏" activeColorClass={themeColor} onClick={() => setIsMenuOpen(false)} />
                        {user.role === 'ADMIN' && (
                            <>
                                <NavLink to="/admin" label="Control" icon="🛡️" isDanger activeColorClass="bg-red-600" onClick={() => setIsMenuOpen(false)} />
                                <NavLink to="/admin/planning" label="Planning" icon="📋" activeColorClass="bg-blue-600" onClick={() => setIsMenuOpen(false)} />
                            </>
                        )}
                        <button onClick={onLogout} className="flex items-center gap-3 p-3 text-red-400 font-black uppercase text-[10px]">
                            <span>🚪</span> LOGOUT
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default ConditionalHeader;