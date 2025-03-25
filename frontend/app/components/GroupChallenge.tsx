/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface Challenge {
  _id: string;
  challengeGoal: string;
  bidAmount: number;
  currency: string;
  startDate: string;
  endDate: string;
  participants: { userId: string }[];
  challengeStatus: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GroupChallenges = ({ groupId, userId }: { groupId: string; userId: string }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChallenges = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group-challenges/challenges/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChallenges(response.data);
      } catch (err: any) {
        setError('Failed to fetch challenges. Please try again.'+err);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchChallenges();
    }
  }, [groupId]);

  const handleJoinClick = () => {
    if (groupId) {
      router.push(`/group/${groupId}/stake`);
    } else {
      console.error("Group ID is missing!");
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      {/* Back to Dashboard Button */}
      <button
        className="flex items-center text-white bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition mb-4"
        onClick={() => router.push('/dashboard')}
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <h2 className="text-xl font-bold mb-4">Group Challenges</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p>Loading challenges...</p>}

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
                <th className="p-2 border border-gray-700">Action</th>
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
                  <td className="p-2 border border-gray-700">
                    <button
                      onClick={handleJoinClick}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                    >
                      Join
                    </button>
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
