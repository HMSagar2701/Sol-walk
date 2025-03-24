'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import WalletConnectButton from '@/app/components/Group/WalletConnectButton';
import CreateGroupForm from '@/app/components/Group/CreateGroupForm';
import GroupList from '@/app/components/Group/GroupList';

const DashboardPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const now = new Date().getTime();

    // If token came from URL
    if (urlToken) {
      const expiryTime = now + 10 * 60 * 60 * 1000; // 10 hours in ms
      localStorage.setItem('token', urlToken);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      setToken(urlToken);

      // Clean URL after storing token
      const cleanUrl = window.location.origin + '/dashboard';
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      // Check from localStorage
      const storedToken = localStorage.getItem('token');
      const expiry = localStorage.getItem('tokenExpiry');
      const expiryTime = expiry ? parseInt(expiry) : 0;

      if (storedToken && expiryTime > now) {
        setToken(storedToken);
      } else {
        // Token expired
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        setToken(null);
      }
    }

    setLoading(false);

    // Auto-clear token when it expires
    const timeLeft = (parseInt(localStorage.getItem('tokenExpiry') || '0') - now);
    if (timeLeft > 0) {
      const timeout = setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        setToken(null);
      }, timeLeft);

      return () => clearTimeout(timeout);
    }
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
          <h2 className="text-3xl font-bold">Session Expired 🕒</h2>
          <p className="text-gray-400 text-lg">Please log in again to access your dashboard.</p>
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
