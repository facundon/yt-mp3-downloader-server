import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { User } from "../models/User"
import { Video } from "../models/Video"
import { checkVideoDuplicates } from "../utils/etc"

export async function addFavorite(req: Request, res: Response) {
   if (!req.params.id || !req.body.title) return
   const userId = req.user.id
   const user = await getRepository(User).findOne({ id: userId })
   if (!userId || !user) {
      res.status(500).json({ message: "Couldn't find user" })
      return
   }
   const isDuplicated = await checkVideoDuplicates(req.params.id, user)
   if (isDuplicated) {
      res.status(400).json({ message: "User already has that video" })
      return
   }

   const videoRepo = getRepository(Video)
   try {
      const newFav = videoRepo.create({
         videoId: req.params.id,
         title: req.body.title,
         user: userId,
      })
      await videoRepo.save(newFav)
      const videos = await videoRepo.find({ user })
      res.status(202).send(videos)
   } catch (err) {
      res.status(400).json({ message: err.message })
   }
}
