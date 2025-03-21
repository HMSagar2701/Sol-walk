import React from 'react';
import { Button } from '../components/ui/button'

interface GroupCardProps {
  group: {
    name: string;
    description: string;
    totalPot: number;
    memberCount: number;
  };
  onStakeClick: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onStakeClick }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 shadow-md rounded-2xl space-y-3">
      <h2 className="text-xl font-semibold">{group.name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <p>Total Pot: <span className="font-bold">${group.totalPot}</span></p>
        <p>Members: <span className="font-bold">{group.memberCount}</span></p>
      </div>
      <Button onClick={onStakeClick} className="mt-3 w-full">
        Stake / Join Challenge
      </Button>
    </div>
  );
};

export default GroupCard;
