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
    await prisma.invoice.create({
      data: {
        orderId: data.orderId,
        filePath: invoicePath,
        amount: data.amount,
        buyerEmail: data.buyerEmail,
        paymentMethod: data.paymentMethod,
        createdAt: new Date()
      }
    });

    // Return void as specified in the function signature
    return;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}