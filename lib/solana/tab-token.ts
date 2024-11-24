import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

export interface StoryMetadata {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  url: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export class TabToken {
  private connection: Connection;

  constructor(network: 'devnet' | 'mainnet-beta' = 'devnet') {
    this.connection = new Connection(clusterApiUrl(network));
  }

  async createToken(
    authority: Keypair,
    storyData: StoryMetadata,
    artworkData: {
      dimensions: { width: number; height: number; unit: string };
      weight: { value: number; unit: string };
      medium: string;
      materials: string[];
    }
  ) {
    try {
      // Create a simple transaction to demonstrate
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: authority.publicKey,
          toPubkey: authority.publicKey,
          lamports: 0,
        })
      );

      // Add memo with metadata
      const metadata = {
        story: storyData,
        artwork: artworkData,
        tokenType: "TabAsCoin",
        version: "1.0"
      };

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [authority]
      );

      return {
        signature,
        metadata
      };
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  async getTokenMetadata(signature: string) {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return transaction;
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }
}