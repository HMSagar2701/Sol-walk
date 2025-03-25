/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';

const StakePage = () => {
  const [isClient, setIsClient] = useState(false); // Prevent SSR mismatch
  const params = useParams(); // Use params safely
  const groupId = params?.groupId as string; // Extract groupId safely
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [stakeAmount, setStakeAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(null);

  const TREASURY_PUBLIC_KEY = new PublicKey('8b8hfFYHVzaz4tJB4cV7fJNiWzBz27vzajoenTwUdqUb');

  useEffect(() => {
    setIsClient(true); // Set client-side rendering flag
  }, []);

  if (!isClient) return null; // Prevent hydration mismatch

  const handleStake = async () => {
    if (!publicKey) {
      setError('⚠️ Please connect your wallet.');
      return;
    }

    const amountInLamports = Number(stakeAmount) * LAMPORTS_PER_SOL;
    if (!stakeAmount || isNaN(amountInLamports) || amountInLamports <= 0) {
      setError('⚠️ Enter a valid stake amount.');
      return;
    }

    setError(null);
    setTransactionSuccess(null);

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: TREASURY_PUBLIC_KEY,
          lamports: amountInLamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setTransactionSuccess(`✅ Stake successful!`);
    } catch (err) {
      setError('❌ Transaction failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="p-8 bg-gray-900/80 border border-gray-700 backdrop-blur-md shadow-xl rounded-xl w-full max-w-md">
        
        <h2 className="text-2xl font-extrabold text-center mb-2 text-blue-500">
          🟣 Stake Your SOL
        </h2>
        <p className="text-gray-400 text-center mb-6">Securely stake SOL tokens for your group challenge.</p>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-6">
          <WalletMultiButton className="!bg-blue-600 !text-white !rounded-full hover:scale-105 transition" />
        </div>

        {/* Stake Input */}
        <div className="relative">
          <input
            type="number"
            placeholder="Enter amount (SOL)"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-white text-lg placeholder-gray-500"
          />
          <span className="absolute right-4 top-3 text-gray-400">SOL</span>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

        {/* Success Message */}
        {transactionSuccess && (
          <p className="text-green-500 mt-3 text-center">
            ✅ Staking Successful!  
          </p>
        )}

        {/* Stake Button */}
        <button
          onClick={handleStake}
          className="w-full px-4 py-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-500 rounded-lg text-white font-semibold hover:scale-105 transition transform hover:shadow-lg"
        >
          🚀 Stake Now
        </button>

        {/* Back Button */}
        <button
          onClick={() =>  router.back()}
          className="w-full px-4 py-3 mt-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition text-white"
        >
          ⬅ Back to Group
        </button>
      </div>
    </div>
  );
};

export default StakePage;
