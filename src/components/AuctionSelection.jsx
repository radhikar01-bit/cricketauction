const AuctionSelection = () => {
    return (
        <div className="flex gap-10 justify-center items-center h-screen bg-slate-950">
            <Link to="/auction/mens" className="p-10 bg-blue-900 rounded-3xl hover:scale-105 transition-all text-center">
                <h2 className="text-4xl font-bold">MENS AUCTION</h2>
                <p>IPL 2026 Edition</p>
            </Link>
            
            <Link to="/auction/womens" className="p-10 bg-pink-900 rounded-3xl hover:scale-105 transition-all text-center">
                <h2 className="text-4xl font-bold">WOMENS AUCTION</h2>
                <p>WPL 2026 Edition</p>
            </Link>
        </div>
    );
};
export default AuctionSelection;