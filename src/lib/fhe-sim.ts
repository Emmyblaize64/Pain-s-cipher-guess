import { EncryptedValue } from '../types';

/**
 * FHE SIMULATION LAYER
 * This module simulates encrypted computation.
 * In a real Fhenix app, these would be calls to the Fhenix network or its local SDK.
 */

// A simple deterministic obfuscation for simulation
// In reality, this would use public/private key pairs
const SIM_KEY = 'fhenix-sim-key-2024';

export const encrypt = (value: number): EncryptedValue => {
  // Simulate an 'encrypted' packet
  // We use btoa for visual 'noise' in the simulation
  const timestamp = Date.now().toString();
  const raw = `${value}:${timestamp}:${SIM_KEY}`;
  const cipher = btoa(raw);
  
  return {
    cipher,
    iv: Math.random().toString(36).substring(7)
  };
};

export const decryptInternal = (encrypted: EncryptedValue): number => {
  try {
    const raw = atob(encrypted.cipher);
    const [value] = raw.split(':');
    return parseInt(value, 10);
  } catch (e) {
    console.error('Decryption failed', e);
    return -1;
  }
};

/**
 * Compares two 'encrypted' values without leaking their underlying plaintext
 * directly to the caller beyond the specific result.
 */
export const compareEncrypted = (
  encryptedSecret: EncryptedValue,
  plaintextGuess: number
): 'too-high' | 'too-low' | 'correct' => {
  const secret = decryptInternal(encryptedSecret);
  
  // Simulated 'Encrypted Computation'
  // In FHE, this would be: secret.gt(guess) -> returns a boolean cipher
  if (plaintextGuess === secret) return 'correct';
  if (plaintextGuess > secret) return 'too-high';
  return 'too-low';
};
