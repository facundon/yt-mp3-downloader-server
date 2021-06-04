import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Video } from "../models/Video"

export async function getFavorites(req: Request, res: Response) {
   try {
      const videos = await getRepository(Video).find({ user: req.user.id })
      res.status(200).json(videos)
   } catch (err) {
      res.status(500).json({
         message: err.message || "Error while fetching videos",
      })
   }
}
