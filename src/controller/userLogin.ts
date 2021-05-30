import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { User } from "../models/User"

export async function userLogin(req: Request, res: Response) {
   if (req.isAuthenticated()) {
      const userRepository = getRepository(User)
      const user = await userRepository.findOne({ id: req.user.id })
      return res.status(202).json({
         name: user?.name,
         email: user?.email,
         videosId: user?.videosId,
      })
   } else {
      return res.status(401).json({ message: "Wrong email or password" })
   }
}
