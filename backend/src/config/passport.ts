import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { jwtConfig } from '../config/jwt'; // <-- your secret config file
import { generateTokens } from '../utils/generateTokens'; // <-- token generator util

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8080/auth/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            picture: profile.photos?.[0]?.value,
          });
        }

        // 🔥 Generate access and refresh tokens
        const tokens = generateTokens(user._id.toString());

        // You can either pass tokens inside `user` object or directly return tokens via a custom callback
        // Option 1 (Safe): attach tokens on the `user` object so your `/auth/google/callback` route can access it
        (user as any).tokens = tokens;

        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as any)._id.toString());
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
