import React from 'react';
import { Trophy, Flame, Target } from 'lucide-react';
import { GameStats } from '../types';

interface Props {
  stats: GameStats;
}

export const StatsBar: React.FC<Props> = ({ stats }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-4 px-5 sm:px-8 frosted-glass rounded-3xl w-full sm:w-fit mx-auto mb-6 sm:mb-10 shadow-lg">
      <StatItem
        icon={<Trophy className="w-4 h-4 text-cyan-400" />}
        label="Best"
        value={stats.bestScore === Infinity ? '—' : stats.bestScore}
      />
      <div className="hidden sm:block w-px h-8 bg-white/10" />
      <StatItem
        icon={<Flame className="w-4 h-4 text-purple-400" />}
        label="Streak"
        value={stats.currentStreak}
      />
      <div className="hidden sm:block w-px h-8 bg-white/10" />
      <StatItem
        icon={<Target className="w-4 h-4 text-slate-400" />}
        label="Wins"
        value={stats.totalWins}
      />
    </div>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none justify-center">
    <div className="p-1.5 sm:p-2 rounded-lg bg-white/5">
      {icon}
    </div>
    <div>
      <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500 leading-none mb-1">
        {label}
      </p>
      <p className="text-base sm:text-lg font-mono font-bold text-white leading-none">
        {value}
      </p>
    </div>
  </div>
);
