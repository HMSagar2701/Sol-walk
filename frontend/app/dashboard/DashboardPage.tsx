'use client';
import React, { useEffect, useState } from 'react';
import WalletConnectButton from '@/app/components/Group/WalletConnectButton';
import CreateGroupForm from '@/app/components/Group/CreateGroupForm';
import GroupList from '@/app/components/Group/GroupList';

const DashboardPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (jwt) setToken(jwt);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-lg animate-pulse">🔄 Loading dashboard...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-3xl font-bold">Unauthorized 🚫</h2>
          <p className="text-gray-400 text-lg">You must be logged in to access the dashboard.</p>
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">👣 Sol-Walk Dashboard</h1>
          <p className="text-gray-400 text-lg">Manage your groups, challenges, and progress effortlessly.</p>
        </div>

        {/* Top Right Wallet Button */}
        <div className="flex justify-end">
          <WalletConnectButton />
        </div>

        {/* Create Group Section */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-800 pb-2">➕ Create New Group</h2>
          <CreateGroupForm token={token} />
        </div>

        {/* Group List Section */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800 shadow-lg">
          <GroupList token={token} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
