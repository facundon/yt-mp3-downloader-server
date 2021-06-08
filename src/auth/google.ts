// import { Request } from "express"
// import passport from "passport"
// import Google from "passport-google-oauth20"
// import { getRepository } from "typeorm"
// import { User } from "../models/User"
// import { checkEnvVariables } from "../utils"
// import { genPassword, userExists } from "./utils"

// const verify = async (
//    req: Request,
//    accessToken: string,
//    refreshToken: string,
//    params: Google.GoogleCallbackParameters,
//    profile: Google.Profile,
//    done: (error?: Error | null, user?: User | false, info?: unknown) => void
// ) => {
//    try {
//       const userEntity = getRepository(User)
//       if (profile.emails) {
//          const user = await userExists(profile.emails)
//          if (user) {
//             done(null, user)
//          } else {
//             const { salt, hash } = genPassword(accessToken)
//             const newUser = userEntity.create({
//                email: profile.emails[0].value,
//                name: profile.displayName,
//                videos: [],
//                salt,
//                hash,
//             })
//             const result = await userEntity.save(newUser)
//             done(null, result)
//          }
//       }
//    } catch (err) {
//       done(err, false)
//    }
// }

// export default function implementGoogleStrategy() {
//    if (!checkEnvVariables()) return
//    const googleStrat = new Google.Strategy(
//       {
//          clientID: process.env.GOOGLE_CLIENT_ID!,
//          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//          callbackURL: "/google/return",
//          passReqToCallback: true,
//       },
//       verify
//    )
//    passport.use(googleStrat)
// }
