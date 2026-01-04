import { Rarity } from './types';

// The user provided weights: 50, 35, 25, 8.
// Total weight = 118. Probabilities will be calculated relative to 118.
export const PROBABILITY_WEIGHTS = {
  [Rarity.BASIC]: 50,
  [Rarity.RARE]: 35,
  [Rarity.EPIC]: 25,
  [Rarity.HIDDEN]: 8,
};

export const RARITY_CONFIG = {
  [Rarity.BASIC]: {
    color: 'text-gray-400',
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-800',
    shadow: 'shadow-gray-500/20',
    label: 'Basic',
  },
  [Rarity.RARE]: {
    color: 'text-blue-400',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-900/40',
    shadow: 'shadow-blue-500/30',
    label: 'Rare',
  },
  [Rarity.EPIC]: {
    color: 'text-purple-400',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-900/40',
    shadow: 'shadow-purple-500/40',
    label: 'Epic',
  },
  [Rarity.HIDDEN]: {
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-900/40',
    shadow: 'shadow-yellow-500/50',
    label: 'Hidden',
  },
};

export const ITEM_NAMES: Record<Rarity, string[]> = {
  [Rarity.BASIC]: ['Rusty Gear', 'Common Pebble', 'Old Ticket', 'Wooden Charm', 'Empty Bottle'],
  [Rarity.RARE]: ['Silver Ring', 'Polished Gem', 'Ancient Coin', 'Silk Scarf', 'Crystal Vial'],
  [Rarity.EPIC]: ['Golden Chalice', 'Dragon Scale', 'Phoenix Feather', 'Emerald Tablet', 'Void Essence'],
  [Rarity.HIDDEN]: ['Cosmic Key', 'Philosopher\'s Stone', 'Time Fragment', 'Eternal Flame', 'Star Heart'],
};