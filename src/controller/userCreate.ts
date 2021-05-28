import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { genPassword } from "../auth/utils"
import { User } from "../models/User"

export async function userCreate(req: Request, res: Response) {
   const userRepository = getRepository(User)
   const userExist = await userRepository.findOne({ email: req.body.email })

   if (userExist) return res.send("email already in use")

   const { salt, hash } = genPassword(req.body.password)
   const user = userRepository.create({
      email: req.body.email,
      name: req.body.name,
      hash,
      salt,
      videosId: [],
   })
   const result = await userRepository.save(user)
   if (!result) return res.send("error creating a new user")
   res.redirect("/login")
}
