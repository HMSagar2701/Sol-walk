/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import LoadingScreen from "@/app/components/Group/LoadingScreen";
import AccessDenied from "@/app/components/Group/AccessDenied";
import GroupNotFound from "@/app/components/Group/GroupNotFound";
import GroupChallenges from "@/app/components/GroupChallenge";
import GroupHeader from "@/app/components/GroupHeader";
import GroupMembers from "@/app/components/GroupMembers";
import GroupHealthTracking from "@/app/components/GroupHealthTracking";

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
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.id ?? null;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
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
      console.error("Error fetching user details:", error);
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
      console.error("Error fetching group:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 404) {
          setAccessDenied(true);
        }
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
      console.error("Error fetching group members:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const userId = decodeJWT(token);
      if (!userId) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      await fetchUserDetails(userId, token);
      await fetchGroupDetails(token, userId);
    };

    if (groupId) init();
  }, [groupId, router]);

  if (loading) return <LoadingScreen />;
  if (accessDenied) return <AccessDenied />;
  if (!group) return <GroupNotFound />;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-12 py-12">
      <GroupHeader
        groupName={group.groupName}
        user={user}
        handleCreateChallenge={() => router.push(`/group/${group._id}/create-challenge`)}
        handleInviteMember={() => router.push(`/group/${group._id}/invite`)}
      />

      {/* 👥 Group Members Section */}
      <GroupMembers members={members} />

      {/* 🏆 Group Challenges Section */}
      <h2 className="text-2xl font-semibold border-b pb-2 border-gray-700 mb-4 mt-10">
  🏆 Group Challenges:
      </h2>
      <GroupChallenges groupId={group._id} userId={user?._id || ""} />
      <h2 className="text-2xl font-semibold border-b pb-2 border-gray-700 mb-4 mt-3"> </h2>

      {/* New Health Tracking Section */}
      <GroupHealthTracking userId={user?._id || ""} />
    </div>
  );
};

export default GroupDetailPage;
