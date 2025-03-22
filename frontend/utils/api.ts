// utils/api.ts
import axios from 'axios';

export const fetchGroups = async (token: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/group/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("Fetched Groups Data (Axios):", response.data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Axios error fetching groups:", error.response?.data || error.message);
    throw new Error('Failed to fetch groups');
  }
};
