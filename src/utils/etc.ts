import { getRepository } from "typeorm"

import { Video } from "../models/Video"
import { User } from "../models/User"

export const checkEnvVariables = () => {
   if (!process.env.YOUTUBE_API_URL || !process.env.YOUTUBE_API_KEY)
      throw Error("Need env YOUTUBE_API_URL and YOUTUBE_API_KEY")
   if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET)
      throw Error("Need env FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET")
   if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      throw Error("Need env GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET")
   return true
}

export const checkVideoDuplicates = async (videoId: string, user: User) => {
   const videos = await getRepository(Video).find({ user })
   return Boolean(videos.filter(vid => vid.videoId === videoId).length)
}
