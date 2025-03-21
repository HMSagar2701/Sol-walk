// components/Leaderboard.tsx

import React from 'react';

interface LeaderboardEntry {
  name: string;
  steps: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
        <p className="text-gray-500">No leaderboard data yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-gray-300 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">🏆 Leaderboard</h2>
      <ul className="space-y-2">
        {leaderboard.map((entry, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg"
          >
            <span className="font-medium">
              {index + 1}. {entry.name}
            </span>
            <span className="text-indigo-600 font-semibold">{entry.steps.toLocaleString()} steps</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
