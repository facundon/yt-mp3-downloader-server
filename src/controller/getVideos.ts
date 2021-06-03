import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Video } from "../models/Video"

export async function getVideos(req: Request, res: Response) {
   try {
      const videos = await getRepository(Video).find({ user: req.user.id })
      res.status(202).json(videos)
   } catch (err) {
      res.status(500).json({
         message: err.message || "Error while fetching videos",
      })
   }
}
