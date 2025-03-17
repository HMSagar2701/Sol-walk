import { Request, Response } from 'express';
import querystring from 'querystring';
import axios from 'axios';
import { getStepsFromFitbitAPI } from '../services/fitbitService';

const CLIENT_ID = process.env.FITBIT_CLIENT_ID!;
const CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET!;
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI!;
const TOKEN_ENDPOINT = 'https://api.fitbit.com/oauth2/token';

export const getFitbitAuthURL = (_: Request, res: Response) => {
  const scope = 'activity heartrate location nutrition profile settings sleep social weight';
  const query = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope,
    redirect_uri: REDIRECT_URI,
  });

  res.redirect(`https://www.fitbit.com/oauth2/authorize?${query}`);
};

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

    // TODO: Store user_id → access_token, refresh_token in DB
    res.json({ access_token, refresh_token, user_id });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Token exchange failed' });
  }
};

export const getStepsFromFitbit = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  // TODO: Fetch access token from DB using userId
  const accessToken = '<HARDCODE_OR_FETCH_FROM_DB>';

  try {
    const steps = await getStepsFromFitbitAPI(accessToken);
    res.json({ steps });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching steps' });
  }
};
