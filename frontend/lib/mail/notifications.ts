import { prisma } from '../db';
import { transporter } from '../mail';

interface SaleNotification {
  artwork: any;
  amount: number;
  isFirstSale: boolean;
  buyerId: string;
}

export async function sendSaleNotification({
  artwork,
  amount,
  isFirstSale,
  buyerId
}: SaleNotification) {
  const [artist, buyer] = await Promise.all([
    prisma.user.findUnique({ where: { id: artwork.artistId } }),
    prisma.user.findUnique({ where: { id: buyerId } })
  ]);

  if (artist?.email) {
    await transporter.sendMail({
      to: artist.email,
      subject: `Your Artwork "${artwork.title}" Has Been Sold!`,
      html: `
        <h1>Congratulations!</h1>
        <p>Your artwork "${artwork.title}" has been sold for ${amount} TABZ.</p>
        ${isFirstSale ? '<p>🎉 This is your first sale! You\'ve earned a bonus of 40 TABZ!</p>' : ''}
        <p>Your share of the sale has been credited to your account.</p>
      `
    });
  }

  if (buyer?.email) {
    await transporter.sendMail({
      to: buyer.email,
      subject: `Purchase Confirmation - ${artwork.title}`,
      html: `
        <h1>Purchase Confirmation</h1>
        <p>Thank you for purchasing "${artwork.title}"!</p>
        <p>Amount paid: ${amount} TABZ</p>
        <p>You now own a share of this artwork and will receive a portion of its future value increases.</p>
      `
    });
  }
}

export * from './value-change';