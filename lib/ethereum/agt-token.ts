import { ethers } from 'ethers';
import { AGTTokenConfig, TransferParams, ApprovalParams } from './types';
import { getAGTContract } from './contracts';
import type { IERC20 } from './types';

export class AGTToken {
  private contract: IERC20;
  private provider: ethers.Provider;

  constructor(config: AGTTokenConfig) {
    this.provider = config.provider;
    this.contract = getAGTContract(config.address, this.provider);
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  }

  async transfer({ to, amount, signer }: TransferParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getAGTContract(this.contract.target as string, signer);
    return await connectedContract.transfer(
      to,
      ethers.parseUnits(amount, 18)
    );
  }

  async approve({ spender, amount, signer }: ApprovalParams): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = getAGTContract(this.contract.target as string, signer);
    return await connectedContract.approve(
      spender,
      ethers.parseUnits(amount, 18)
    );
  }
}