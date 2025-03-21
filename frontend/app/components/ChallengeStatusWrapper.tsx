'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChallengeStatusWrapper({ groupId, challengeId }: { groupId: string; challengeId: string }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`https://sol-walk.onrender.com/api/group-challenges/status/${groupId}/${challengeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // if auth required
          },
        });
        setStatus(res.data.challengeStatus);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching status:', err?.response?.data || err.message);
        setStatus('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [groupId, challengeId]);

  return (
    <div className="mt-4">
      {loading ? (
        <p>Loading status...</p>
      ) : (
        <p className="text-lg font-semibold">Challenge Status: {status}</p>
      )}
    </div>
  );
}
