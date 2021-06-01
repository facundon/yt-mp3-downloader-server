import {
   YouTubeSearchItem,
   YouTubeVideoItem,
   YouTubeVideo,
} from "../types/youtube"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { convertYouTubeDuration } from "duration-iso-8601"

export const checkYoutubeEnvVariables = () => {
   if (!process.env.YOUTUBE_API_URL || !process.env.YOUTUBE_API_KEY)
      throw Error("Need env YOUTUBE_API_URL and YOUTUBE_API_KEY")
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
