import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const Footer = ({ teams = [], soldPlayers = [] }) => {
    const currentYear = new Date().getFullYear();

    // CALCULATIONS
    const totalMarketValue = (soldPlayers || []).reduce((sum, p) => sum + (p.price || 0), 0);
    const playersLockedCount = (soldPlayers || []).length;

    const recentSales = [...(soldPlayers || [])].reverse().slice(0, 10);

    return (
        <footer className="w-full bg-slate-950 border-t border-slate-800/50 mt-auto">

            {/* --- LIVE TICKER SECTION --- */}
           

            <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-left">

                    {/* COLUMN 1: BRANDING */}
                    <div className="flex flex-col gap-3">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                            <h3 className="text-xl font-[1000] italic tracking-tighter uppercase text-white">
                                Cricket<span className="text-blue-500">Central</span>
                            </h3>
                        </Link>
                        <p className="text-slate-500 text-[10px] font-bold leading-relaxed max-w-[250px] uppercase tracking-wider">
                            The official auction powerhouse. Precision bidding and real-time auction arena duels.
                        </p>
                    </div>

                    {/* COLUMN 2: QUICK LINKS (Wired up) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Navigation</h4>
                            <ul className="flex flex-col gap-2 text-[10px] font-black uppercase tracking-widest">
                                <li>
                                    <a href="/" className="text-slate-600 hover:text-white transition-colors">Live Auction Arena</a>
                                </li>
                                <li>
                                    <Link to="/dashboard" className="text-slate-600 hover:text-blue-500 transition-colors">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/squads" className="text-slate-600 hover:text-blue-500 transition-colors">Squads</Link>
                                </li>
                                <li>
                                    <Link to="/admin" className="text-slate-600 hover:text-red-500 transition-colors">Control Center</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Resources</h4>
                            <ul className="flex flex-col gap-2 text-[10px] font-black uppercase tracking-widest">
                                <li>
                                    <a href="#" className="text-slate-600 hover:text-white transition-colors">Auction Rules</a>
                                </li>
                                <li>
                                    <Link to="/setupdb" className="text-slate-700 hover:text-white transition-colors">Reset Database</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* COLUMN 3: LIVE INSIGHTS */}
                    <div className="bg-slate-900/30 rounded-2xl p-5 border border-slate-800/50 flex justify-between items-center group hover:border-blue-500/30 transition-all">
                        <div>
                            <p className="text-slate-600 text-[8px] font-black uppercase mb-1">Total Market Value</p>
                            <p className="text-2xl font-[1000] italic text-white leading-none">
                                ₹{(totalMarketValue / 100000).toFixed(2)}<span className="text-xs text-blue-500 ml-1">L</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-600 text-[8px] font-black uppercase mb-1">Locked</p>
                            <p className="text-2xl font-[1000] italic text-white leading-none group-hover:text-blue-500 transition-colors">{playersLockedCount}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
                        © {currentYear} <span className="text-slate-500">Cricket Central</span>. All Rights Reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-[9px] font-black text-slate-800 uppercase cursor-default">Version 2.0.26</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;