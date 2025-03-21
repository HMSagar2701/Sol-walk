import React from 'react';
import { User } from 'lucide-react';

interface Member {
  name: string;
  email: string;
  walletAddress?: string;
}

interface GroupMemberListProps {
  members: Member[];
}

const GroupMemberList: React.FC<GroupMemberListProps> = ({ members }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Group Members</h3>
      <ul className="space-y-2">
        {members.map((member, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-blue-500" />
            <span>{member.name || member.email}</span>
            {member.walletAddress && (
              <span className="ml-auto text-xs text-gray-500 truncate">
                {member.walletAddress}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMemberList;
