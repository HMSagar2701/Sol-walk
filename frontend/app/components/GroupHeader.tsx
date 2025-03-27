/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Plus, UserPlus } from "lucide-react";

interface GroupHeaderProps {
  groupName: string;
  user: { name: string; email: string } | null;
  handleCreateChallenge: () => void;
  handleInviteMember: () => void;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({
  groupName,
  user,
  handleCreateChallenge,
  handleInviteMember,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Group - 👥 {groupName}
        </h1>
        {user && (
          <p className="text-gray-400 mt-2 text-lg">
            Logged in as:{" "}
            <span className="text-white font-semibold">
              {user.name} ({user.email})
            </span>
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
  );
};

export default GroupHeader;
