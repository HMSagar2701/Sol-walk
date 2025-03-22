'use client';
import React, { useEffect, useState } from 'react';
import { fetchGroups } from '@/utils/api';

interface User {
  _id: string;
  email: string;
}

interface Group {
  _id: string;
  groupName: string;
  createdBy: User;
  members: User[];
}

interface GroupListProps {
  token: string;
}

const GroupList: React.FC<GroupListProps> = ({ token }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGroups = async () => {
      try {
        console.log('Fetching groups with token:', token);
        const data = await fetchGroups(token);
        console.log('Fetched data:', data);

        // 🔥 Adjust this based on real shape of response
        setGroups(data.groups || data || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) getGroups();
  }, [token]);

  if (loading) return <p className="text-center text-gray-400">Loading groups...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">📋 Your Groups</h2>
      {groups.length === 0 ? (
        <p className="text-gray-400 text-center">No groups found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-1">{group.groupName}</h3>
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Created By:</span> {group.createdBy?.email || 'N/A'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                <span className="font-semibold">Members:</span>{' '}
                {group.members?.map((m) => m.email).join(', ') || 'No members'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
