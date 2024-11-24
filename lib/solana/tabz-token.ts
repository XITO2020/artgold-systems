import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';

export class TabzToken {
  private connection: Connection;
  private mint: PublicKey;

  constructor() {
    this.connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
    this.mint = new PublicKey(process.env.NEXT_PUBLIC_TABZ_CONTRACT_ADDRESS!);
  }

  async createTokenAccount(owner: PublicKey) {
    const token = new Token(
      this.connection,
      this.mint,
      TOKEN_PROGRAM_ID,
      Keypair.generate() // Replace with proper signer in production
    );

    return await token.createAccount(owner);
  }

  async getBalance(account: PublicKey): Promise<number> {
    const token = new Token(
      this.connection,
      this.mint,
      TOKEN_PROGRAM_ID,
      Keypair.generate()
    );

    const balance = await token.getAccountInfo(account);
    return balance.amount.toNumber();
  }

  async transfer(
    source: PublicKey,
    destination: PublicKey,
    amount: number,
    owner: Keypair
  ) {
    const token = new Token(
      this.connection,
      this.mint,
      TOKEN_PROGRAM_ID,
      owner
    );

    return await token.transfer(
      source,
      destination,
      owner,
      [],
      amount
    );
  }
}