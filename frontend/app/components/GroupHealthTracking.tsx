"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface HealthData {
  totalSteps: number | null;
  connected: boolean;
}

interface GroupHealthTrackingProps {
  userId: string;
}

const GroupHealthTracking: React.FC<GroupHealthTrackingProps> = ({ userId }) => {
  const [googleFitData, setGoogleFitData] = useState<HealthData>({ totalSteps: null, connected: true });
  const [fitbitData, setFitbitData] = useState<HealthData>({ totalSteps: null, connected: true });
  const [loading, setLoading] = useState(true);

  // Function to fetch steps from the backend
  const fetchHealthData = async () => {
    try {
      const [googleResponse, fitbitResponse] = await Promise.allSettled([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google-fit/steps/${userId}`),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fitbit/steps/${userId}`)
      ]);

      if (googleResponse.status === "fulfilled" && googleResponse.value.data) {
        setGoogleFitData({ totalSteps: googleResponse.value.data.totalSteps, connected: true });
      } else {
        setGoogleFitData({ totalSteps: null, connected: false });
      }

      if (fitbitResponse.status === "fulfilled" && fitbitResponse.value.data) {
        setFitbitData({ totalSteps: fitbitResponse.value.data.totalSteps, connected: true });
      } else {
        setFitbitData({ totalSteps: null, connected: false });
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch health data when the component mounts
  useEffect(() => {
    if (userId) fetchHealthData();
  }, [userId]);

  // Redirect user to backend OAuth authentication
  const handleGoogleFitConnect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google-fit/auth?userId=${userId}`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold border-b pb-2 border-gray-700 mb-4">📊 Health Tracking:</h2>

      {loading ? (
        <p className="text-gray-400">Loading health data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Fit */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white">Google Fit Steps</h3>
            {googleFitData.connected ? (
              <p className="text-2xl font-bold text-indigo-400">{googleFitData.totalSteps ?? "No data"}</p>
            ) : (
              <div>
                <p className="text-gray-400 mb-2">Google Fit not connected.</p>
                <button
                  onClick={handleGoogleFitConnect}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Connect Now
                </button>
              </div>
            )}
          </div>

          {/* Fitbit */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white">Fitbit Steps</h3>
            {fitbitData.connected ? (
              <p className="text-2xl font-bold text-green-400">{fitbitData.totalSteps ?? "No data"}</p>
            ) : (
              <p className="text-gray-400">Fitbit not connected. <a href="/connect/fitbit" className="text-blue-400 underline">Connect Now</a></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupHealthTracking;
