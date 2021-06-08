import passport from "passport"
import LocalStrategy from "passport-local"
import { getRepository } from "typeorm"

import { User } from "../models/User"
import { isValidPassword } from "./utils"

const customFields = {
   usernameField: "email",
   passwordField: "password",
}

const verify: LocalStrategy.VerifyFunction = async (
   username,
   password,
   done
) => {
   try {
      const userEntity = getRepository(User)
      const user = await userEntity.findOne({ email: username })
      if (!user) return done(null, false)
      const isValid = isValidPassword(password, user.hash, user.salt)
      if (isValid) {
         return done(null, user)
      } else {
         return done(null, false)
      }
   } catch (error) {
      return done(error, false)
   }
}

export default function implementLocalStrategy() {
   const localStrategy = new LocalStrategy.Strategy(customFields, verify)
   passport.use(localStrategy)

   passport.serializeUser((user: User, done) => {
      done(null, user.id)
   })

   passport.deserializeUser(async (userId: string, done) => {
      try {
         const userEntity = getRepository(User)
         const user = await userEntity.findOne({ id: userId })
         if (user) done(null, user)
         else done(null, false)
      } catch (error) {
         done(error)
      }
   })
}
