import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Lock, Terminal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden frosted-glass border-white/20 rounded-[40px] shadow-2xl p-8 md:p-12 mb-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Cipher Protocol</h2>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-mono text-[10px] uppercase font-black tracking-widest">
                  <Terminal className="w-4 h-4" />
                  <span>Execution Pipeline</span>
                </div>
                <div className="grid grid-cols-4 gap-2 items-center">
                  <Step icon={<Cpu />} label="Plaintext" color="bg-cyan-500/10 text-cyan-400 text-center" />
                  <div className="h-px bg-white/10" />
                  <Step icon={<Lock />} label="Ciphertext" color="bg-purple-500/10 text-purple-400" />
                  <Step icon={<ShieldCheck />} label="Verdict" color="bg-emerald-500/10 text-emerald-400" />
                </div>
              </section>

              <div className="space-y-6 text-slate-400 text-sm leading-relaxed font-medium">
                <p>
                  <strong className="text-white">Fully Homomorphic Encryption (FHE)</strong> enables the network to perform mathematical calculations on your data while it remains <span className="text-cyan-400">encrypted</span>.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-cyan-400 font-black text-xs">01.</span>
                    <p className="text-xs">Your guess is transformed into a secure ciphertext packet locally.</p>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-purple-400 font-black text-xs">02.</span>
                    <p className="text-xs">The logic engine compares the ciphertexts blindly, never seeing actual values.</p>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-emerald-400 font-black text-xs">03.</span>
                    <p className="text-xs">Only the relational Boolean (Greater/Less) is decrypted and revealed.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-5 bg-white hover:bg-cyan-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl active:scale-95"
              >
                ACKNOWLEDGE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Step = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`p-2 rounded-lg ${color}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </div>
    <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">{label}</span>
  </div>
);
