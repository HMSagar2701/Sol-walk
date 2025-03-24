/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const JoinGroupPage: React.FC = () => {
  const { groupId } = useParams();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`/api/groups/${groupId}`);
        setGroup(response.data);
      } catch (err) {
        setError('Could not fetch group data');
      }
    };

    if (groupId) fetchGroup();
  }, [groupId]);

  const handleJoinGroup = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('⚠️ Please login first.');
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `/api/group/accept-invite/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      router.push(`/group/${groupId}`);
    } catch (err: any) {
      setError('❌ Failed to join the group');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10 md:px-10">
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <UserPlus className="w-6 h-6" />
          Join Group
        </h1>

        {group ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">{group.groupName}</h2>
            <p className="mb-4">You have been invited to join this group.</p>

            <button
              onClick={handleJoinGroup}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Joining Group...' : 'Join Group'}
            </button>

            {message && <p className="mt-4 text-green-400">{message}</p>}
            {error && <p className="mt-4 text-red-400">{error}</p>}
          </div>
        ) : (
          <p className="text-center">Loading group details...</p>
        )}
      </div>
    </div>
  );
};

export default JoinGroupPage;
