/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import LoadingScreen from '@/app/components/Group/LoadingScreen';
import AccessDenied from '@/app/components/Group/AccessDenied';
import GroupNotFound from '@/app/components/Group/GroupNotFound';
import GroupDetailCard from '@/app/components/Group/GroupDetailCard';
import GroupMembersList from '@/app/components/Group/GroupMembersList';
import { Plus, UserPlus } from 'lucide-react';

interface Group {
  _id: string;
  groupName: string;
  createdBy: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

const GroupDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const decodeJWT = (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.id ?? null;
    } catch (error) {
      console.error('Failed to decode JWT', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        router.push('/login');
        return;
      }

      const currentUserId = decodeJWT(token);
      if (!currentUserId) {
        alert('Invalid token. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      setUserId(currentUserId);

      try {
        const response = await axios.get<Group>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const groupData = response.data;
        const isMember = groupData.members.includes(currentUserId);
        const isCreator = groupData.createdBy === currentUserId;

        if (!isMember && !isCreator) {
          setAccessDenied(true);
          return;
        }

        setGroup(groupData);
      } catch (error: any) {
        console.error('Error fetching group:', error);
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 403) {
            setAccessDenied(true);
          } else {
            alert(error.response?.data?.message || 'Failed to fetch group.');
          }
        } else {
          alert('Unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (groupId) fetchGroup();
  }, [groupId, router]);

  if (loading) return <LoadingScreen />;
  if (accessDenied) return <AccessDenied />;
  if (!group) return <GroupNotFound />;

  const handleCreateChallenge = () => {
    router.push(`/group/${group._id}/create-challenge`);
  };

  const handleInviteMember = () => {
    router.push(`/group/${group._id}/invite`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-10">
      <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          👥 Group: {group.groupName}
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCreateChallenge}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create Challenge
          </button>
          <button
            onClick={handleInviteMember}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-200"
          >
            <UserPlus className="w-5 h-5" />
            Invite Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GroupDetailCard
          groupName={group.groupName}
          createdBy={group.createdBy}
          createdAt={group.createdAt}
          currentUserId={userId!} groupId={''}        />
        <GroupMembersList members={group.members} currentUserId={userId!} />
      </div>
    </div>
  );
};

export default GroupDetailPage;
