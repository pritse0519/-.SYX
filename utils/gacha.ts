import { PROBABILITY_WEIGHTS, ITEM_NAMES } from '../constants';
import { Item, Rarity } from '../types';

export const drawItem = (): Item => {
  const totalWeight = Object.values(PROBABILITY_WEIGHTS).reduce((acc, val) => acc + val, 0);
  let random = Math.random() * totalWeight;

  let selectedRarity = Rarity.BASIC;

  // Iterate through weights to find where the random number falls
  for (const [rarityStr, weight] of Object.entries(PROBABILITY_WEIGHTS)) {
    const rarity = rarityStr as Rarity;
    if (random < weight) {
      selectedRarity = rarity;
      break;
    }
    random -= weight;
  }

  const possibleNames = ITEM_NAMES[selectedRarity];
  const name = possibleNames[Math.floor(Math.random() * possibleNames.length)];
  
  // Use Picsum for random images, using a seed based on name to keep it consistent-ish
  const seed = name.replace(/\s/g, '') + Date.now();
  const image = `https://picsum.photos/seed/${seed}/200/200`;

  return {
    id: crypto.randomUUID(),
    rarity: selectedRarity,
    name,
    image,
    obtainedAt: Date.now(),
  };
};