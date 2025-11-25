/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { User } from "../models/user/user.model";
import {
    Strategy as GoogleStrategy,
    Profile,
    VerifyCallback,
} from "passport-google-oauth20";
import { envVers } from "./env";
import { Role } from "../models/user/user.interface";

passport.use(
    new GoogleStrategy(
        {
            clientID: envVers.GOOGLE_CLIENT_ID,
            clientSecret: envVers.GOOGLE_CLIENT_SECRET,
            callbackURL: envVers.GOOGLE_CALLBACK_URL,
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    done(null, false, { message: "No email found" });
                }
                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id,
                            },
                        ],
                    });
                }
                return done(null, user);
            } catch (error) {
                console.log("Google strategy error", error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});
