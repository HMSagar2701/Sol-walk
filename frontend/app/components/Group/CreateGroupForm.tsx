'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CreateGroupFormProps {
  token: string | null;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ token }) => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateGroup = async () => {
    if (!groupName) return alert('Enter group name first');
    if (!token) return alert('Access token not found, please log in again.');

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group/create-group`,
        { groupName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('✅ Group Created Successfully!');
      router.push(`/group/${response.data._id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Error creating group:', error);
      alert(error?.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl max-w-md w-full space-y-4">
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter Group Name"
        className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <button
        onClick={handleCreateGroup}
        disabled={loading}
        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-medium disabled:opacity-50"
      >
        {loading ? 'Creating Group...' : 'Create Group'}
      </button>
    </div>
  );
};

export default CreateGroupForm;
