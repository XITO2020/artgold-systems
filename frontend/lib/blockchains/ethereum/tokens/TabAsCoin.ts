import { ethers } from 'ethers';
import { TokenConfig, TransferParams, ApprovalParams, MintArtworkParams } from '../types';
import TABASCOIN_ABI from '../../../../blockchain/artifacts/contracts/TabAsCoin.sol/TabAsCoin.json';

export class TabAsCoin {
  private contract: ethers.Contract;
  private provider: ethers.Provider;
  private readonly GOLD_GRAMS_PER_TOKEN = 1e14; // 0.0001g
  private readonly CATEGORY_PRICES = {
    african: 250,
    pacifikian: 250,
    oriental: 250,
    indian: 250,
    amerindian: 250,
    slavic: 250
  } as const;

  constructor(config: TokenConfig) {
    this.provider = config.provider;
    this.contract = new ethers.Contract(
      config.address,
      TABASCOIN_ABI.abi,
      this.provider
    );
  }

  // ==================== CORE METHODS ====================
  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  }

  async transfer({ to, amount, signer }: TransferParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = this.contract.connect(signer);
    return await connectedContract.transfer(
      to,
      ethers.parseUnits(amount, 18)
    );
  }

  async approve({ spender, amount, signer }: ApprovalParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = this.contract.connect(signer);
    return await connectedContract.approve(
      spender,
      ethers.parseUnits(amount, 18)
    );
  }

  // ==================== PAUSE MANAGEMENT ====================
  async pause(signer: ethers.Signer): Promise<ethers.ContractTransactionResponse> {
    return await this.contract.connect(signer).pause();
  }

  async unpause(signer: ethers.Signer): Promise<ethers.ContractTransactionResponse> {
    return await this.contract.connect(signer).unpause();
  }

  // ==================== FEE SYSTEM ====================
  async getTransferFeeRate(): Promise<string> {
    const rate = await this.contract.transferFeeRate();
    return (Number(rate) / 100).toString(); // 50 → "0.5"
  }

  async getFeeCollector(): Promise<string> {
    return await this.contract.feeCollector();
  }

  async isExemptFromFee(address: string): Promise<boolean> {
    return await this.contract.isExemptFromFee(address);
  }

  async setTransferFeeRate(signer: ethers.Signer, newRate: number): Promise<ethers.ContractTransactionResponse> {
    const rateForContract = Math.floor(newRate * 100); // 0.5 → 50
    return await this.contract.connect(signer).setTransferFeeRate(rateForContract);
  }

  async setFeeCollector(signer: ethers.Signer, newCollector: string): Promise<ethers.ContractTransactionResponse> {
    return await this.contract.connect(signer).setFeeCollector(newCollector);
  }

  async setFeeExemption(
    signer: ethers.Signer,
    account: string,
    isExempt: boolean
  ): Promise<ethers.ContractTransactionResponse> {
    return await this.contract.connect(signer).setFeeExemption(account, isExempt);
  }

  // ==================== TABASCOIN-SPECIFIC METHODS ====================
  async mintArtwork({
    artist,
    artworkId,
    category,
    isFirst,
    signer
  }: MintArtworkParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = this.contract.connect(signer);
    return await connectedContract.mintArtwork(artist, artworkId, category, isFirst);
  }

  async getGoldEquivalent(amount: string): Promise<string> {
    const goldAmount = await this.contract.getGoldEquivalent(ethers.parseUnits(amount, 18));
    return ethers.formatUnits(goldAmount, 18);
  }

  async getTokenValue(amount: string): Promise<string> {
    const value = await this.contract.getTokenValue(ethers.parseUnits(amount, 18));
    return ethers.formatUnits(value, 18);
  }

  async getRemainingSlots(user: string): Promise<bigint> {
    return await this.contract.getRemainingSlots(user);
  }

  async getUserSlots(user: string): Promise<bigint> {
    return await this.contract.userSlots(user);
  }

  async getCategoryBasePrice(category: keyof typeof this.CATEGORY_PRICES): Promise<string> {
    const price = await this.contract.categoryBasePrice(category);
    return ethers.formatUnits(price, 18);
  }
}