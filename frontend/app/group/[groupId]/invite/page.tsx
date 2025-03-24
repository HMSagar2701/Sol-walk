'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { UserPlus, Link as LinkIcon, Share2 } from 'lucide-react';

const JoinGroupPage: React.FC = () => {
  const { groupId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Check auth and generate link only on client
  useEffect(() => {
    if (!isMounted) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    if (groupId) {
      setShareableLink(`${process.env.NEXT_PUBLIC_APP_URL}/group/${groupId}/invite`);
    }
  }, [isMounted, groupId, router]);

  const handleJoinGroup = async () => {
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
      // Send the request to accept the group invite
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group/${groupId}/accept-invite`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '❌ Failed to join the group');
      } else {
        setError('❌ Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent render until mounted to avoid hydration errors
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10 md:px-10">
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <UserPlus className="w-6 h-6" />
          Join Group
        </h1>

        <button
          onClick={handleJoinGroup}
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-all"
        >
          {loading ? 'Joining...' : 'Join Group'}
        </button>

        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}

        <div className="mt-10 bg-gray-800 p-4 rounded-xl shadow-md w-full">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Shareable Join Link
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareableLink}
              className="flex-1 p-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareableLink);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
            >
              Copy
            </button>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: 'Join My Group on Sol-Walk',
                    text: 'Join my group challenge now!',
                    url: shareableLink,
                  })
                  .catch((err) => console.error('Share failed:', err));
              } else {
                navigator.clipboard.writeText(shareableLink);
                alert('Copied to clipboard!');
              }
            }}
            className="mt-3 flex items-center gap-2 text-sm text-green-400 hover:underline"
          >
            <Share2 className="w-4 h-4" /> Share via Device
          </button>
        </div>

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

export default JoinGroupPage;
