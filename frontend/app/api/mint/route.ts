import { NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';
import { TabToken } from '~/blockchains/solana/tab-token';
import { fetchStoryFromShonendump } from '~/blockchains/solana/story-fetcher';

export async function POST(req: Request) {
  try {
    const { 
      storyId,
      artworkData
    } = await req.json();

    // Initialize Solana connection
    const tabToken = new TabToken('devnet');
    
    // In production, use proper key management
    const authority = Keypair.generate();
    
    // Fetch story data from shonendump.dz
    const storyData = await fetchStoryFromShonendump(storyId);
    
    // Create token with story and artwork data
    const result = await tabToken.createToken(authority, storyData, artworkData);

    return NextResponse.json({ 
      success: true,
      signature: result.signature,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Minting failed:', error);
    return NextResponse.json(
      { error: 'Token minting failed' },
      { status: 500 }
    );
  }
}