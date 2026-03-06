const LeaderboardSidebar = ({ teams, onTeamClick }) => {
    // Sort teams by remaining budget (Highest first)
    const sortedTeams = [...teams].sort((a, b) => b.budget - a.budget);

    return (
        <div className="w-72 bg-slate-900 border-r border-slate-800 h-screen flex flex-col p-4 sticky top-0">
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Team Leaderboard
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {sortedTeams.map((team, index) => (
                    <div
                        key={team.id}
                        onClick={() => onTeamClick(team)}
                        className="group cursor-pointer bg-slate-800/40 hover:bg-slate-800 p-3 rounded-xl border border-slate-700/50 transition-all"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold">#{index + 1}</span>
                            <span className="text-[10px] font-black text-blue-400">{team.players && team.players.length}/8</span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{team.name}</h4>
                        <p className="text-lg font-black text-yellow-500 italic">₹{team.budget.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default LeaderboardSidebar;