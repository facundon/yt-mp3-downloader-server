import { createWriteStream, rm } from "fs"
import { create as createArchiver } from "archiver"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { convertYouTubeDuration } from "duration-iso-8601"
import { getRepository } from "typeorm"

import { Video } from "../models/Video"
import { User } from "../models/User"

import {
   YouTubeSearchItem,
   YouTubeVideoItem,
   YouTubeVideo,
} from "../types/youtube"

export const checkEnvVariables = () => {
   if (!process.env.YOUTUBE_API_URL || !process.env.YOUTUBE_API_KEY)
      throw Error("Need env YOUTUBE_API_URL and YOUTUBE_API_KEY")
   if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET)
      throw Error("Need env FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET")
   if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      throw Error("Need env GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET")
   return true
}

export const getVideosId = (items: YouTubeSearchItem[]) => {
   let result = ""
   items.forEach(item => (result += item.id.videoId + ","))
   return result
}

export const appendVideoDuration = (
   searchItems: YouTubeSearchItem[],
   videoItems: YouTubeVideoItem[]
) => {
   const nextSearchItems: YouTubeVideo[] = Object.assign([], searchItems)
   searchItems.forEach((_, index) => {
      const videoDuration = videoItems[index].contentDetails.duration
      nextSearchItems[index]["duration"] = convertYouTubeDuration(videoDuration)
   })
   return nextSearchItems
}

export const getSongPath = (stdout: string) => {
   const searchReference = "[ffmpeg] Destination:"
   const fileExtension = ".mp3"
   const initSubstr = stdout.indexOf(searchReference) + searchReference.length
   const endSubstr = stdout.indexOf(fileExtension) + fileExtension.length
   return stdout.slice(initSubstr, endSubstr).trim()
}

export const checkVideoDuplicates = async (videoId: string, user: User) => {
   const videos = await getRepository(Video).find({ user })
   return Boolean(videos.filter(vid => vid.videoId === videoId).length)
}

export const zipFolder = (folder: string, cb: (outputPath: string) => void) => {
   const filePath = "./Favorites.zip"
   const output = createWriteStream(filePath)
   const archive = createArchiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
   })
   output.on("close", function () {
      console.log(archive.pointer() + " total bytes")
      console.log(
         "archiver has been finalized and the output file descriptor has closed."
      )
   })
   output.on("end", function () {
      console.log("Data has been drained")
   })
   archive.on("warning", function (err) {
      console.log(err)
      if (err.code === "ENOENT") {
         console.error(err.message)
      } else {
         throw err
      }
   })
   archive.on("error", function (err) {
      throw err
   })
   archive.pipe(output)
   archive.directory(folder, false)
   archive.finalize()
   archive.on("finish", () => {
      rm(folder, { recursive: true }, err => {
         err && console.error(err)
         cb(filePath)
      })
   })
}
