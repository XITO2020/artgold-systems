export class MoneroService {
  private rpcUrl: string;
  private username: string;
  private password: string;

  constructor() {
    this.rpcUrl = process.env.MONERO_WALLET_RPC_URL || '';
    this.username = process.env.MONERO_WALLET_USERNAME || '';
    this.password = process.env.MONERO_WALLET_PASSWORD || '';
  }

  private async makeRPCRequest(method: string, params: any = {}): Promise<any> {
    const request = {
      jsonrpc: '2.0',
      id: 'insercoin',
      method,
      params
    };

    const authHeader = Buffer.from(
      `${this.username}:${this.password}`
    ).toString('base64');

    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result;
    } catch (error) {
      console.error(`Monero RPC error (${method}):`, error);
      throw error;
    }
  }

  async getBalance(): Promise<{ total: string; unlocked: string }> {
    const result = await this.makeRPCRequest('get_balance');
    return {
      total: (result.balance / 1e12).toString(),
      unlocked: (result.unlocked_balance / 1e12).toString()
    };
  }

  async createPaymentRequest(amount: number): Promise<{
    address: string;
    paymentId: string;
    integratedAddress: string;
  }> {
    const [address, paymentId] = await Promise.all([
      this.makeRPCRequest('get_address'),
      this.makeRPCRequest('make_integrated_address')
    ]);

    return {
      address: address.address,
      paymentId: paymentId.payment_id,
      integratedAddress: paymentId.integrated_address
    };
  }

  async checkPayment(paymentId: string): Promise<{
    received: boolean;
    confirmed: boolean;
    amount?: string;
  }> {
    const currentHeight = await this.getCurrentHeight();
    const minHeight = Math.max(0, currentHeight - 100);

    const transfers = await this.makeRPCRequest('get_transfers', {
      in: true,
      filter_by_height: true,
      min_height: minHeight
    });

    const payment = transfers.in?.find((t: any) => t.payment_id === paymentId);

    if (!payment) {
      return { received: false, confirmed: false };
    }

    return {
      received: true,
      confirmed: payment.confirmations >= 10,
      amount: (payment.amount / 1e12).toString()
    };
  }

  private async getCurrentHeight(): Promise<number> {
    const info = await this.makeRPCRequest('get_height');
    return info.height;
  }
}