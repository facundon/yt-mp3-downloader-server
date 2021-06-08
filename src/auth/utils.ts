import crypto from "crypto"
import { getRepository } from "typeorm"
import { User } from "../models/User"

export function genPassword(password: string) {
   const salt = crypto.randomBytes(32).toString("hex")
   const hash = crypto
      .pbkdf2Sync(password, salt, 20000, 64, "sha512")
      .toString("hex")
   return { salt, hash }
}

export function isValidPassword(password: string, hash: string, salt: string) {
   const hashVerify = crypto
      .pbkdf2Sync(password, salt, 20000, 64, "sha512")
      .toString("hex")
   return hashVerify === hash
}

export async function userExists(emails: { value: string; type?: string }[]) {
   const userEntity = getRepository(User)
   const users = []
   for (const email of emails) {
      const user = await userEntity.findOne({ email: email.value })
      users.push(user)
   }
   const exists = users.some(user => user !== undefined)
   if (exists) {
      const user = users.filter(user => user !== undefined)[0]
      return user!
   }
   return exists
}
