import { ethers } from 'ethers';
import { 
  TokenConfig, 
  TransactionParams,
  ITokenMetadata,
  IPausable,
  IFeeManager
} from '../types';

export abstract class BaseToken implements ITokenMetadata, IPausable, IFeeManager {
  protected contract: ethers.Contract;
  protected readonly decimals: number = 18;

  constructor(config: TokenConfig, abi: any) {
    this.contract = new ethers.Contract(
      config.address,
      abi,
      config.provider
    );
  }

  // ========== ITokenMetadata ==========
  async name(): Promise<string> {
    return this.contract.name();
  }

  async symbol(): Promise<string> {
    return this.contract.symbol();
  }

  async decimals(): Promise<number> {
    return Number(await this.contract.decimals());
  }

  async totalSupply(): Promise<bigint> {
    return await this.contract.totalSupply();
  }

  async balanceOf(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance, this.decimals);
  }

  // ========== IPausable ==========
  async pause(options?: TransactionParams): Promise<ethers.ContractTransactionResponse> {
    const contract = options?.signer ? this.contract.connect(options.signer) : this.contract;
    return contract.pause();
  }

  async unpause(options?: TransactionParams): Promise<ethers.ContractTransactionResponse> {
    const contract = options?.signer ? this.contract.connect(options.signer) : this.contract;
    return contract.unpause();
  }

  async paused(): Promise<boolean> {
    return this.contract.paused();
  }

  // ========== IFeeManager ==========
  async transferFeeRate(): Promise<bigint> {
    return this.contract.transferFeeRate();
  }

  async feeCollector(): Promise<string> {
    return this.contract.feeCollector();
  }

  async isExemptFromFee(account: string): Promise<boolean> {
    return this.contract.isExemptFromFee(account);
  }

  async setTransferFeeRate(
    newRate: ethers.BigNumberish, 
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse> {
    const contract = options?.signer ? this.contract.connect(options.signer) : this.contract;
    return contract.setTransferFeeRate(newRate);
  }

  async setFeeCollector(
    newCollector: string, 
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse> {
    const contract = options?.signer ? this.contract.connect(options.signer) : this.contract;
    return contract.setFeeCollector(newCollector);
  }

  async setFeeExemption(
    account: string, 
    isExempt: boolean, 
    options?: TransactionParams
  ): Promise<ethers.ContractTransactionResponse> {
    const contract = options?.signer ? this.contract.connect(options.signer) : this.contract;
    return contract.setFeeExemption(account, isExempt);
  }

  // ========== UTILITIES ==========
  protected parseTokenAmount(amount: string): bigint {
    return ethers.parseUnits(amount, this.decimals);
  }

  protected formatTokenAmount(amount: bigint): string {
    return ethers.formatUnits(amount, this.decimals);
  }
}