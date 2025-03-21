import React from 'react';

interface ChallengeStatusProps {
  status: string;
}

const ChallengeStatus: React.FC<ChallengeStatusProps> = ({ status }) => {
  let color = '';
  switch (status.toUpperCase()) {
    case 'UPCOMING':
      color = 'text-yellow-500';
      break;
    case 'ACTIVE':
      color = 'text-green-500';
      break;
    case 'COMPLETED':
      color = 'text-blue-500';
      break;
    case 'FAILED':
      color = 'text-red-500';
      break;
    default:
      color = 'text-gray-500';
  }

  return (
    <div className={`font-semibold text-lg ${color}`}>
      Challenge Status: {status}
    </div>
  );
};

export default ChallengeStatus;
