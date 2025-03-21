import React from 'react';

interface GroupMembersListProps {
  members: string[];
  currentUserId: string;
}

const GroupMembersList: React.FC<GroupMembersListProps> = ({
  members,
  currentUserId,
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-2">👤 Members:</h2>
      {members.length > 0 ? (
        <ul className="space-y-1 list-disc list-inside">
          {members.map((memberId) => (
            <li key={memberId}>
              {memberId} {memberId === currentUserId && '(You)'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No members yet.</p>
      )}
    </div>
  );
};

export default GroupMembersList;
