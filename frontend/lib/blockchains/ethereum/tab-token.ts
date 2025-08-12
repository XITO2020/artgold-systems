import { ethers } from 'ethers';
import { TokenConfig, TransferParams, ApprovalParams, MintArtworkParams } from './types';
import type { ITabAsCoin } from './types';

function getTabContract(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): ITabAsCoin {
  const contract = new ethers.Contract(
    address,
    [
      'function transfer(address to, uint256 amount) returns (bool)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'function balanceOf(address account) view returns (uint256)',
      'function pause() external',
      'function unpause() external',
      'function transferFeeRate() external view returns (uint256)',
      'function setTransferFeeRate(uint256 newRate) external',
      'function feeCollector() external view returns (address)',
      'function setFeeCollector(address newCollector) external',
      'function isExemptFromFee(address account) external view returns (bool)',
      'function setFeeExemption(address account, bool isExempt) external',
      'function mintArtwork(address artist, string artworkId, string category, bool isFirst) external',
      'function getGoldEquivalent(uint256 amount) view returns (uint256)',
      'function getTokenValue(uint256 amount) view returns (uint256)',
      'function getRemainingSlots(address user) view returns (uint256)',
      'function userSlots(address) view returns (uint256)',
      'function categoryBasePrice(string) view returns (uint256)'
    ],
    signerOrProvider
  );
  
  return contract as unknown as ITabAsCoin;
}

export class TabAsCoin {
  private contract: ITabAsCoin;
  private provider: ethers.Provider;

  constructor(config: TokenConfig) {
    this.provider = config.provider;
    this.contract = getTabContract(config.address, this.provider);
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  }

  async transfer({ to, amount, signer }: TransferParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
    return await connectedContract.transfer(
      to,
      ethers.parseUnits(amount, 18)
    );
  }

  async approve({ spender, amount, signer }: ApprovalParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
    return await connectedContract.approve(
      spender,
      ethers.parseUnits(amount, 18)
    );
  }

  // Fonctions de pause
  async pause(signer: ethers.Signer): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
    return await connectedContract.pause();
  }

  async unpause(signer: ethers.Signer): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
    return await connectedContract.unpause();
  }

  // Fonctions de gestion des frais
  async getTransferFeeRate(): Promise<string> {
    const rate = await this.contract.transferFeeRate();
    return (Number(rate) / 100).toString(); // Convertit 50 -> "0.5"
  }

  async getFeeCollector(): Promise<string> {
    return await this.contract.feeCollector();
  }

  async isExemptFromFee(address: string): Promise<boolean> {
    return await this.contract.isExemptFromFee(address);
  }

  async setTransferFeeRate(signer: ethers.Signer, newRate: number): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
    // Convertit 0.5 -> 50
    const rateForContract = Math.floor(newRate * 100);
    return await connectedContract.setTransferFeeRate(rateForContract);
  }

  async setFeeCollector(signer: ethers.Signer, newCollector: string): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
    return await connectedContract.setFeeCollector(newCollector);
  }

  async setFeeExemption(
    signer: ethers.Signer,
    account: string,
    isExempt: boolean
  ): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
    return await connectedContract.setFeeExemption(account, isExempt);
  }

  // Fonctions spécifiques à TabAsCoin
  async mintArtwork({
    artist,
    artworkId,
    category,
    isFirst,
    signer
  }: MintArtworkParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getTabContract(this.contract.target as string, signer);
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

  async getCategoryBasePrice(category: string): Promise<string> {
    const price = await this.contract.categoryBasePrice(category);
    return ethers.formatUnits(price, 18);
  }
}
