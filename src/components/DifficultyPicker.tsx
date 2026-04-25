import React from 'react';
import { motion } from 'motion/react';
import { Difficulty, GameSettings } from '../types';
import { DIFFICULTY_SETTINGS } from '../lib/game-logic';
import { cn } from '../lib/utils';

interface Props {
  currentDifficulty: Difficulty;
  currentRange: number;
  unlockedRanges: number[];
  onChangeDifficulty: (d: Difficulty) => void;
  onChangeRange: (r: number) => void;
  disabled?: boolean;
}

export const DifficultyPicker: React.FC<Props> = ({
  currentDifficulty,
  currentRange,
  unlockedRanges,
  onChangeDifficulty,
  onChangeRange,
  disabled
}) => {
  return (
    <div className="space-y-8 w-full max-w-md">
      <div className="space-y-4">
        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center block opacity-70">
          Simulation Security Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              disabled={disabled}
              onClick={() => onChangeDifficulty(d)}
              className={cn(
                "py-4 px-2 rounded-2xl border font-bold text-xs uppercase tracking-tight transition-all active:scale-95 disabled:opacity-30 min-h-[56px]",
                currentDifficulty === d
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                  : "bg-white/5 border-white/5 text-slate-500"
              )}
            >
              {d}
              <div className="text-[8px] opacity-60 font-normal mt-0.5">
                {DIFFICULTY_SETTINGS[d].maxAttempts} Tries
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center block opacity-70">
          Cipher Range
        </label>
        <div className="flex justify-center gap-3">
          {[100, 500, 1000].map((r) => {
            const isUnlocked = unlockedRanges.includes(r);
            return (
              <button
                key={r}
                disabled={disabled || !isUnlocked}
                onClick={() => onChangeRange(r)}
                className={cn(
                  "flex-1 py-4 min-h-[56px] rounded-2xl border font-mono font-bold text-sm transition-all relative overflow-hidden active:scale-95",
                  currentRange === r
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    : "bg-white/5 border-white/5 text-slate-500"
                )}
              >
                1-{r}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px]">
                    <span className="text-[8px] uppercase tracking-tighter text-white/40">Locked</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
