export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameSettings {
  maxRange: number;
  maxAttempts: number;
}

export interface GameStats {
  bestScore: number; // Lowest attempts to win
  currentStreak: number;
  bestStreak: number;
  totalWins: number;
  unlockedRanges: number[]; // e.g. [100, 500, 1000]
}

export interface RoundInfo {
  attempts: number;
  history: AttemptHistory[];
  startTime: number;
  isComplete: boolean;
  won: boolean;
  difficulty: Difficulty;
}

export interface AttemptHistory {
  guess: number;
  result: 'too-high' | 'too-low' | 'correct';
  timestamp: number;
}

export interface EncryptedValue {
  cipher: string;
  iv: string;
}
