'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const InviteMemberPage: React.FC = () => {
  const { groupId } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠️ Please login first.');
      router.push('/login');
      return;
    }

    try {
      // Step 1: Get invited user's ID from email
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/by-email/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const invitedUserId = userRes.data?._id;

      if (!invitedUserId) throw new Error('User not found.');

      // Step 2: Send invite request
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group/invite-member`,
        { groupId, userId: invitedUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`✅ Successfully invited ${email}`);
      setEmail('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '❌ Invitation failed');
      } else {
        setError('❌ Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10 md:px-10">
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <UserPlus className="w-6 h-6" />
          Invite Member to Group
        </h1>

        <label className="block mb-2 text-sm font-medium text-gray-300">
          Member Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleInvite}
          disabled={loading || !email}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-all"
        >
          {loading ? 'Inviting...' : 'Send Invite'}
        </button>

        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}

        <button
          onClick={() => router.push(`/group/${groupId}`)}
          className="mt-6 text-sm text-indigo-400 hover:underline"
        >
          ← Back to Group
        </button>
      </div>
    </div>
  );
};

export default InviteMemberPage;
