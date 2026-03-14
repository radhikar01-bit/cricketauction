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
  const [activeTab, setActiveTab] = useState('pool'); // 'pool' or 'planner' for mobile

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
      <div className="flex md:hidden bg-gray-900 p-1 rounded-lg border border-gray-800">
        <button 
          onClick={() => setActiveTab('pool')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'pool' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
        >
          PLAYER POOL ({columns.pool.length})
        </button>
        <button 
          onClick={() => setActiveTab('planner')}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'planner' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
        >
          PLANNER ({totalSelected}/25)
        </button>
      </div>

      {/* Sidebar: Pool (Hidden on mobile if planner tab active) */}
      <div className={`${activeTab === 'pool' ? 'flex' : 'hidden'} md:flex w-full md:w-72 bg-gray-900 border border-gray-800 rounded-xl flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="font-bold text-gray-400 text-xs tracking-widest uppercase">Available Pool</h2>
          <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">{columns.pool.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{columns.pool.map(p => <PlayerItem key={p.id} player={p} currentCol="pool" />)}</div>
      </div>

      {/* Main Board (Hidden on mobile if pool tab active) */}
      <div className={`${activeTab === 'planner' ? 'flex' : 'hidden'} md:flex flex-1 flex-col gap-4 overflow-hidden`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-900 p-4 rounded-xl border border-gray-800 gap-4">
          <h2 className="text-lg font-bold text-white leading-none">Squad Planner</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-black/40 ${totalSelected >= 25 ? 'text-red-500' : 'text-green-500'}`}>{totalSelected}/25</span>
            <button onClick={handleClearAll} className="flex-1 sm:flex-none px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 border border-gray-700 rounded hover:bg-gray-800">Clear</button>
            <button onClick={handleSavePlan} disabled={isSaving} className="flex-1 sm:flex-none px-3 py-1.5 text-[10px] uppercase font-bold bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50">
              {isSaving ? "..." : "Save"}
            </button>
          </div>
        </div>

        {/* Categories Grid - 1 Col on Mobile, 3 Col on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto md:overflow-hidden pb-20 md:pb-0">
          {['mustHave', 'goodToHave', 'wildcards'].map((col) => (
            <div key={col} className="bg-gray-900/40 border border-gray-800 rounded-xl flex flex-col h-[300px] md:h-full">
              <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/60 font-black text-gray-500 text-[10px] uppercase tracking-widest sticky top-0 z-10">
                {col} <span className="text-gray-400">{columns[col].length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">{columns[col].map(p => <PlayerItem key={p.id} player={p} currentCol={col} />)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanningTab;