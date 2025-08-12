import { ethers } from 'ethers';
import { TokenConfig, TransferParams, ApprovalParams } from '../types';
import AGT_ABI from '../../../../blockchain/artifacts/contracts/AGTToken.sol/AGTToken.json';

export class AGTToken {
  private contract: ethers.Contract;
  private provider: ethers.Provider;
  private readonly SILVER_GRAMS_PER_TOKEN = 1e15; // 0.001g
  private readonly CATEGORY_BONUSES = {
    invention: 500,
    architecture: 400,
    comics: 300,
    ecologicalplan: 450,
    characterdesign: 350,
    'vehicles concept': 400,
    'visual effect': 300,
    'motion design': 250
  } as const;

  constructor(config: TokenConfig) {
    this.provider = config.provider;
    this.contract = new ethers.Contract(
      config.address,
      AGT_ABI.abi,
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
    return (Number(rate) / 100).toString(); // 25 → "0.25"
  }

  async getFeeCollector(): Promise<string> {
    return await this.contract.feeCollector();
  }

  async isExemptFromFee(address: string): Promise<boolean> {
    return await this.contract.isExemptFromFee(address);
  }

  async setTransferFeeRate(signer: ethers.Signer, newRate: number): Promise<ethers.ContractTransactionResponse> {
    const rateForContract = Math.floor(newRate * 100); // 0.25 → 25
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

  // ==================== AGT-SPECIFIC METHODS ====================
  async mintForCategory(
    signer: ethers.Signer,
    artist: string,
    category: keyof typeof this.CATEGORY_BONUSES,
    isFirst: boolean
  ): Promise<ethers.ContractTransactionResponse> {
    const bonus = this.CATEGORY_BONUSES[category];
    return await this.contract.connect(signer).mintForCategory(artist, category, isFirst);
  }

  async bankPurchaseArtwork(
    signer: ethers.Signer,
    seller: string,
    amount: string,
    artworkId: string
  ): Promise<ethers.ContractTransactionResponse> {
    return await this.contract.connect(signer).bankPurchaseArtwork(
      seller,
      ethers.parseUnits(amount, 18),
      artworkId
    );
  }

  // ==================== UTILITIES ====================
  getSilverEquivalent(amount: string): string {
    return (parseFloat(amount) * this.SILVER_GRAMS_PER_TOKEN).toString();
  }

  async getTokenValue(amount: string): Promise<string> {
    const silverPrice = await this.contract.silverPriceUSD();
    return (parseFloat(amount) * this.SILVER_GRAMS_PER_TOKEN * Number(silverPrice) / 1e6).toString();
  }
}