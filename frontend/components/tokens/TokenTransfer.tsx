import React, { useState } from 'react';
import { useToken, TokenType } from '../../hooks/useToken';

interface TokenTransferProps {
  tokenType: TokenType;
}

export function TokenTransfer({ tokenType }: TokenTransferProps) {
  const {
    balance,
    feeRate,
    feeCollector,
    isPaused,
    transfer,
    setFeeRate,
    setFeeCollector,
    setFeeExemption,
    pause,
    unpause,
    error,
    loading
  } = useToken(tokenType);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [newFeeRate, setNewFeeRate] = useState('');
  const [newCollector, setNewCollector] = useState('');
  const [exemptAddress, setExemptAddress] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    await transfer(recipient, amount);
    setAmount('');
    setRecipient('');
  };

  const handleSetFeeRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeRate) return;
    await setFeeRate(parseFloat(newFeeRate));
    setNewFeeRate('');
  };

  const handleSetCollector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollector) return;
    await setFeeCollector(newCollector);
    setNewCollector('');
  };

  const handleSetExemption = async (isExempt: boolean) => {
    if (!exemptAddress) return;
    await setFeeExemption(exemptAddress, isExempt);
    setExemptAddress('');
  };

  const calculatedFees = amount ? (parseFloat(amount) * parseFloat(feeRate) / 100).toString() : '0';
  const receivedAmount = amount ? (parseFloat(amount) - parseFloat(calculatedFees)).toString() : '0';

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {tokenType} Transfer
        {isPaused && <span className="text-red-500 ml-2">(Paused)</span>}
      </h2>

      <div className="mb-4">
        <p className="text-gray-600">Your Balance: {balance} {tokenType}</p>
        <p className="text-gray-600">Fee Rate: {feeRate}%</p>
        <p className="text-gray-600">Fee Collector: {feeCollector}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleTransfer} className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0.0"
            step="0.000000000000000001"
          />
          {amount && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Fees: {calculatedFees} {tokenType}</p>
              <p>Recipient will receive: {receivedAmount} {tokenType}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !amount || !recipient}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Transfer'}
        </button>
      </form>

      {/* Section Admin */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Admin Controls</h3>
        
        <div className="space-y-4">
          {/* Contrôle de la pause */}
          <div className="flex space-x-2">
            <button
              onClick={pause}
              disabled={loading || isPaused}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
            >
              Pause
            </button>
            <button
              onClick={unpause}
              disabled={loading || !isPaused}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Unpause
            </button>
          </div>

          {/* Modification du taux de frais */}
          <form onSubmit={handleSetFeeRate} className="space-y-2">
            <input
              type="number"
              value={newFeeRate}
              onChange={(e) => setNewFeeRate(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="New fee rate (%)"
              step="0.01"
            />
            <button
              type="submit"
              disabled={loading || !newFeeRate}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Update Fee Rate
            </button>
          </form>

          {/* Modification du collecteur de frais */}
          <form onSubmit={handleSetCollector} className="space-y-2">
            <input
              type="text"
              value={newCollector}
              onChange={(e) => setNewCollector(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="New fee collector address"
            />
            <button
              type="submit"
              disabled={loading || !newCollector}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Update Fee Collector
            </button>
          </form>

          {/* Gestion des exemptions */}
          <div className="space-y-2">
            <input
              type="text"
              value={exemptAddress}
              onChange={(e) => setExemptAddress(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Address to exempt/unexempt"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleSetExemption(true)}
                disabled={loading || !exemptAddress}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                Add Exemption
              </button>
              <button
                onClick={() => handleSetExemption(false)}
                disabled={loading || !exemptAddress}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                Remove Exemption
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
