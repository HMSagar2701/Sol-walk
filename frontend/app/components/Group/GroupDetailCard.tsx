import React from 'react';

interface GroupDetailCardProps {
  groupId: string;
  groupName: string;
  createdBy: string;
  createdAt: string;
  currentUserId: string;
}

const GroupDetailCard: React.FC<GroupDetailCardProps> = ({
  groupId,
  groupName,
  createdBy,
  createdAt,
  currentUserId,
}) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl max-w-xl w-full space-y-4 border border-gray-700">
      <h2 className="text-2xl font-bold text-teal-400">{groupName}</h2>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-semibold text-gray-300">Group ID:</span>{' '}
          <span className="break-all text-gray-100">{groupId}</span>
        </p>
        <p>
          <span className="font-semibold text-gray-300">Created By:</span>{' '}
          <span className="text-gray-100">
            {createdBy}
            {createdBy === currentUserId && <span className="text-teal-400 ml-1">(You)</span>}
          </span>
        </p>
        <p>
          <span className="font-semibold text-gray-300">Created At:</span>{' '}
          <span className="text-gray-100">{new Date(createdAt).toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

export default GroupDetailCard;
