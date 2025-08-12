export const PAYMENT_CONFIG = {
  providers: {
    stripe: {
      apiVersion: '2023-10-16',
      fees: 0.029, // 2.9%
      fixedFee: 0.30 // $0.30
    },
    paypal: {
      fees: 0.035, // 3.5%
      fixedFee: 0.49, // $0.49
      webhookId: process.env.PAYPAL_WEBHOOK_ID
    },
    monero: {
      fees: 0.001, // 0.1%
      config: {
        walletRpcUrl: process.env.MONERO_WALLET_RPC_URL,
        username: process.env.MONERO_WALLET_USERNAME,
        password: process.env.MONERO_WALLET_PASSWORD
      }
    }
  },
  currencies: ['USD', 'EUR', 'GBP'],
  minimumAmount: 1,
  maximumAmount: 50000,
  retryPolicy: {
    maxAttempts: 3,
    backoffMs: 1000
  }
};