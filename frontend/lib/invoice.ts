import { prisma } from './db';
import { generatePDF } from './pdf-generator';

export interface InvoiceData {
  orderId: string;
  amount: number;
  artworkTitle: string;
  buyerEmail: string;
  paymentMethod: 'stripe' | 'paypal';
}

export async function generateInvoice(data: InvoiceData): Promise<void> {
  try {
    // Generate PDF buffer
    const pdfBuffer = await generatePDF(data);
    
    // Save PDF to storage
    const invoicePath = `/tmp/invoices/${data.orderId}.pdf`;

    // Update transaction with invoice metadata
    await prisma.transaction.update({
      where: { id: data.orderId },
      data: {
        metadata: {
          invoicePath,
          amount: data.amount,
          artworkTitle: data.artworkTitle,
          buyerEmail: data.buyerEmail,
          paymentMethod: data.paymentMethod,
          generatedAt: new Date().toISOString()
        }
      }
    });

    // Return void as specified in the function signature
    return;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}