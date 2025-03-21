import React from 'react';

interface CountdownTimerProps {
  endDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  // Basic timer display (you can enhance this)
  return (
    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl shadow">
      <h3 className="font-bold mb-2">Countdown</h3>
      <p>{endDate}</p>
    </div>
  );
};

export default CountdownTimer;
