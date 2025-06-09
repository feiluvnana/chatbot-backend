import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { QueryCommon } from "../common/query";
import { Database } from "../database/database";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL!,
    },
    async (_, __, profile, done) => {
      try {
        await Database.transaction().execute(async (trx) => {
          const user = await QueryCommon.getUserByGoogleProviderDataId(trx, { id: profile.id });
          if (user !== undefined) {
            done(null, user);
          } else {
            await trx
              .insertInto("users")
              .values([
                {
                  state: "unactivated",
                  provider: "google",
                  provider_data: JSON.stringify({
                    id: profile.id,
                    emails: profile.emails,
                    name: profile.displayName,
                  }),
                },
              ])
              .execute();
          }

          await Database.transaction().execute(async (trx) => {
            const user = await QueryCommon.getUserByGoogleProviderDataId(trx, { id: profile.id });
            done(null, user);
          });
        });
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport;
