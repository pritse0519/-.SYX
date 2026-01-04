import React, { useEffect } from 'react';
import { Item, Rarity } from '../types';
import { RARITY_CONFIG } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ResultModalProps {
  item: Item | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ item, onClose }) => {
  
  useEffect(() => {
    if (item) {
      const isSpecial = item.rarity === Rarity.HIDDEN || item.rarity === Rarity.EPIC;
      
      if (isSpecial) {
        // Trigger confetti for rare items
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#bb0000', '#ffffff', '#ffd700']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#bb0000', '#ffffff', '#ffd700']
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }
    }
  }, [item]);

  if (!item) return null;

  const style = RARITY_CONFIG[item.rarity];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100, rotateX: 45 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 100 }}
          transition={{ type: "spring", damping: 15 }}
          className={`relative w-full max-w-sm rounded-2xl border-4 ${style.borderColor} bg-slate-900 p-1 shadow-2xl ${style.shadow}`}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Light Burst Background Effect */}
          <div className={`absolute inset-0 rounded-xl opacity-20 blur-xl ${style.bgColor}`} />

          <div className="relative z-10 flex flex-col items-center p-8 text-center bg-slate-900/80 rounded-xl">
             <div className="mb-2">
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-[0.2em] border rounded-full ${style.color} ${style.borderColor}`}>
                    {item.rarity}
                </span>
             </div>
            
            <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`w-48 h-48 mb-6 rounded-lg overflow-hidden border-2 ${style.borderColor} shadow-lg`}
            >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
            <p className="text-slate-400 text-sm mb-6">You have added this item to your collection.</p>

            <button
              onClick={onClose}
              className={`w-full py-3 text-sm font-bold uppercase tracking-wider text-black transition-transform active:scale-95 rounded-lg bg-gradient-to-r from-white to-gray-300 hover:to-white`}
            >
              Collect
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};