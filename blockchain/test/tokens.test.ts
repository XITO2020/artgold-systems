import { expect } from 'chai';
import { ethers } from 'ethers';
import { AGTToken } from '../lib/ethereum/agt-token';
import { TabAsCoin } from '../lib/ethereum/tab-token';

describe('Tests des tokens', () => {
  // Variables pour les tests
  let provider: ethers.BrowserProvider;
  let signer: ethers.Signer;
  let agtToken: AGTToken;
  let tabToken: TabAsCoin;
  let adminAddress: string;
  let userAddress: string;
  let feeCollectorAddress: string;

  before(async () => {
    // Initialisation
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    adminAddress = await signer.getAddress();
    
    // Créer une nouvelle adresse pour le user et le fee collector
    const randomWallet1 = ethers.Wallet.createRandom();
    const randomWallet2 = ethers.Wallet.createRandom();
    userAddress = randomWallet1.address;
    feeCollectorAddress = randomWallet2.address;

    // Initialiser les contrats
    agtToken = new AGTToken({
      provider,
      address: process.env.NEXT_PUBLIC_AGT_CONTRACT_ADDRESS!
    });

    tabToken = new TabAsCoin({
      provider,
      address: process.env.NEXT_PUBLIC_TAB_TOKEN_ADDRESS!
    });
  });

  describe('Test des frais de transfert AGT (0.25%)', () => {
    it('devrait configurer le taux de frais et le collecteur', async () => {
      // Configurer les frais
      await agtToken.setTransferFeeRate(signer, 0.25);
      await agtToken.setFeeCollector(signer, feeCollectorAddress);

      // Vérifier la configuration
      const feeRate = await agtToken.getTransferFeeRate();
      const collector = await agtToken.getFeeCollector();

      expect(feeRate).to.equal('0.25');
      expect(collector).to.equal(feeCollectorAddress);
    });

    it('devrait transférer avec les frais corrects', async () => {
      const amount = '100'; // 100 AGT
      
      // Solde initial
      const initialUserBalance = await agtToken.getBalance(userAddress);
      const initialCollectorBalance = await agtToken.getBalance(feeCollectorAddress);

      // Faire le transfert
      await agtToken.transfer({
        to: userAddress,
        amount: amount,
        signer
      });

      // Vérifier les soldes après transfert
      const finalUserBalance = await agtToken.getBalance(userAddress);
      const finalCollectorBalance = await agtToken.getBalance(feeCollectorAddress);

      // Le user devrait recevoir 99.75 AGT (100 - 0.25%)
      expect(Number(finalUserBalance) - Number(initialUserBalance)).to.equal(99.75);
      // Le collecteur devrait recevoir 0.25 AGT
      expect(Number(finalCollectorBalance) - Number(initialCollectorBalance)).to.equal(0.25);
    });
  });

  describe('Test des frais de transfert TABZ (0.5%)', () => {
    it('devrait configurer le taux de frais et le collecteur', async () => {
      // Configurer les frais
      await tabToken.setTransferFeeRate(signer, 0.5);
      await tabToken.setFeeCollector(signer, feeCollectorAddress);

      // Vérifier la configuration
      const feeRate = await tabToken.getTransferFeeRate();
      const collector = await tabToken.getFeeCollector();

      expect(feeRate).to.equal('0.5');
      expect(collector).to.equal(feeCollectorAddress);
    });

    it('devrait transférer avec les frais corrects', async () => {
      const amount = '100'; // 100 TABZ
      
      // Solde initial
      const initialUserBalance = await tabToken.getBalance(userAddress);
      const initialCollectorBalance = await tabToken.getBalance(feeCollectorAddress);

      // Faire le transfert
      await tabToken.transfer({
        to: userAddress,
        amount: amount,
        signer
      });

      // Vérifier les soldes après transfert
      const finalUserBalance = await tabToken.getBalance(userAddress);
      const finalCollectorBalance = await tabToken.getBalance(feeCollectorAddress);

      // Le user devrait recevoir 99.5 TABZ (100 - 0.5%)
      expect(Number(finalUserBalance) - Number(initialUserBalance)).to.equal(99.5);
      // Le collecteur devrait recevoir 0.5 TABZ
      expect(Number(finalCollectorBalance) - Number(initialCollectorBalance)).to.equal(0.5);
    });
  });

  describe('Test de la pause', () => {
    it('devrait pouvoir mettre en pause et reprendre AGT', async () => {
      // Mettre en pause
      await agtToken.pause(signer);

      // Essayer de faire un transfert (devrait échouer)
      try {
        await agtToken.transfer({
          to: userAddress,
          amount: '1',
          signer
        });
        expect.fail('Le transfert aurait dû échouer');
      } catch (error: any) {
        expect(error.message).to.include('paused');
      }

      // Reprendre
      await agtToken.unpause(signer);

      // Le transfert devrait maintenant fonctionner
      await agtToken.transfer({
        to: userAddress,
        amount: '1',
        signer
      });
    });

    it('devrait pouvoir mettre en pause et reprendre TABZ', async () => {
      // Mettre en pause
      await tabToken.pause(signer);

      // Essayer de faire un transfert (devrait échouer)
      try {
        await tabToken.transfer({
          to: userAddress,
          amount: '1',
          signer
        });
        expect.fail('Le transfert aurait dû échouer');
      } catch (error: any) {
        expect(error.message).to.include('paused');
      }

      // Reprendre
      await tabToken.unpause(signer);

      // Le transfert devrait maintenant fonctionner
      await tabToken.transfer({
        to: userAddress,
        amount: '1',
        signer
      });
    });
  });
});
