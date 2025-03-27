import { Request, Response } from 'express';
import querystring from 'querystring';
import axios from 'axios';
import { getStepsFromFitbitAPI } from '../services/fitbitService';

const CLIENT_ID = process.env.FITBIT_CLIENT_ID!;
const CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET!;
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI!;
const TOKEN_ENDPOINT = 'https://api.fitbit.com/oauth2/token';

// Temporary storage (for debugging only)
const userTokens: { [userId: string]: { accessToken: string; refreshToken: string } } = {};

// Get Fitbit OAuth URL
export const getFitbitAuthURL = (_: Request, res: Response) => {
  const scope = 'activity heartrate location nutrition profile settings sleep social weight';
  const query = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope,
    redirect_uri: REDIRECT_URI,
  });

  console.log(`[DEBUG] Redirecting to Fitbit Auth URL`);
  res.redirect(`https://www.fitbit.com/oauth2/authorize?${query}`);
};

// Handle Fitbit OAuth callback
export const fitbitCallbackHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      TOKEN_ENDPOINT,
      querystring.stringify({
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    const { access_token, refresh_token, user_id } = response.data;

    console.log(`[DEBUG] Received Access Token for User ${user_id}:`, access_token);

    // ✅ Store the token in memory
    userTokens[user_id] = { accessToken: access_token, refreshToken: refresh_token };

    res.json({ access_token, refresh_token, user_id });
  } catch (err: any) {
    console.error(`[ERROR] Fitbit Token Exchange Failed:`, err.response?.data || err.message);
    res.status(500).json({ message: 'Token exchange failed' });
  }
};

// Fetch Fitbit steps
export const getStepsFromFitbit = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  console.log(`[DEBUG] Fetching steps for user: ${userId}`);

  if (!userTokens[userId]) {
    console.error(`[ERROR] No access token found for user: ${userId}`);
    res.status(400).json({ message: 'User not linked with Fitbit' });
    return;
  }

  const accessToken = userTokens[userId].accessToken;
  console.log(`[DEBUG] Using Fitbit Access Token: ${accessToken}`);

  try {
    const steps = await getStepsFromFitbitAPI(accessToken);
    console.log(`[DEBUG] Steps data received:`, steps);

    res.json({ steps });
  } catch (err: any) {
    console.error(`[ERROR] Fetching steps failed:`, err.response?.data || err.message);
    res.status(500).json({ message: 'Error fetching steps' });
  }
};

