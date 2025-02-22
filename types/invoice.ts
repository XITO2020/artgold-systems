// types/invoice.ts

export interface InvoiceData {
    orderId: string;
    amount: number;
    artworkTitle: string;
    buyerEmail: string;
    paymentMethod: 'stripe' | 'paypal';
  }
  