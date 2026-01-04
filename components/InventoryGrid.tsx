import React from 'react';
import { Item, Rarity } from '../types';
import { RARITY_CONFIG } from '../constants';
import { motion } from 'framer-motion';

interface InventoryGridProps {
  items: Item[];
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({ items }) => {
  // Sort items by rarity value (custom order) then by date
  const rarityOrder = {
    [Rarity.HIDDEN]: 0,
    [Rarity.EPIC]: 1,
    [Rarity.RARE]: 2,
    [Rarity.BASIC]: 3,
  };

  const sortedItems = [...items].sort((a, b) => {
    if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }
    return b.obtainedAt - a.obtainedAt; // Newest first within rarity
  });

  if (items.length === 0) {
    return (
      <div className="text-center text-slate-500 py-10 italic">
        Your inventory is empty. Start drawing!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {sortedItems.map((item) => {
        const style = RARITY_CONFIG[item.rarity];
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative group overflow-hidden rounded-xl border-2 ${style.borderColor} ${style.bgColor} ${style.shadow} transition-all duration-300 hover:scale-105`}
          >
            <div className="aspect-square w-full overflow-hidden bg-slate-900">
               <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
            </div>
            <div className="p-2 bg-slate-900/90 absolute bottom-0 w-full backdrop-blur-sm">
              <p className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>
                {item.rarity}
              </p>
              <p className="text-sm font-medium text-white truncate">
                {item.name}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};