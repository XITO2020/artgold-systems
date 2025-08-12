import { Connection, PublicKey } from '@solana/web3.js';
import { TokenMetadata } from './types';

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  artworkId: string;
  metadataUri: string;
  onChainMetadata?: TokenMetadata;
}

export class StoryFetcher {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async fetchStory(storyAccount: PublicKey): Promise<Story> {
    const accountInfo = await this.connection.getAccountInfo(storyAccount);
    if (!accountInfo?.data) throw new Error('Story account not found');

    // Décodage des données selon votre format
    const storyData = this.decodeStoryAccount(accountInfo.data);
    
    return {
      id: storyData.id,
      title: storyData.title,
      content: storyData.content,
      author: storyData.author.toString(),
      artworkId: storyData.artworkId,
      metadataUri: storyData.uri,
      onChainMetadata: {
        name: storyData.title,
        symbol: 'STORY',
        uri: storyData.uri,
        decimals: 0
      }
    };
  }

  private decodeStoryAccount(data: Buffer): any {
    // Implémentez le décodage selon votre struct on-chain
    return {};
  }
}