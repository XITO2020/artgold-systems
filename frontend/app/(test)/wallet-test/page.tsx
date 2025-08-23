'use client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { useEffect, useMemo, useState } from 'react';

export default function WalletTestPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isInstalled, setIsInstalled] = useState(false);

  const phantomWallet = useMemo(
    () => new PhantomWalletAdapter(),
    []
  );

  useEffect(() => {
    // Vérifier si Phantom est installé
    if (typeof window !== 'undefined' && 'phantom' in window) {
      setIsInstalled(true);
    }
  }, []);

  const handleConnect = async () => {
    try {
      await phantomWallet.connect();
      console.log('Connected to Phantom wallet:', phantomWallet.publicKey?.toString());
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await phantomWallet.disconnect();
      console.log('Disconnected from Phantom wallet');
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Test Phantom Wallet</h1>
      
      {!isInstalled ? (
        <div className="p-4 mb-4 text-yellow-700 bg-yellow-100 rounded">
          Phantom Wallet n'est pas installé. Veuillez l'installer depuis{' '}
          <a 
            href="https://phantom.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            le site officiel
          </a>.
        </div>
      ) : !phantomWallet.connected ? (
        <button
          onClick={handleConnect}
          className="px-4 py-2 font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Se connecter avec Phantom
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="font-medium">Connecté avec Phantom</p>
            <p className="text-sm text-gray-600 break-all">
              Adresse: {phantomWallet.publicKey?.toString()}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
