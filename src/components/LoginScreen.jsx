import React, { useState } from 'react';
import { USERS } from '../users';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const user = USERS[email];

        if (user && user.pin === pin) {
            // Save to local storage for persistence
            localStorage.setItem('auctionUser', JSON.stringify({ ...user, email }));
            onLoginSuccess({ ...user, email });
        } else {
            setError('Invalid Credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl rotate-12 mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-white text-3xl font-black -rotate-24">A</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Cricket Auction Login</h2>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-2 font-bold">Secure Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            placeholder="owner@team.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Access PIN</label>
                        <input
                            type="password"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all tracking-[1em]"
                            placeholder="••••"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-[1000] uppercase italic py-4 rounded-2xl transition-all active:scale-95 shadow-xl mt-4"
                    >
                        Enter Arena
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;