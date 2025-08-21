// Déclarations de types globaux pour le projet

declare module 'dotenv';
declare module 'zod';
declare module 'next-auth';

// Déclaration pour window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export {};
