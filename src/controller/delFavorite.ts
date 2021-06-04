import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Video } from "../models/Video"

export async function delFavorite(req: Request, res: Response) {
   try {
      const response = await getRepository(Video).delete({ id: req.body.id })
      response.affected ? res.sendStatus(200) : res.sendStatus(404)
   } catch (err) {
      res.status(500).json({ message: err.message || "Couln't delete video" })
   }
}
