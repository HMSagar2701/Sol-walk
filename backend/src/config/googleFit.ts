import dotenv from "dotenv";
dotenv.config();

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8080';

export const REDIRECT_URI = `${CLIENT_URL}/api/google-fit/callback`;

export const SCOPES = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.activity.write',
    'https://www.googleapis.com/auth/fitness.body.read'
];
