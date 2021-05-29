import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { validate } from "class-validator"
import { genPassword } from "../auth/utils"
import { User } from "../models/User"

export async function userCreate(req: Request, res: Response) {
   const userRepository = getRepository(User)

   const userExist = await userRepository.findOne({ email: req.body.email })
   if (userExist)
      return res.status(409).json({ message: "Email already in use" })
   if (!req.body.password)
      return res.status(400).json({ message: "Please enter a password" })

   const { salt, hash } = genPassword(req.body.password)
   const user = userRepository.create({
      email: req.body.email,
      name: req.body.name,
      hash,
      salt,
      videosId: [],
   })

   const validationErrors = await validate(user)
   if (validationErrors.length > 0)
      return res
         .status(400)
         .json({ message: Object.values(validationErrors[0].constraints!)[0] })

   const result = await userRepository.save(user)
   if (!result)
      return res.status(500).json({ message: "Error creating a new user" })
   res.sendStatus(201)
}
