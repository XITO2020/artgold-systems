# Tabascocity Artwork Process

## Introduction

Bienvenue dans le processus artistique de Tabascocity ! Ce document explique comment fonctionne notre marché NFT avec les jetons TABZ et AGT. Voici un aperçu complet :

## Système de Jetons

### Configuration des Jetons

Les jetons TABZ et AGT sont configurés comme suit :

```typescript
// From lib/token-config.ts
export const TOKEN_CONFIG = {
  TABZ: {
    name: 'TabAsCoin',
    symbol: 'TABZ',
    goldGramsPerToken: 0.0001, // 0.0001g d'or par TABZ
    network: 'solana',
    minPurchase: 1,
    maxPurchase: 10000,
    lockupPeriod: 365 * 24 * 60 * 60 * 1000, // Période de verrouillage de 1 an
  },
  AGT: {
    name: 'Art Generator Token',
    symbol: 'AGT',
    silverGramsPerToken: 0.001, // 0.001g d'argent par AGT
    network: 'ethereum',
    minPurchase: 10,
    maxPurchase: 100000,
    lockupPeriod: 365 * 24 * 60 * 60 * 1000 // Période de verrouillage de 1 an
  }
};
```

## Processus de Création de NFT

### Validation de l'Œuvre d'Art

Lorsque les utilisateurs téléchargent une œuvre d'art via la page `/upload` :

1. **Validation de l'Authenticité** :

```typescript
// From lib/validation.ts
export async function validateArtwork(
  artworkId: string,
  imageBuffer: Buffer
): Promise<{
  isValid: boolean;
  status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW';
  details: any;
}> {
  // Run AI detection
  const aiAnalysis = await detectAIArtwork(imageBuffer);

  // If AI generated, reject immediately
  if (aiAnalysis.isAIGenerated) {
    await prisma.artwork.update({
      where: { id: artworkId },
      data: { status: 'REJECTED' }
    });
    return {
      isValid: false,
      status: 'REJECTED',
      details: aiAnalysis
    };
  }

  return {
    isValid: true,
    status: 'PENDING_REVIEW',
    details: aiAnalysis
  };
}
```

### Création du NFT

Une fois l'œuvre d'art approuvée, elle est transformée en NFT :

```typescript
// From lib/solana/tab-token.ts
export class TabToken {
  async createToken(
    authority: Keypair,
    storyData: StoryMetadata,
    artworkData: ArtworkMetadata
  ): Promise<TokenCreationResult> {
    const metadata = {
      story: storyData,
      artwork: artworkData,
      tokenType: "TabAsCoin",
      version: "1.0"
    };

    // Create NFT on Solana
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
  }
}
```

## Distribution de la Valeur

Lorsqu'une œuvre d'art est vendue, la valeur est distribuée selon le système suivant :

```typescript
// From lib/value-distribution.ts
export const VALUE_SHARES = {
  CREATOR: 0.10, // 10% à l'artiste original
  OWNER: 0.80,   // 80% au propriétaire actuel
  BUYERS: 0.10   // 10% répartis entre les acheteurs précédents
};

export async function distributeValue(
  artworkId: string,
  valueIncrease: number,
  reason: 'SALE' | 'LIKES' | 'ADMIN'
) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: {
      artist: true,
      purchases: {
        include: { buyer: true }
      }
    }
  });

  // Calculate shares
  const creatorShare = valueIncrease * VALUE_SHARES.CREATOR;
  const ownerShare = valueIncrease * VALUE_SHARES.OWNER;
  const buyersShare = valueIncrease * VALUE_SHARES.BUYERS;

  // Distribute value in TABZ tokens
  await prisma.$transaction([
    // Update creator balance
    prisma.user.update({
      where: { id: artwork.artist.id },
      data: { balance: { increment: creatorShare } }
    }),
    // Update owner balance
    prisma.user.update({
      where: { id: artwork.artistId },
      data: { balance: { increment: ownerShare } }
    }),
    // Distribute buyers share
    ...artwork.purchases.map(purchase =>
      prisma.user.update({
        where: { id: purchase.buyerId },
        data: {
          balance: {
            increment: buyersShare / artwork.purchases.length
          }
        }
      })
    )
  ]);
}
```

## Conversion de Jetons

Les utilisateurs peuvent convertir leurs jetons en d'autres cryptomonnaies :

```typescript
// From lib/exchange.ts
export async function exchangeToEth(
  amount: number,
  fromToken: 'TABZ' | 'AGT',
  userAddress: string
) {
  // Calculate ETH amount based on token type
  const ethAmount = amount * (
    fromToken === 'TABZ' ?
      CONVERSION_RATES.TABZ_TO_ETH :
      CONVERSION_RATES.AGT_TO_ETH
  );

  // Create transaction record
  await prisma.exchange.create({
    data: {
      userId: session.user.id,
      fromToken,
      toToken: 'ETH',
      amount,
      receivedAmount: ethAmount,
      walletAddress: userAddress,
      status: 'COMPLETED'
    }
  });

  return ethAmount;
}
```

## Caractéristiques Clés

- Chaque œuvre d'art est soutenue par des jetons TABZ, eux-mêmes soutenus par de l'or.
- Les jetons AGT offrent des droits de gouvernance et sont soutenus par de l'argent.
- Période de verrouillage de 1 an pour les deux jetons afin d'assurer la stabilité.
- Distribution automatique de la valeur lorsque les œuvres d'art sont vendues.
- Système de validation par IA pour prévenir la fraude.
- Intégration avec les réseaux Solana (TABZ) et Ethereum (AGT).

Le système crée une économie durable où :

- Les artistes gagnent de l'argent grâce aux ventes initiales et à l'appréciation continue.
- Les collectionneurs peuvent investir dans l'art avec un soutien en métaux précieux réels.
- Les membres de la communauté peuvent gagner de l'argent en participant au marché.
- Toutes les transactions sont transparentes et automatisées via des contrats intelligents.

N'hésitez pas à me demander plus de détails sur une partie spécifique !