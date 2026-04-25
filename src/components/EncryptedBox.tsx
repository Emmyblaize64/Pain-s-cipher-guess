import React from 'react';
import { motion } from 'motion/react';
import { Lock, Cpu, ShieldAlert } from 'lucide-react';
import { EncryptedValue } from '../types';

interface Props {
  encryptedValue: EncryptedValue | null;
  isProcessing: boolean;
}

export const EncryptedBox: React.FC<Props> = ({ encryptedValue, isProcessing }) => {
  return (
    <div className="relative w-full max-w-sm aspect-[16/10] frosted-glass rounded-3xl p-6 sm:p-8 overflow-hidden group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-full mesh-gradient-1 pointer-events-none" />
      
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Target Cipher</h3>
            <p className="text-[8px] font-mono text-slate-500">IV: {encryptedValue?.iv || '0x00...00'}</p>
          </div>
          <motion.div
            animate={isProcessing ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`p-2.5 rounded-xl ${isProcessing ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-600'}`}
          >
            {isProcessing ? <Cpu className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-center py-4">
          <div className="w-full font-mono text-center space-y-3">
            <motion.div 
              key={encryptedValue?.cipher}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-slate-300 break-all line-clamp-2 px-2 select-none opacity-40 group-hover:opacity-100 transition-opacity"
            >
              {encryptedValue?.cipher || 'W0VOQ1JZUFRFRCBEQVRBXQ=='}
            </motion.div>
            {isProcessing && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto max-w-[220px] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${encryptedValue ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">
              {encryptedValue ? 'Network Sync' : 'Offline'}
            </span>
          </div>
          <div className="text-[9px] uppercase font-bold tracking-tighter text-slate-600">
            Fhenix-Sim_v1
          </div>
        </div>
      </div>
    </div>
  );
};
