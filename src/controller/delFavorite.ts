import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Video } from "../models/Video"

export async function delFavorite(req: Request, res: Response) {
   try {
      let response
      const videoRepo = getRepository(Video)
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
         response = await videoRepo.delete({ user: req.user.id })
      } else {
         response = await videoRepo.delete({ id })
      }
      response.affected ? res.sendStatus(200) : res.sendStatus(404)
   } catch (err) {
      res.status(500).json({ message: err.message || "Couln't delete video" })
   }
}
