import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { StoryMetadata, ArtworkMetadata, TokenCreationResult } from './types';
import { PROGRAM_ID, getProgramAddress } from './program';

export class TabToken {
  private connection: Connection;

  constructor(network: 'devnet' | 'mainnet-beta' = 'devnet') {
    this.connection = new Connection(
      network === 'devnet' 
        ? 'https://api.devnet.solana.com' 
        : 'https://api.mainnet-beta.solana.com'
    );
  }

  async createToken(
    authority: Keypair,
    storyData: StoryMetadata,
    artworkData: ArtworkMetadata
  ): Promise<TokenCreationResult> {
    try {
      const metadata = {
        story: storyData,
        artwork: artworkData,
        tokenType: "TabAsCoin",
        version: "1.0"
      };

      const [metadataAddress] = await getProgramAddress([
        Buffer.from('metadata'),
        authority.publicKey.toBuffer()
      ]);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: authority.publicKey,
          newAccountPubkey: metadataAddress,
          lamports: await this.connection.getMinimumBalanceForRentExemption(0),
          space: 0,
          programId: PROGRAM_ID
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [authority]
      );

      return { signature, metadata };
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  async transfer(
    authority: Keypair,
    to: PublicKey,
    amount: number
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: to,
        lamports: amount
      })
    );

    return await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [authority]
    );
  }

  async getTokenMetadata(signature: string) {
    try {
      return await this.connection.getTransaction(signature);
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }
}