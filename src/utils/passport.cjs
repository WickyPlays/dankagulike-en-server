const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { dbPromise } = require("./database.cjs");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// JWT Strategy
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const db = await dbPromise;
      const user = await db.get("SELECT * FROM googleusers WHERE googleId = ?", [jwtPayload.googleId]);
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
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await dbPromise;
        const googleId = profile.id; // Use Google ID instead of email

        let user = await db.get("SELECT * FROM googleusers WHERE googleId = ?", [googleId]);

        if (!user) {
          const result = await db.run("INSERT INTO googleusers (googleId) VALUES (?)", [googleId]);
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await dbPromise;
    const user = await db.get("SELECT * FROM googleusers WHERE id = ?", [id]);
    done(null, user || null);
  } catch (error) {
    done(error, null);
  }
});