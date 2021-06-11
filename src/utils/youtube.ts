// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { convertYouTubeDuration } from "duration-iso-8601"
import {
   YouTubeSearchItem,
   YouTubeVideoItem,
   YouTubeVideo,
} from "../types/youtube"

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
