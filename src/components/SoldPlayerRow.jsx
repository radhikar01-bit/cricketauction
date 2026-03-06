const SoldPlayerRow = ({ player, onReset }) => (
    <tr className="hover:bg-slate-800/30 transition-colors group">
        <td className="p-6 font-black italic uppercase text-lg group-hover:text-blue-400 transition-colors">
            {player.name}
        </td>
        <td className="p-6">
            <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs font-black text-blue-400 uppercase">
                {player.soldTo}
            </span>
        </td>
        <td className="p-6 font-black text-slate-300 text-xl italic">
            ₹{player.price?.toLocaleString()}
        </td>
        <td className="p-6 text-right">
            <button
                onClick={() => onReset(player)}
                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95"
            >
                Reset to Unsold
            </button>
        </td>
    </tr>
);
export default SoldPlayerRow;