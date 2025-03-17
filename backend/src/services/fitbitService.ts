import axios from 'axios';

export const getStepsFromFitbitAPI = async (accessToken: string): Promise<number> => {
  const today = new Date().toISOString().split('T')[0];

  const res = await axios.get(
    `https://api.fitbit.com/1/user/-/activities/date/${today}.json`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data.summary.steps || 0;
};
