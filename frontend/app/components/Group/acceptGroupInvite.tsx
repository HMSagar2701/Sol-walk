/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const JoinGroup = ({ groupId }: { groupId: string }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const joinGroupHandler = async () => {
    setIsJoining(true);
    setError(null);
    setMessage(null);

    try {
      // Assuming that you already have the token stored in your localStorage or context
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('User is not authenticated');
        setIsJoining(false);
        return;
      }

      // Send POST request to backend to accept the group invite
      const response = await axios.post(
        `/api/groups/${groupId}/accept-invite`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful joining
      setMessage(response.data.message || 'Joined the group successfully');
      setIsJoining(false);

      // Optionally, redirect to the group page after joining
      setTimeout(() => {
        router.push(`/group/${groupId}`);
      }, 1500);
    } catch (err: any) {
      setIsJoining(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error joining group');
      } else {
        setError('Error joining group');
      }
    }
  };

  return (
    <div className="join-group">
      <h2>Join Group</h2>
      <button 
        onClick={joinGroupHandler} 
        disabled={isJoining} 
        className="btn-join"
      >
        {isJoining ? 'Joining...' : 'Join Group'}
      </button>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default JoinGroup;
