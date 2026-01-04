export enum Rarity {
  BASIC = '基础款',
  RARE = '稀有款',
  EPIC = '典藏款',
  HIDDEN = '隐藏款'
}

export interface Item {
  id: string;
  rarity: Rarity;
  name: string;
  image: string;
  obtainedAt: number;
}

export interface GameState {
  isConfigured: boolean;
  totalSpinsAllowed: number;
  spinsUsed: number;
  inventory: Item[];
}

export const STORAGE_KEY = 'gacha_app_state_v1';