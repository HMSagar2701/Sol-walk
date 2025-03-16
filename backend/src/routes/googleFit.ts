import express, { Router, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import UserToken from '../models/UserToken';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, SCOPES } from '../config/googleFit';

const router: Router = express.Router();

// STEP 1 - Redirect to Google OAuth
router.get('/auth', (req: Request, res: Response): void => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}` +
    `&response_type=code&scope=${SCOPES.join(' ')}&access_type=offline&prompt=consent`;

  res.redirect(url);
});

// STEP 2 - Callback + Exchange code for tokens
router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

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
      {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiryDate,
      },
      { upsert: true, new: true }
    );

    res.send('Google Fit connected successfully!');
  } catch (err) {
    const axiosErr = err as AxiosError;
    console.error(axiosErr.response?.data || axiosErr.message);
    res.status(500).send('OAuth Failed');
  }
});

// STEP 3 - Fetch Step Count
router.get('/steps/:userId', async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const userToken = await UserToken.findOne({ userId, provider: 'GoogleFit' });

    if (!userToken || !userToken.accessToken) {
      res.status(404).json({ error: 'Google Fit not connected for this user.' });
      return;
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const requestBody = {
      aggregateBy: [{
        dataTypeName: 'com.google.step_count.delta',
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
      }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: oneDayAgo,
      endTimeMillis: now,
    };

    const fitResponse = await axios.post(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${userToken.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

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

    res.status(200).json({ totalSteps });
  } catch (err) {
    const axiosErr = err as AxiosError;
    console.error(axiosErr.response?.data || axiosErr.message);
    res.status(500).json({ error: 'Failed to fetch step count' });
  }
});

export default router;
