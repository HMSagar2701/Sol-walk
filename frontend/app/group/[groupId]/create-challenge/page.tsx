/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateChallengeForm() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string;

  const [form, setForm] = useState({
    challengeName: '',
    targetSteps: '',
    entryFee: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(form).some((val) => !val)) {
      toast.error('Please fill in all fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to create a challenge.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        groupId,
        challengeName: form.challengeName,
        challengeGoal: Number(form.targetSteps),
        bidAmount: parseFloat(form.entryFee),
        currency: 'SOL',
        startDate: form.startDate,
        endDate: form.endDate,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group-challenges/create-group-challenge`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Challenge created successfully! Redirecting...');

      // Redirect to group page after short delay
      setTimeout(() => {
        router.push(`/group/${groupId}`);
      }, 2000);

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-[#0e0e1a] to-black text-white px-6 md:px-10 py-20">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 md:p-16">
        
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 px-2 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white leading-tight tracking-wide">
            Create Group Challenge
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
            Form your challenge, stake your SOL, and inspire your group to hit the steps goal together.
          </p>
          <div className="text-sm text-gray-400 border-t border-white/10 pt-4">
            <strong className="text-gray-300">Group ID:</strong>{' '}
            <span className="break-all text-gray-400">{groupId}</span>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 px-2 md:px-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              <div className="col-span-1 md:col-span-2">
                <label className="block text-base font-medium mb-2 text-gray-300">Challenge Name</label>
                <input
                  type="text"
                  name="challengeName"
                  value={form.challengeName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-700 bg-black/40 px-6 py-4 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g. Solana Steps Challenge"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2 text-gray-300">Target Steps</label>
                <input
                  type="number"
                  name="targetSteps"
                  value={form.targetSteps}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-2xl border border-gray-700 bg-black/40 px-6 py-4 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g. 10000"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2 text-gray-300">Entry Fee (SOL)</label>
                <input
                  type="number"
                  name="entryFee"
                  value={form.entryFee}
                  onChange={handleChange}
                  step="any"
                  min="0.000001"
                  className="w-full rounded-2xl border border-gray-700 bg-black/40 px-6 py-4 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="e.g. 0.01"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2 text-gray-300">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-700 bg-black/40 px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2 text-gray-300">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-700 bg-black/40 px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 transition duration-200 text-white font-bold text-lg py-4 rounded-2xl disabled:opacity-60"
              >
                {loading ? 'Creating Challenge...' : 'Create Challenge'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
