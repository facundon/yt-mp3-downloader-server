import crypto from "crypto"

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
