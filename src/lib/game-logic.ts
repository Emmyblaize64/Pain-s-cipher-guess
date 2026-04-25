import { Difficulty, GameSettings, GameStats } from '../types';

export const DIFFICULTY_SETTINGS: Record<Difficulty, GameSettings> = {
  easy: { maxRange: 100, maxAttempts: 10 },
  medium: { maxRange: 100, maxAttempts: 7 },
  hard: { maxRange: 100, maxAttempts: 5 },
};

export const INITIAL_STATS: GameStats = {
  bestScore: Infinity,
  currentStreak: 0,
  bestStreak: 0,
  totalWins: 0,
  unlockedRanges: [100],
};

export const STORAGE_KEY = 'cipher-guess-stats';

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const loadStats = (): GameStats => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return INITIAL_STATS;
  try {
    const parsed = JSON.parse(saved);
    // Fix bestScore being 'null' if saved as Infinity in JSON
    if (parsed.bestScore === null) parsed.bestScore = Infinity;
    return parsed;
  } catch {
    return INITIAL_STATS;
  }
};

export const calculateNextRange = (wins: number): number => {
  if (wins >= 10) return 1000;
  if (wins >= 5) return 500;
  return 100;
};
