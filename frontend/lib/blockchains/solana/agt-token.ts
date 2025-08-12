import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Cluster,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PROGRAM_ID, getProgramAddress } from './program';

type Network = 'devnet' | 'mainnet-beta';
type Category = keyof typeof AGTToken.CATEGORY_BONUSES;

export class AGTToken {
  private static readonly SILVER_GRAMS_PER_TOKEN = 0.001;
  private static readonly CATEGORY_BONUSES = {
    invention: 500,
    architecture: 400,
    comics: 300,
    ecologicalplan: 450,
    characterdesign: 350,
    'vehicles concept': 400,
    'visual effect': 300,
    'motion design': 250
  } as const;

  private connection: Connection;

  constructor(
    network: Network = 'devnet',
    private readonly programId: PublicKey = PROGRAM_ID
  ) {
    this.connection = new Connection(
      this.getClusterUrl(network),
      { commitment: 'confirmed' }
    );
  }

  // ==================== CORE METHODS ====================
  async mintForCategory(
    authority: Keypair,
    artist: PublicKey,
    category: Category,
    isFirst: boolean
  ): Promise<{
    signature: string;
    amount: number;
    tokenAccount: string;
  }> {
    const bonus = this.getCategoryBonus(category);
    const amount = this.calculateMintAmount(bonus, isFirst);

    const [tokenAccount] = await getProgramAddress([
      Buffer.from('token-account'),
      artist.toBuffer()
    ]);

    const transaction = this.buildMintTransaction(
      authority.publicKey,
      tokenAccount,
      artist
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [authority]
    );

    return { signature, amount, tokenAccount: tokenAccount.toString() };
  }

  async bankPurchaseArtwork(
    authority: Keypair,
    seller: PublicKey,
    amount: number,
    artworkId: string
  ): Promise<{
    signature: string;
    amount: number;
    seller: string;
  }> {
    this.validatePurchaseAmount(amount);

    const [bankAccount] = await getProgramAddress([
      Buffer.from('bank-account'),
      authority.publicKey.toBuffer()
    ]);

    const transaction = this.buildPurchaseTransaction(
      bankAccount,
      seller,
      amount
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [authority]
    );

    return { signature, amount, seller: seller.toString() };
  }

  // ==================== TRANSACTION BUILDERS ====================
  private buildMintTransaction(
    from: PublicKey,
    tokenAccount: PublicKey,
    artist: PublicKey
  ): Transaction {
    return new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: from,
        newAccountPubkey: tokenAccount,
        lamports: await this.connection.getMinimumBalanceForRentExemption(0),
        space: 0,
        programId: TOKEN_PROGRAM_ID
      }),
      // Ajoutez ici votre instruction custom de mint si nécessaire
    );
  }

  private buildPurchaseTransaction(
    from: PublicKey,
    to: PublicKey,
    amount: number
  ): Transaction {
    return new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: amount
      })
    );
  }

  // ==================== VALIDATORS ====================
  private validatePurchaseAmount(amount: number): void {
    if (amount > 1000) {
      throw new Error('Amount exceeds maximum purchase limit of 1000 lamports');
    }
  }

  // ==================== UTILITIES ====================
  private getClusterUrl(network: Network): string {
    return network === 'devnet'
      ? 'https://api.devnet.solana.com'
      : 'https://api.mainnet-beta.solana.com';
  }

  private calculateMintAmount(baseAmount: number, isFirst: boolean): number {
    return isFirst ? baseAmount * 1.5 : baseAmount;
  }

  // ==================== PUBLIC HELPERS ====================
  public getCategoryBonus(category: Category): number {
    return AGTToken.CATEGORY_BONUSES[category];
  }

  public getSilverEquivalent(amount: number): number {
    return amount * AGTToken.SILVER_GRAMS_PER_TOKEN;
  }

  // ==================== STATIC ACCESSORS ====================
  static get categories(): readonly Category[] {
    return Object.keys(this.CATEGORY_BONUSES) as Category[];
  }

  static isSupportedCategory(category: string): category is Category {
    return category in this.CATEGORY_BONUSES;
  }
}