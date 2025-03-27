/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

interface GroupMembersProps {
  members: User[];
}

const GroupMembers: React.FC<GroupMembersProps> = ({ members }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold border-b pb-2 border-gray-700 mb-4">
        👤 Members:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.length > 0 ? (
          members.map((member) => {

            return (
              <div
                key={member._id}
                className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {member.picture ? (
                  <img
                    src={member.picture}
                    alt={member.name}
                    className="w-12 h-12 rounded-full border-2 border-indigo-500"
                    onError={(e) =>
                      (e.currentTarget.src = "/default-avatar.png")
                    }
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
            );
          })
        ) : (
          <p className="text-gray-400">No members found.</p>
        )}
      </div>
    </div>
  );
};

export default GroupMembers;
