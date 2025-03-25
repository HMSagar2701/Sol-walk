/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Challenge {
  _id: string;
  potAmount: number;
  groupId: string;
  challengeGoal: string;
  bidAmount: number;
  currency: string;
  startDate: string;
  endDate: string;
  participants: any[];
  challengeStatus: string;
}

const GroupChallenges = ({ groupId }: { groupId: string }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage

      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group-challenges/challenges/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Attach the token in the request headers
          }
        );

        setChallenges(response.data);
      } catch (err) {
        setError('Failed to fetch challenges. Please try again.'+err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchChallenges();
    }
  }, [groupId]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">Group Challenges</h2>

      {loading && <p>Loading challenges...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && challenges.length === 0 && (
        <p className="text-gray-400">No challenges found for this group.</p>
      )}

      {!loading && !error && challenges.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 border border-gray-700">Challenge Goal</th>
                <th className="p-2 border border-gray-700">Bid Amount</th>
                <th className="p-2 border border-gray-700">Currency</th>
                <th className="p-2 border border-gray-700">Start Date</th>
                <th className="p-2 border border-gray-700">End Date</th>
                <th className="p-2 border border-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => (
                <tr key={challenge._id} className="bg-gray-800 hover:bg-gray-700">
                  <td className="p-2 border border-gray-700">{challenge.challengeGoal}</td>
                  <td className="p-2 border border-gray-700">{challenge.bidAmount}</td>
                  <td className="p-2 border border-gray-700">{challenge.currency}</td>
                  <td className="p-2 border border-gray-700">
                    {new Date(challenge.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border border-gray-700">
                    {new Date(challenge.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border border-gray-700 font-bold text-green-400">
                    {challenge.challengeStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GroupChallenges;
