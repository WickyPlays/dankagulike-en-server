import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { dbPromise } from "./database";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// JWT Strategy
passport.use(
  new JwtStrategy(opts as any, async (jwtPayload, done) => {
    try {
      const db = await dbPromise;
      const user = await db.get("SELECT * FROM googleusers WHERE id = ?", [jwtPayload.id]);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await dbPromise;
        const email = profile.emails?.[0].value;

        let user = await db.get("SELECT * FROM googleusers WHERE email = ?", [email]);

        if (!user) {
          const result = await db.run("INSERT INTO googleusers (email) VALUES (?)", [email]);
          const userId = result.lastID;
          const username = `dkp_${userId}`;
          await db.run("UPDATE googleusers SET username = ? WHERE id = ?", [username, userId]);

          // Fetch the updated user
          user = await db.get("SELECT * FROM googleusers WHERE id = ?", [userId]);
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const db = await dbPromise;
    const user = await db.get("SELECT * FROM googleusers WHERE id = ?", [id]);
    done(null, user || null);
  } catch (error) {
    done(error, null);
  }
});
