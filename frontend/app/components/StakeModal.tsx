'use client';

import React, { useState } from 'react';

interface StakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

const StakeModal: React.FC<StakeModalProps> = ({ isOpen, onClose, groupId }) => {
  const [amount, setAmount] = useState('');

  const handleStake = () => {
    // TODO: trigger on-chain transaction logic
    console.log('Stake amount:', amount, 'Group:', groupId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Stake to Group Challenge</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4"
          placeholder="Enter amount in SOL"
        />
        <button
          onClick={handleStake}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Confirm Stake
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default StakeModal;
