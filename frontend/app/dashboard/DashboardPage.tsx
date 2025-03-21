// app/dashboard/DashboardPage.tsx
'use client';
import React from 'react';
import { useToken } from '@/app/components/Group/useToken';
import CreateGroupForm from '@/app/components/Group/CreateGroupForm';
import WalletConnectButton from '@/app/components/Group/WalletConnectButton';

const DashboardPage: React.FC = () => {
  const { token, loading } = useToken();

  if (loading) {
    return (
      <p className="text-white text-center mt-10">🔄 Checking login status...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Sol-Walk Dashboard</h1>

      <div className="mb-6">
        <WalletConnectButton />
      </div>

      <CreateGroupForm token={token} />
    </div>
  );
};

export default DashboardPage;
