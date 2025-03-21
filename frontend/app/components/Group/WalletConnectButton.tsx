'use client';

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnectButton = () => {
  return (
    <div className="flex justify-end mb-4">
      <WalletMultiButton className="wallet-adapter-button bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200" />
    </div>
  );
};

export default WalletConnectButton;
