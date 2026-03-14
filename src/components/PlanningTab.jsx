import React, { useState, useEffect } from 'react';
import { PLAYER_POOL } from '../auctionData';
import { db } from '../firebase'; 
import { ref, set, onValue } from "firebase/database";

const PlanningTab = () => {
  const [columns, setColumns] = useState({
    pool: PLAYER_POOL,
    mustHave: [],
    goodToHave: [],
    wildcards: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('pool'); // 'pool', 'planner', or 'dream'

  // Data from your uploaded image
  const dreamTeamData = [
    { name: "Radhika", skill: "Batter" },
    { name: "Archie R Kumar / Jhanvi", skill: "Batter" },
    { name: "Arati Dighe / Reshma", skill: "Batter" },
    { name: "Anchita Vimal Singh / Devika Vimal", skill: "All Rounder" },
    { name: "Kavita", skill: "All Rounder" },
    { name: "Sejal", skill: "Bowler" },
    { name: "Shachi", skill: "Bowler" },
    { name: "Siddhi", skill: "Bowler" },
    { name: "Nivedita Thakur (Base Price)", skill: "Bowler" },
  ];

  // Added Sabotage List
  const budgetDrainers = [
    "Snehal Desai", "Gunjan Gite", "Priya Jain", 
    "Ketki Joshi", "Reshma Kotian", "Kavita Bhatt", "Pari Bhatt"
  ];

  useEffect(() => {
    const planRef = ref(db, 'auction_plans/admin_user');
    onValue(planRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const findPlayers = (ids) => PLAYER_POOL.filter(p => ids?.includes(p.id));
        const selectedIds = [...(data.mustHave || []), ...(data.goodToHave || []), ...(data.wildcards || [])];
        
        setColumns({
          pool: PLAYER_POOL.filter(p => !selectedIds.includes(p.id)),
          mustHave: findPlayers(data.mustHave),
          goodToHave: findPlayers(data.goodToHave),
          wildcards: findPlayers(data.wildcards)
        });
      }
    });
  }, []);

  const totalSelected = columns.mustHave.length + columns.goodToHave.length + columns.wildcards.length;

  const moveTo = (player, fromCol, toCol) => {
    if (fromCol === 'pool' && toCol !== 'pool' && totalSelected >= 25) {
      alert("Planning limit reached (Max 25 players)!");
      return;
    }
    setColumns(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(p => p.id !== player.id),
      [toCol]: [player, ...prev[toCol]] 
    }));
  };

  const handleClearAll = async () => {
    if (window.confirm("Clear all data from Firebase and reset?")) {
      setColumns({ pool: PLAYER_POOL, mustHave: [], goodToHave: [], wildcards: [] });
      await set(ref(db, 'auction_plans/admin_user'), null);
    }
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      await set(ref(db, 'auction_plans/admin_user'), {
        mustHave: columns.mustHave.map(p => p.id),
        goodToHave: columns.goodToHave.map(p => p.id),
        wildcards: columns.wildcards.map(p => p.id),
        lastUpdated: new Date().getTime()
      });
      alert("Plan synced!");
    } catch (error) { alert("Sync failed."); }
    finally { setIsSaving(false); }
  };

  const PlayerItem = ({ player, currentCol }) => (
    <div className="flex items-center justify-between p-2 bg-gray-800 border border-gray-700 rounded mb-1">
      <span className="text-sm font-medium text-gray-200 truncate pr-2">{player.name}</span>
      <div className="flex gap-1 shrink-0">
        {currentCol !== 'mustHave' && <button onClick={() => moveTo(player, currentCol, 'mustHave')} className="px-2 py-1 text-[10px] font-bold bg-green-900/40 text-green-400 border border-green-700 rounded">M</button>}
        {currentCol !== 'goodToHave' && <button onClick={() => moveTo(player, currentCol, 'goodToHave')} className="px-2 py-1 text-[10px] font-bold bg-blue-900/40 text-blue-400 border border-blue-700 rounded">G</button>}
        {currentCol !== 'wildcards' && <button onClick={() => moveTo(player, currentCol, 'wildcards')} className="px-2 py-1 text-[10px] font-bold bg-purple-900/40 text-purple-400 border border-purple-700 rounded">W</button>}
        {currentCol !== 'pool' && <button onClick={() => moveTo(player, currentCol, 'pool')} className="ml-1 px-2 py-1 text-[10px] font-bold bg-gray-700 text-gray-300 rounded hover:bg-red-600">✕</button>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[90vh] bg-gray-950 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
      
      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden bg-gray-900 p-1 rounded-lg border border-gray-800 shrink-0">
        <button onClick={() => setActiveTab('pool')} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${activeTab === 'pool' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>POOL</button>
        <button onClick={() => setActiveTab('planner')} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${activeTab === 'planner' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>PLANNER</button>
        <button onClick={() => setActiveTab('dream')} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${activeTab === 'dream' ? 'bg-orange-600 text-white' : 'text-gray-500'}`}>DREAM TEAM</button>
      </div>

      {/* Sidebar: Pool */}
      <div className={`${activeTab === 'pool' ? 'flex' : 'hidden'} md:flex w-full md:w-72 bg-gray-900 border border-gray-800 rounded-xl flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="font-bold text-gray-400 text-xs tracking-widest uppercase">Available Pool</h2>
          <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">{columns.pool.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{columns.pool.map(p => <PlayerItem key={p.id} player={p} currentCol="pool" />)}</div>
      </div>

      {/* Center/Main: Planner Board */}
      <div className={`${activeTab === 'planner' ? 'flex' : 'hidden'} md:flex flex-1 flex-col gap-4 overflow-hidden`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-900 p-4 rounded-xl border border-gray-800 gap-4">
          <h2 className="text-lg font-bold text-white leading-none italic uppercase">Squad Planner</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-black/40 ${totalSelected >= 25 ? 'text-red-500' : 'text-green-500'}`}>{totalSelected}/25</span>
            <button onClick={handleClearAll} className="flex-1 sm:flex-none px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 border border-gray-700 rounded hover:bg-gray-800">Clear</button>
            <button onClick={handleSavePlan} disabled={isSaving} className="flex-1 sm:flex-none px-3 py-1.5 text-[10px] uppercase font-bold bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50">
              {isSaving ? "..." : "Save Plan"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto md:overflow-hidden">
          {['mustHave', 'goodToHave', 'wildcards'].map((col) => (
            <div key={col} className="bg-gray-900/40 border border-gray-800 rounded-xl flex flex-col h-[350px] md:h-full">
              <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/60 font-black text-gray-500 text-[10px] uppercase tracking-widest sticky top-0 z-10">
                {col === 'mustHave' ? 'Must Have' : col === 'goodToHave' ? 'Good To Have' : 'Wildcards'} 
                <span className="text-gray-400">{columns[col].length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">{columns[col].map(p => <PlayerItem key={p.id} player={p} currentCol={col} />)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar: Dream Team + BUDGET DRAINERS */}
      <div className={`${activeTab === 'dream' ? 'flex' : 'hidden'} lg:flex w-full md:w-80 bg-slate-900/50 border border-orange-500/20 rounded-xl flex-col overflow-hidden`}>
        <div className="p-4 border-b border-orange-500/20 bg-orange-500/10">
          <h2 className="font-black text-orange-500 text-xs tracking-[0.2em] uppercase">Target Dream Team</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {dreamTeamData.map((item, idx) => (
            <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-lg">
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-tighter mb-1">{item.skill}</div>
              <div className="text-sm font-bold text-white uppercase italic leading-tight">{item.name}</div>
            </div>
          ))}

          {/* New Section: Sabotage Targets */}
          <div className="mt-6 border-t border-red-500/30 pt-4">
            <h2 className="font-black text-red-500 text-[10px] tracking-widest uppercase mb-3 px-1">Budget Drainers (Sabotage)</h2>
            <div className="grid grid-cols-1 gap-1">
              {budgetDrainers.map((name, idx) => (
                <div key={idx} className="px-3 py-2 bg-red-900/20 border border-red-900/40 rounded text-[11px] font-bold text-red-400 uppercase tracking-tight">
                  ☠ {name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[9px] text-blue-400 italic">
            Tip: Nominate "Budget Drainers" early to exhaust opponent points.
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlanningTab;