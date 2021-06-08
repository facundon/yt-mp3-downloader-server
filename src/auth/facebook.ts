import passport from "passport"
import Facebook from "passport-facebook-token"
import { getRepository } from "typeorm"
import { User, userMethod } from "../models/User"
import { checkEnvVariables } from "../utils"
import { genPassword, userExists } from "./utils"

const verify = async (
   accessToken: string,
   refreshToken: string,
   profile: Facebook.Profile,
   done: (error: unknown, user?: unknown, info?: unknown) => void
) => {
   try {
      const userEntity = getRepository(User)
      if (profile.emails[0].value) {
         const user = await userExists(profile.emails)
         if (user) {
            done(null, user)
         } else {
            const { salt, hash } = genPassword(accessToken)
            const newUser = userEntity.create({
               email: profile.emails[0].value,
               name: profile.displayName,
               videos: [],
               method: userMethod.FB,
               salt,
               hash,
            })
            const result = await userEntity.save(newUser)
            done(null, result)
         }
      } else {
         done("Please provide access to email from facebook account", false)
      }
   } catch (err) {
      done(err, false)
   }
}

export default function implementFacebookStrategy() {
   if (!checkEnvVariables()) return
   const facebookStrat = new Facebook(
      {
         clientID: process.env.FACEBOOK_CLIENT_ID!,
         clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
         profileFields: ["email", "id", "displayName"],
      },
      verify
   )
   passport.use(facebookStrat)
}
