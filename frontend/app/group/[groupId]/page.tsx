/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import LoadingScreen from '@/app/components/Group/LoadingScreen';
import AccessDenied from '@/app/components/Group/AccessDenied';
import GroupNotFound from '@/app/components/Group/GroupNotFound';
import { Plus, UserPlus } from 'lucide-react';

interface Group {
  _id: string;
  groupName: string;
  createdBy: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams() as { groupId: string };
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<User[]>([]);

  const decodeJWT = (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.id ?? null;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };

  const fetchUserDetails = async (userId: string, token: string) => {
    try {
      const response = await axios.get<User>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchGroupDetails = async (token: string, userId: string) => {
    try {
      const response = await axios.get<Group>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const groupData = response.data;
      const isMember = groupData.members.includes(userId);
      const isCreator = groupData.createdBy === userId;

      if (!isMember && !isCreator) {
        setAccessDenied(true);
        return;
      }

      setGroup(groupData);
      await fetchGroupMembers(groupData.members, token);
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

  const fetchGroupMembers = async (memberIds: string[], token: string) => {
    try {
      const response = await axios.post<User[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/members`,
        { memberIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        router.push('/login');
        return;
      }

      const userId = decodeJWT(token);
      if (!userId) {
        alert('Invalid token. Please login again.');
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      await fetchUserDetails(userId, token);
      await fetchGroupDetails(token, userId);
    };

    if (groupId) {
      init();
    }
  }, [groupId, router]);

  const handleCreateChallenge = () => {
    if (group) router.push(`/group/${group._id}/create-challenge`);
  };

  const handleInviteMember = () => {
    if (group) router.push(`/group/${group._id}/invite`);
  };

  if (loading) return <LoadingScreen />;
  if (accessDenied) return <AccessDenied />;
  if (!group) return <GroupNotFound />;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-12 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Group - 👥 {group.groupName}
          </h1>
          {user && (
            <p className="text-gray-400 mt-2 text-lg">
              Logged in as: <span className="text-white font-semibold">{user.name} ({user.email})</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
  <button
    onClick={handleCreateChallenge}
    className="flex items-center gap-2 px-8 py-3 text-lg font-medium text-white 
               bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out 
               rounded-full border border-gray-700 hover:opacity-90"
  >
    <Plus className="w-5 h-5 text-gray-300" />
    Create Challenge
  </button>
  
  <button
    onClick={handleInviteMember}
    className="flex items-center gap-2 px-8 py-3 text-lg font-medium text-white 
               bg-blue-700 hover:bg-blue-600 transition-all duration-300 ease-in-out 
               rounded-full border border-blue-800 hover:opacity-90"
  >
    <UserPlus className="w-5 h-5 text-gray-300" />
    Invite Member
  </button>
</div>

      </div>

      {/* Member List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold border-b pb-2 border-gray-700 mb-4">👤 Members:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {member.picture ? (
                  <img
                    src={member.picture}
                    alt={member.name}
                    className="w-12 h-12 rounded-full border-2 border-indigo-500"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 text-white text-lg font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-lg font-medium text-white">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No members found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;