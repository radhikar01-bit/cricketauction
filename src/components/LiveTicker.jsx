const LiveTicker = ({ soldPlayers }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-blue-900 h-10 flex items-center overflow-hidden border-t border-blue-400 z-40">
            <div className="bg-yellow-500 text-black px-4 h-full flex items-center font-black italic skew-x-[-20deg] -ml-2 z-10">
                LATEST SALES
            </div>
            <div className="whitespace-nowrap flex gap-20 animate-marquee items-center text-sm font-bold">
                {soldPlayers && soldPlayers.length > 0 ? (
                    [...soldPlayers].reverse().map((p, i) => (
                        <span key={i} className="text-white">
                            🔥 <span className="text-yellow-400">{p.name}</span> SOLD TO <span className="uppercase">{p.soldTo}</span> FOR <span className="italic">₹{p.price.toLocaleString()}</span>
                        </span>
                    ))
                ) : (
                    <span className="text-white opacity-50 uppercase tracking-widest">Auction initializing... Standing by for opening bids...</span>
                )}
            </div>
        </div>
    );
};
export default LiveTicker;