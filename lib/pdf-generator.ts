import PDFDocument from 'pdfkit';
import type { InvoiceData } from './invoice';

export async function generatePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      // Collect PDF data chunks
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Add content to PDF
      doc.fontSize(20).text('Invoice', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Order ID: ${data.orderId}`);
      doc.text(`Artwork Title: ${data.artworkTitle}`);
      doc.text(`Amount: $${data.amount}`);
      doc.text(`Buyer Email: ${data.buyerEmail}`);
      doc.text(`Payment Method: ${data.paymentMethod}`);
      
      // End the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}