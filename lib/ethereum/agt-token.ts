import { ethers } from 'ethers';
import AGTTokenABI from '../contracts/AGTToken.json';

export class AGTToken {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL);
    this.contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AGT_CONTRACT_ADDRESS!,
      AGTTokenABI,
      this.provider
    );
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  }

  async transfer(
    to: string,
    amount: string,
    signer: ethers.Signer
  ): Promise<ethers.TransactionResponse> {
    const connectedContract = this.contract.connect(signer);
    return await connectedContract.transfer(
      to,
      ethers.parseUnits(amount, 18)
    );
  }

  async approve(
    spender: string,
    amount: string,
    signer: ethers.Signer
  ): Promise<ethers.TransactionResponse> {
    const connectedContract = this.contract.connect(signer);
    return await connectedContract.approve(
      spender,
      ethers.parseUnits(amount, 18)
    );
  }
}