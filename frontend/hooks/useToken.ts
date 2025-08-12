import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { AGTToken } from '../lib/blockchains/ethereum/tokens/agt-token';
import { TabAsCoin } from '../lib/blockchains/ethereum/tab-token';
import { useToast } from './use-toast';

export type TokenType = 'AGT' | 'TABZ';

interface UseTokenReturn {
  balance: string;
  feeRate: string;
  feeCollector: string;
  isPaused: boolean;
  transfer: (to: string, amount: string) => Promise<void>;
  setFeeRate: (newRate: number) => Promise<void>;
  setFeeCollector: (address: string) => Promise<void>;
  setFeeExemption: (address: string, isExempt: boolean) => Promise<void>;
  pause: () => Promise<void>;
  unpause: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

export function useToken(tokenType: TokenType): UseTokenReturn {
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<string>('0');
  const [feeRate, setFeeRate] = useState<string>('0');
  const [feeCollector, setFeeCollector] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialiser le token approprié
  const getTokenInstance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (tokenType === 'AGT') {
        return new AGTToken({
          provider,
          address: process.env.NEXT_PUBLIC_AGT_CONTRACT_ADDRESS!
        });
      } else {
        return new TabAsCoin({
          provider,
          address: process.env.NEXT_PUBLIC_TAB_TOKEN_ADDRESS!
        });
      }
    } catch (err) {
      setError('Erreur de connexion au wallet');
      throw err;
    }
  };

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      if (!address) return;
      
      setLoading(true);
      try {
        const token = await getTokenInstance();
        const [balanceValue, feeRateValue, feeCollectorValue] = await Promise.all([
          token.getBalance(address),
          token.getTransferFeeRate(),
          token.getFeeCollector()
        ]);

        setBalance(balanceValue);
        setFeeRate(feeRateValue);
        setFeeCollector(feeCollectorValue);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du token",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tokenType, toast]);

  // Fonctions d'interaction
  const transfer = async (to: string, amount: string) => {
    setLoading(true);
    try {
      const token = await getTokenInstance();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await token.transfer({
        to,
        amount,
        signer
      });

      const receipt = await tx.wait();
      
      // Mettre à jour le solde
      const address = await signer.getAddress();
      const newBalance = await token.getBalance(address);
      setBalance(newBalance);
      setError(null);

      toast({
        title: "Transfert réussi",
        description: `${amount} ${tokenType} ont été transférés à ${to.slice(0, 6)}...${to.slice(-4)}`,
        variant: "default"
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du transfert');
      toast({
        title: "Erreur de transfert",
        description: err.message || "Une erreur est survenue lors du transfert",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setFeeRateValue = async (newRate: number) => {
    setLoading(true);
    try {
      const token = await getTokenInstance();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await token.setTransferFeeRate(signer, newRate);
      await tx.wait();

      const updatedRate = await token.getTransferFeeRate();
      setFeeRate(updatedRate);
      setError(null);

      toast({
        title: "Taux de frais mis à jour",
        description: `Le nouveau taux de frais est de ${newRate}%`,
        variant: "default"
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification du taux');
      toast({
        title: "Erreur",
        description: err.message || "Impossible de modifier le taux de frais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setFeeCollectorAddress = async (newCollector: string) => {
    setLoading(true);
    try {
      const token = await getTokenInstance();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await token.setFeeCollector(signer, newCollector);
      await tx.wait();

      setFeeCollector(newCollector);
      setError(null);

      toast({
        title: "Collecteur de frais mis à jour",
        description: `Nouveau collecteur : ${newCollector.slice(0, 6)}...${newCollector.slice(-4)}`,
        variant: "default"
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification du collecteur');
      toast({
        title: "Erreur",
        description: err.message || "Impossible de modifier le collecteur de frais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setFeeExemptionStatus = async (account: string, isExempt: boolean) => {
    setLoading(true);
    try {
      const token = await getTokenInstance();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await token.setFeeExemption(signer, account, isExempt);
      await tx.wait();
      setError(null);

      toast({
        title: isExempt ? "Exemption ajoutée" : "Exemption retirée",
        description: `${account.slice(0, 6)}...${account.slice(-4)} est maintenant ${isExempt ? 'exempté' : 'non exempté'} des frais`,
        variant: "default"
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de l\'exemption');
      toast({
        title: "Erreur",
        description: err.message || "Impossible de modifier l'exemption",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const pauseToken = async () => {
    setLoading(true);
    try {
      const token = await getTokenInstance();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await token.pause(signer);
      await tx.wait();
      setIsPaused(true);
      setError(null);

      toast({
        title: "Contrat mis en pause",
        description: `Le contrat ${tokenType} a été mis en pause`,
        variant: "default"
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise en pause');
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre le contrat en pause",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const unpauseToken = async () => {
    setLoading(true);
    try {
      const token = await getTokenInstance();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await token.unpause(signer);
      await tx.wait();
      setIsPaused(false);
      setError(null);

      toast({
        title: "Contrat réactivé",
        description: `Le contrat ${tokenType} a été réactivé`,
        variant: "default"
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la reprise');
      toast({
        title: "Erreur",
        description: err.message || "Impossible de réactiver le contrat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    balance,
    feeRate,
    feeCollector,
    isPaused,
    transfer,
    setFeeRate: setFeeRateValue,
    setFeeCollector: setFeeCollectorAddress,
    setFeeExemption: setFeeExemptionStatus,
    pause: pauseToken,
    unpause: unpauseToken,
    error,
    loading
  };
}
