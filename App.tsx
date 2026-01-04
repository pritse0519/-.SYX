import React, { useState, useEffect } from 'react';
import { GameState, STORAGE_KEY } from './types';
import { drawItem } from './utils/gacha';
import { InventoryGrid } from './components/InventoryGrid';
import { ResultModal } from './components/ResultModal';
import { motion } from 'framer-motion';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [inputSpins, setInputSpins] = useState<string>('10');
  const [currentResult, setCurrentResult] = useState<ReturnType<typeof drawItem> | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGameState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse game state", e);
        // If corrupt, reset (or handle gracefully)
      }
    } else {
      // Initial empty state
      setGameState({
        isConfigured: false,
        totalSpinsAllowed: 0,
        spinsUsed: 0,
        inventory: []
      });
    }
  }, []);

  const saveState = (newState: GameState) => {
    setGameState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const spins = parseInt(inputSpins, 10);
    if (isNaN(spins) || spins <= 0) {
      alert("Please enter a valid number of spins (minimum 1).");
      return;
    }
    
    // Safety cap just in case
    if (spins > 1000) {
        if(!confirm("Are you sure you want more than 1000 spins? It might take a while!")) return;
    }

    if (gameState) {
      saveState({
        ...gameState,
        isConfigured: true,
        totalSpinsAllowed: spins,
      });
    }
  };

  const handleDraw = () => {
    if (!gameState || gameState.spinsUsed >= gameState.totalSpinsAllowed || isSpinning) return;

    setIsSpinning(true);

    // Artificial delay for suspense
    setTimeout(() => {
        const newItem = drawItem();
        const newState = {
          ...gameState,
          spinsUsed: gameState.spinsUsed + 1,
          inventory: [newItem, ...gameState.inventory],
        };
        
        saveState(newState);
        setCurrentResult(newItem);
        setIsSpinning(false);
    }, 800);
  };

  const handleReset = () => {
      // Dev only helper or if we want to allow reset for testing
      if(confirm("This will wipe all progress. Are you sure?")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }
  }

  // Loading state
  if (!gameState) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  const spinsLeft = gameState.totalSpinsAllowed - gameState.spinsUsed;

  // 1. SETUP SCREEN
  if (!gameState.isConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
         {/* Background Decoration */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl z-10"
        >
          <div className="text-center mb-8">
             <div className="inline-block p-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4 shadow-lg shadow-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="M2 12v3a5 5 0 0 0 5 5 2.5 2.5 0 0 1 5 0 5 5 0 0 0 5-5v-3"/></svg>
             </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Gacha System Setup
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Configure your luck. You can only set the number of spins once.
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-6">
            <div>
              <label htmlFor="spins" className="block text-sm font-medium text-slate-300 mb-2">
                Number of Draws
              </label>
              <input
                id="spins"
                type="number"
                min="1"
                max="9999"
                value={inputSpins}
                onChange={(e) => setInputSpins(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white text-lg rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block p-3 transition-colors"
                placeholder="Enter amount..."
                required
              />
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                 <p className="text-yellow-500 text-xs flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Warning: This cannot be changed later.
                 </p>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-800 font-bold rounded-lg text-lg px-5 py-4 text-center shadow-lg transition-all transform hover:scale-[1.02]"
            >
              Start System
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 2. GAME SCREEN
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative">
      <ResultModal item={currentResult} onClose={() => setCurrentResult(null)} />

      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="font-bold text-white text-xs">G</span>
            </div>
            <h1 className="text-xl font-bold text-white hidden sm:block">Lucky Gacha</h1>
          </div>
          
          <div className="flex items-center space-x-6">
             <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Spins Left</span>
                <span className={`text-xl font-mono font-bold ${spinsLeft === 0 ? 'text-red-500' : 'text-green-400'}`}>
                    {spinsLeft} <span className="text-slate-500 text-sm">/ {gameState.totalSpinsAllowed}</span>
                </span>
             </div>
             {/* Simple reset for demo purposes, obscurely placed */}
             <button onClick={handleReset} className="text-slate-700 hover:text-red-500 text-xs" title="Reset Data">Reset</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 flex flex-col md:flex-row gap-8">
        
        {/* Left: The Gacha Machine */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-start pt-10">
            <div className="sticky top-24 w-full flex flex-col items-center">
                
                {/* The Box */}
                <motion.div 
                    animate={isSpinning ? { 
                        scale: [1, 1.05, 0.95, 1.05, 1],
                        rotate: [0, -2, 2, -2, 0],
                        y: [0, -10, 0]
                    } : {}}
                    transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
                    className="relative w-64 h-64 mb-8 cursor-pointer group"
                    onClick={() => spinsLeft > 0 && !isSpinning && handleDraw()}
                >
                    {/* Glow behind */}
                    <div className="absolute inset-0 bg-purple-500 rounded-3xl blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />
                    
                    {/* Box Image / Representation */}
                    <div className={`w-full h-full bg-slate-800 rounded-3xl border-4 ${spinsLeft > 0 ? 'border-purple-500/50 hover:border-purple-400' : 'border-slate-700 grayscale'} shadow-2xl flex items-center justify-center relative overflow-hidden transition-colors`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-24 h-24 ${spinsLeft > 0 ? 'text-purple-400' : 'text-slate-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    </div>
                </motion.div>

                {/* Controls */}
                <button
                    onClick={handleDraw}
                    disabled={spinsLeft <= 0 || isSpinning}
                    className={`
                        w-full max-w-xs py-4 rounded-xl font-bold text-lg uppercase tracking-widest shadow-lg transition-all transform active:scale-95
                        ${spinsLeft > 0 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:brightness-110 shadow-purple-900/50' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                    `}
                >
                    {isSpinning ? 'Opening...' : spinsLeft > 0 ? 'Open Box' : 'Out of Spins'}
                </button>
                
                <div className="mt-8 bg-slate-900/80 p-4 rounded-lg border border-slate-800 w-full max-w-xs">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Drop Rates</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Basic</span>
                            <span className="text-gray-500">~42% (50 wt)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-blue-400">Rare</span>
                            <span className="text-gray-500">~30% (35 wt)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-purple-400">Epic</span>
                            <span className="text-gray-500">~21% (25 wt)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-yellow-400">Hidden</span>
                            <span className="text-gray-500">~7% (8 wt)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Right: Inventory */}
        <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Collection</h2>
                <div className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">
                    {gameState.inventory.length} Items Collected
                </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 min-h-[500px]">
                <InventoryGrid items={gameState.inventory} />
            </div>
        </div>

      </main>
    </div>
  );
}