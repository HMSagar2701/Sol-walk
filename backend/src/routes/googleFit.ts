import express, { Router, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import UserToken from '../models/UserToken';

dotenv.config();

const router: Router = express.Router();

const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET!;
const CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:8080';
const REDIRECT_URI: string = `${CLIENT_URL}/api/google-fit/callback`;

const SCOPES: string[] = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read'
];

// 🚀 STEP 1: Redirect to Google OAuth
router.get('/auth', (req: Request, res: Response): void => {
  const userId: string = req.query.userId as string;
  if (!userId) {
    res.status(400).json({ error: "Missing userId parameter" });
    return;
  }
  const url: string = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(' ')}` +
    `&access_type=offline&prompt=consent&state=${userId}`;
  res.redirect(url);
});

// 🚀 STEP 2: Callback & Token Exchange
router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const code: string | undefined = req.query.code as string;
  const userId: string | undefined = req.query.state as string;
  
  if (!code || !userId) {
    res.status(400).json({ error: "Invalid request parameters" });
    return;
  }

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const expiryDate = new Date(Date.now() + expires_in * 1000);

    await UserToken.findOneAndUpdate(
      { userId, provider: 'GoogleFit' },
      { accessToken: access_token, refreshToken: refresh_token, expiryDate },
      { upsert: true, new: true }
    );

    res.send('Google Fit connected successfully!');
  } catch (err) {
    const axiosErr = err as AxiosError;
    console.error('❌ OAuth Failed:', axiosErr.response?.data || axiosErr.message);
    res.status(500).send('OAuth Failed');
  }
});

// 🚀 STEP 3: Fetch Steps
router.get('/steps/:userId', async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    console.log(`🔍 Fetching steps for userId: ${userId}`);

    const userToken = await UserToken.findOne({ userId, provider: 'GoogleFit' });

    if (!userToken) {
      console.warn(`⚠️ UserToken not found for userId: ${userId}`);
      res.status(404).json({ error: 'Google Fit not connected for this user.' });
      return;
    }

    if (!userToken.accessToken) {
      console.error(`❌ Access token missing for userId: ${userId}`);
      res.status(401).json({ error: 'Access token missing' });
      return;
    }

    // 🔄 Refresh Token if Expired
    if (userToken.expiryDate < new Date()) {
      console.log('🔄 Refreshing Access Token...');
      const newAccessToken = await refreshAccessToken(userToken.refreshToken);
      if (newAccessToken) {
        userToken.accessToken = newAccessToken;
        await userToken.save();
      } else {
        res.status(401).json({ error: 'Failed to refresh access token' });
        return;
      }
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const requestBody = {
      aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: oneDayAgo,
      endTimeMillis: now,
    };

    const fitResponse = await axios.post(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      requestBody,
      { headers: { Authorization: `Bearer ${userToken.accessToken}`, 'Content-Type': 'application/json' } }
    );

    console.log('✅ Google Fit API response:', JSON.stringify(fitResponse.data, null, 2));

    const buckets = fitResponse.data.bucket || [];
    let totalSteps = 0;

    for (const bucket of buckets) {
      if (bucket.dataset) {
        for (const dataset of bucket.dataset) {
          if (dataset.point) {
            for (const point of dataset.point) {
              if (point.value) {
                for (const value of point.value) {
                  if (value.intVal) {
                    totalSteps += value.intVal;
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log(`👣 Total Steps for userId ${userId}: ${totalSteps}`);
    res.status(200).json({ totalSteps });

  } catch (err) {
    const axiosErr = err as AxiosError;
    console.error('❌ Error Fetching Steps:', axiosErr.response?.data || axiosErr.message);
    res.status(500).json({ error: 'Failed to fetch step count', details: axiosErr.response?.data || axiosErr.message });
  }
});

// 🚀 Helper: Refresh Access Token
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });
    return response.data.access_token;
  } catch (err) {
    console.error('❌ Failed to refresh access token:', err);
    return null;
  }
}

export const googleFitCallback = async (req: Request, res: Response) => {
    try {
        const { state, code } = req.query;

        if (!state || !code) {
            return res.status(400).json({ message: "Missing state or code" });
        }

        // Exchange the code for an access token
        const accessToken = await exchangeCodeForToken(code as string);

        // Optional: Fetch and process Google Fit data
        const fitnessData = await fetchGoogleFitData(accessToken);

        // Ensure CLIENT_URL is set
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

        // Redirect to the frontend group page
        return res.redirect(`${clientUrl}/group/${state}`);
    } catch (error) {
        console.error("Google Fit OAuth Callback Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export default router;
function exchangeCodeForToken(arg0: string) {
  throw new Error('Function not implemented.');
}

function fetchGoogleFitData(accessToken: any) {
  throw new Error('Function not implemented.');
}

