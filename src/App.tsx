/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ShieldQuestion, 
  RefreshCcw, 
  Share2, 
  Zap, 
  Clock, 
  Lock,
  ChevronLeft
} from 'lucide-react';
import { 
  Difficulty, 
  RoundInfo, 
  GameStats, 
  EncryptedValue 
} from './types';
import { 
  DIFFICULTY_SETTINGS, 
  loadStats, 
  saveStats, 
  calculateNextRange 
} from './lib/game-logic';
import { encrypt, compareEncrypted, decryptInternal } from './lib/fhe-sim';
import { StatsBar } from './components/StatsBar';
import { DifficultyPicker } from './components/DifficultyPicker';
import { EncryptedBox } from './components/EncryptedBox';
import { GameCard } from './components/GameCard';
import { HowItWorksModal } from './components/HowItWorksModal';

export default function App() {
  // --- Game State ---
  const [stats, setStats] = React.useState<GameStats>(loadStats());
  const [difficulty, setDifficulty] = React.useState<Difficulty>('easy');
  const [range, setRange] = React.useState(100);
  const [secret, setSecret] = React.useState<EncryptedValue | null>(null);
  const [round, setRound] = React.useState<RoundInfo | null>(null);
  
  // --- UI State ---
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showHowItWorks, setShowHowItWorks] = React.useState(false);
  const [gameState, setGameState] = React.useState<'menu' | 'playing' | 'end'>('menu');
  const [timer, setTimer] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Initialize Game
  const startRound = (mode: 'normal' | 'daily' = 'normal') => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    let secretNum: number;

    if (mode === 'daily') {
      // Seed based on YYYYMMDD
      const now = new Date();
      const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      // Simple LCG or similar for deterministic daily number
      secretNum = (seed * 1103515245 + 12345) % range;
      if (secretNum === 0) secretNum = 1;
    } else {
      secretNum = Math.floor(Math.random() * range) + 1;
    }

    setSecret(encrypt(secretNum));
    setRound({
      attempts: settings.maxAttempts,
      history: [],
      startTime: Date.now(),
      isComplete: false,
      won: false,
      difficulty,
    });
    setGameState('playing');
    setTimer(0);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const handleGuess = (guess: number) => {
    if (!secret || !round || round.isComplete) return;

    setIsProcessing(true);
    
    // Simulate FHE computation time
    setTimeout(() => {
      const result = compareEncrypted(secret, guess);
      const newAttempts = round.attempts - 1;
      const isWin = result === 'correct';
      const isLose = newAttempts === 0 && !isWin;

      const newRound = {
        ...round,
        attempts: newAttempts,
        history: [...round.history, { guess, result, timestamp: Date.now() }],
        isComplete: isWin || isLose,
        won: isWin,
      };

      setRound(newRound);
      setIsProcessing(false);

      if (isWin) {
        handleWin(newRound);
      } else if (isLose) {
        handleLose();
      }
    }, 600);
  };

  const handleWin = (finishedRound: RoundInfo) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f3ff', '#ffffff', '#1e293b']
    });

    const attemptsUsed = DIFFICULTY_SETTINGS[finishedRound.difficulty].maxAttempts - finishedRound.attempts;
    const newStats = { ...stats };
    
    newStats.totalWins += 1;
    newStats.currentStreak += 1;
    if (newStats.currentStreak > newStats.bestStreak) newStats.bestStreak = newStats.currentStreak;
    if (attemptsUsed < newStats.bestScore) newStats.bestScore = attemptsUsed;
    
    // Check unlocks
    const nextRangeLimit = calculateNextRange(newStats.totalWins);
    if (!newStats.unlockedRanges.includes(nextRangeLimit)) {
      newStats.unlockedRanges.push(nextRangeLimit);
    }

    setStats(newStats);
    saveStats(newStats);
    setGameState('end');
  };

  const handleLose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newStats = { ...stats, currentStreak: 0 };
    setStats(newStats);
    saveStats(newStats);
    setGameState('end');
  };

  const shareResult = () => {
    if (!round) return;
    const text = `I solved Cipher Guess in ${round.history.length} tries! 🔐 Range: 1-${range} | Level: ${difficulty}\n\nCan you beat the encryption?`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen selection:bg-cyan-500/30">
      <div className="scanline" />
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[60%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-16">
        {/* Header */}
        <header className="flex flex-col items-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 frosted-glass rounded-full mb-6 border-white/20"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-400">Network Secure</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4 italic text-center"
          >
            Cipher<span className="bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent">Guess</span>
          </motion.h1>
          <p className="text-slate-400 font-bold text-center max-w-sm uppercase text-[9px] md:text-[10px] tracking-[0.3em] opacity-60">
            Privacy-Preserved Number Guessing via FHE
          </p>
        </header>

        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center space-y-8"
            >
              <StatsBar stats={stats} />
              
              <div className="w-full flex flex-col items-center space-y-10 frosted-glass p-6 md:p-12 rounded-[40px] shadow-2xl border-white/20">
                <DifficultyPicker
                  currentDifficulty={difficulty}
                  currentRange={range}
                  unlockedRanges={stats.unlockedRanges}
                  onChangeDifficulty={setDifficulty}
                  onChangeRange={setRange}
                />

                <div className="flex flex-col w-full max-w-md gap-4">
                  <button
                    onClick={() => startRound()}
                    className="w-full py-6 bg-white hover:bg-cyan-400 text-slate-950 font-black text-xl rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-xl active:scale-95"
                  >
                    START ROUND
                    <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                  </button>
                  <button
                    onClick={() => startRound('daily')}
                    className="w-full py-4 frosted-glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border-white/10 active:scale-95"
                  >
                    DAILY CHALLENGE
                    <Clock className="w-4 h-4 text-purple-400" />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-500 hover:text-cyan-400 transition-colors py-4 px-8 frosted-glass rounded-full border-white/5 shadow-lg active:scale-95"
              >
                <ShieldQuestion className="w-4 h-4" />
                How it works
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-full flex justify-between items-center mb-10 frosted-glass p-5 rounded-2xl border-white/10 max-w-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="font-mono text-white text-lg font-bold tracking-tighter w-16">{formatTime(timer)}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Range: <span className="text-white">1-{range}</span>
                </div>
                <button
                  onClick={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setGameState('menu');
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                >
                  Terminate
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start w-full">
                <div className="flex flex-col items-center lg:items-end space-y-8 order-2 lg:order-1">
                  <EncryptedBox encryptedValue={secret} isProcessing={isProcessing} />
                  <div className="p-6 frosted-glass rounded-3xl max-w-sm border-white/5 shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                        Protocol Status
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">
                      "Computational integrity verified. All comparisons are executed as ciphertext transformations. Privacy score: 100%."
                    </p>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-start order-1 lg:order-2">
                  <GameCard
                    onGuess={handleGuess}
                    attemptsLeft={round?.attempts || 0}
                    maxAttempts={DIFFICULTY_SETTINGS[difficulty].maxAttempts}
                    isComplete={round?.isComplete || false}
                    history={round?.history || []}
                    maxRange={range}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'end' && round && (
            <motion.div
              key="end"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center max-w-lg mx-auto py-10 md:py-20 text-center"
            >
              <div className="mb-10 relative">
                <div className="absolute -inset-10 bg-cyan-500/20 blur-[80px] rounded-full animate-pulse" />
                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="relative p-10 frosted-glass rounded-[40px] border-white/20 shadow-2xl"
                >
                  {round.won ? (
                     <Lock className="w-20 h-20 text-cyan-400" />
                  ) : (
                    <ShieldQuestion className="w-20 h-20 text-red-500" />
                  )}
                </motion.div>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">
                {round.won ? 'CIPHER CRACKED' : 'ACCESS DENIED'}
              </h2>
              <p className="text-slate-400 uppercase text-[10px] font-bold tracking-[0.4em] mb-12 opacity-60">
                Session Duration: {formatTime(timer)} | Level: {difficulty}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mb-10">
                <div className="p-8 frosted-glass rounded-3xl text-center border-white/10 shadow-xl">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Secret</p>
                  <p className="text-4xl font-mono font-bold text-cyan-400 leading-none">{decryptInternal(secret!)}</p>
                </div>
                <div className="p-8 frosted-glass rounded-3xl text-center border-white/10 shadow-xl">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Streak</p>
                  <p className="text-4xl font-mono font-bold text-white leading-none">{stats.currentStreak}</p>
                </div>
              </div>

              <div className="flex flex-col w-full gap-4">
                <button
                  onClick={() => setGameState('menu')}
                  className="w-full py-6 bg-white hover:bg-cyan-400 text-slate-950 font-black text-xl rounded-2xl transition-all shadow-xl active:scale-95"
                >
                  READY FOR NEXT TASK
                </button>
                <button
                  onClick={shareResult}
                  className="w-full py-4 frosted-glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border-white/10 active:scale-95"
                >
                  BROADCAST RECORD
                  <Share2 className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      
      {/* Footer Branding */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-30">
        <span className="text-[8px] uppercase font-bold tracking-widest text-slate-600">Secure Computation by Fhenix</span>
        <div className="w-1 h-1 rounded-full bg-slate-800" />
        <span className="text-[8px] uppercase font-bold tracking-widest text-slate-600">Sim v1.0.4</span>
      </footer>
    </div>
  );
}
