import { ethers } from 'ethers';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_CONFIG, CONVERSION_RATES, LIMITS } from '~/token-config';
import { sendExchangeConfirmation } from '~/mail';

export async function exchangeToEth(
  amount: number,
  fromToken: 'TABZ' | 'AGT',
  userAddress: string
) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Calculate ETH amount
  const ethAmount = amount * (
    fromToken === 'TABZ' ? 
      CONVERSION_RATES.TABZ_TO_ETH : 
      CONVERSION_RATES.AGT_TO_ETH
  );

  // Create transaction
  const tx = await signer.sendTransaction({
    to: TOKEN_CONFIG[fromToken].contractAddress,
    value: ethers.parseEther(ethAmount.toString()),
  });

  // Wait for confirmation
  const receipt = await tx.wait();

  // Record exchange in database
  await fetch('/api/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromToken,
      toToken: 'ETH',
      amount,
      ethAmount,
      txHash: receipt.hash,
      userAddress,
    }),
  });

  // Send confirmation email
  await sendExchangeConfirmation(userAddress, {
    txHash: receipt.hash,
    fromToken,
    toToken: 'ETH',
    amount,
    receivedAmount: ethAmount,
  });

  return receipt;
}

export async function exchangeToSol(
  amount: number,
  fromToken: 'TABZ' | 'AGT',
  userAddress: string
) {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
  
  // Calculate SOL amount
  const solAmount = amount * (
    fromToken === 'TABZ' ? 
      CONVERSION_RATES.TABZ_TO_SOL : 
      CONVERSION_RATES.AGT_TO_SOL
  );

  // Create transaction
  const transaction = new Transaction();
  
  // Add transfer instruction
  // This is a placeholder - implement actual token program instructions
  
  // Sign and send transaction
  const signature = await window.solana.signAndSendTransaction(transaction);
  
  // Wait for confirmation
  await connection.confirmTransaction(signature);

  // Record exchange
  await fetch('/api/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromToken,
      toToken: 'SOL',
      amount,
      solAmount,
      signature,
      userAddress,
    }),
  });

  // Send confirmation email
  await sendExchangeConfirmation(userAddress, {
    txHash: signature,
    fromToken,
    toToken: 'SOL',
    amount,
    receivedAmount: solAmount,
  });

  return signature;
}

export function isTokenLocked(creationDate: Date): boolean {
  const lockupPeriod = LIMITS.LOCKUP_PERIOD;
  const now = Date.now();
  return (now - creationDate.getTime()) < lockupPeriod;
}