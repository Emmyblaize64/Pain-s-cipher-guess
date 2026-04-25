import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ChevronRight, CornerDownRight } from 'lucide-react';
import { AttemptHistory } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onGuess: (value: number) => void;
  attemptsLeft: number;
  maxAttempts: number;
  isComplete: boolean;
  history: AttemptHistory[];
  maxRange: number;
}

export const GameCard: React.FC<Props> = ({
  onGuess,
  attemptsLeft,
  maxAttempts,
  isComplete,
  history,
  maxRange
}) => {
  const [value, setValue] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || isComplete || attemptsLeft === 0) return;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > maxRange) return;
    
    onGuess(num);
    setValue('');
  };

  const progress = (attemptsLeft / maxAttempts) * 100;

  return (
    <div className="w-full max-w-md space-y-6 sm:space-y-8">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition-opacity duration-500" />
        <div className="relative flex items-center frosted-glass rounded-3xl p-2 gap-2 shadow-2xl border-white/20">
          <input
            ref={inputRef}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isComplete}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={`(1-${maxRange})`}
            className="flex-1 bg-transparent border-none text-4xl sm:text-5xl font-black p-4 outline-none text-white focus:ring-0 placeholder:text-white/5 placeholder:text-3xl sm:placeholder:text-4xl text-center"
          />
          <button
            type="submit"
            disabled={isComplete || !value}
            className="p-5 sm:p-6 bg-white text-slate-950 rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 active:scale-90 disabled:opacity-20 shadow-lg"
          >
            <Send className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>
      </form>

      {/* Attempts & Feedback */}
      <div className="space-y-4 px-2">
        <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-[0.2em] text-slate-400">
          <span>Security Queries Remaining</span>
          <span className={attemptsLeft <= 2 ? "text-red-400 animate-pulse" : "text-cyan-400"}>
             0{attemptsLeft} <span className="text-slate-600">/ {maxAttempts}</span>
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
          {Array.from({ length: maxAttempts }).map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-full flex-1 transition-all duration-500 rounded-sm",
                i < attemptsLeft 
                  ? (attemptsLeft <= 2 ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]")
                  : "bg-white/5"
              )}
            />
          ))}
        </div>
      </div>

      {/* Result Feed */}
      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {history.slice().reverse().map((item, idx) => (
            <motion.div
              key={item.timestamp}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 group transition-colors hover:bg-white/10"
            >
              <div className="text-base sm:text-lg font-mono font-bold text-white w-10 sm:w-12">
                {item.guess}
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex-1 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    item.result === 'correct' ? 'bg-green-400' : 
                    item.result === 'too-high' ? 'bg-purple-400' : 'bg-cyan-400'
                  }`} />
                  <span className={cn(
                    "text-[10px] uppercase font-black tracking-widest",
                    item.result === 'correct' ? 'text-green-400' : 
                    item.result === 'too-high' ? 'text-purple-400' : 'text-cyan-400'
                  )}>
                    {item.result.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  T_{history.length - idx}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {history.length === 0 && (
          <div className="text-center py-10 rounded-2xl border border-white/5 bg-white/[0.02]">
            <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">
              Awaiting Computation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
