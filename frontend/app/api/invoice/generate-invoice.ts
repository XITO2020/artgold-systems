import { NextResponse } from 'next/server';
import { createInvoicePDF } from '~/pdf-generator';
import type { InvoiceData } from '~/invoice';

export async function POST(req: Request) {
  try {
    const data: InvoiceData = await req.json();
    
    // Generate PDF
    const pdfBuffer = await createInvoicePDF(data);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${data.orderId}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

export default POST