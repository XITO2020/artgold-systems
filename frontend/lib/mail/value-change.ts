import { prisma } from '../db';
import { transporter } from '../mail';

interface ValueChangeNotification {
  artworkId: string;
  newValue: number;
  previousValue: number;
  reason: 'SALE' | 'LIKES' | 'ADMIN';
}

export async function sendValueChangeNotifications({
  artworkId,
  newValue,
  previousValue,
  reason
}: ValueChangeNotification) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: {
      artist: true,
      purchases: {
        include: { buyer: true }
      }
    }
  });

  if (!artwork) return;

  const valueIncrease = newValue - previousValue;
  const creatorShare = valueIncrease * 0.1;
  const ownerShare = valueIncrease * 0.8;
  const buyersShare = valueIncrease * 0.1;

  // Send notification to creator
  if (artwork.artist.email) {
    await transporter.sendMail({
      to: artwork.artist.email,
      subject: 'Your Artwork Value Has Increased',
      html: `
        <h1>Value Increase Notification</h1>
        <p>Your artwork "${artwork.title}" has increased in value!</p>
        <ul>
          <li>Previous value: ${previousValue} TABZ</li>
          <li>New value: ${newValue} TABZ</li>
          <li>Your share: ${creatorShare} TABZ</li>
        </ul>
      `
    });
  }

  // Send notifications to buyers
  for (const purchase of artwork.purchases) {
    if (purchase.buyer.email) {
      const buyerShare = buyersShare / artwork.purchases.length;
      await transporter.sendMail({
        to: purchase.buyer.email,
        subject: 'Artwork Value Update',
        html: `
          <h1>Value Increase Notification</h1>
          <p>An artwork you own a share in has increased in value!</p>
          <ul>
            <li>Artwork: ${artwork.title}</li>
            <li>New value: ${newValue} TABZ</li>
            <li>Your share: ${buyerShare} TABZ</li>
          </ul>
        `
      });
    }
  }
}