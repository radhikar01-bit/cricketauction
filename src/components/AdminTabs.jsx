const AdminTabs = ({ activeTab, setActiveTab, soldCount }) => (
    <div className="flex gap-2 mb-8 bg-slate-900 p-1.5 rounded-2xl w-fit border border-slate-800">
        <button
            onClick={() => setActiveTab("assign")}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assign' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
        >
            🔨 Manual Assignment
        </button>
        <button
            onClick={() => setActiveTab("manage")}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
        >
            📋 Manage Sold ({soldCount})
        </button>
    </div>
);



export default AdminTabs;