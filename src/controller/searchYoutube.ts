import axios, { AxiosResponse } from "axios"
import { Request, Response } from "express"
import { checkEnvVariables } from "../utils/etc"
import { appendVideoDuration, getVideosId } from "../utils/youtube"

import { YouTubeSearchResponse, YouTubeVideoResponse } from "../types/youtube"

export async function searchYoutube(req: Request, res: Response) {
   if (!checkEnvVariables()) return res.send(501)
   const youtubeApi = axios.create({
      params: {
         type: "video",
         maxResults: 9,
         key: process.env.YOUTUBE_API_KEY,
      },
      baseURL: process.env.YOUTUBE_API_URL,
   })
   try {
      const searchResponse: AxiosResponse<YouTubeSearchResponse> =
         await youtubeApi.get("/search", {
            params: {
               q: req.query.search_term,
               part: "snippet",
            },
         })
      const videosId = getVideosId(searchResponse.data.items)
      const videosResponse: AxiosResponse<YouTubeVideoResponse> =
         await youtubeApi.get("/videos", {
            params: {
               part: "contentDetails",
               id: videosId,
            },
         })
      res.status(200).json(
         appendVideoDuration(
            searchResponse.data.items,
            videosResponse.data.items
         )
      )
   } catch (error) {
      if (error.response) {
         // The request was made and the server responded with a status code
         // that falls out of the range of 2xx
         res.status(403).json({
            message: [error.response.status, error.response.data],
         })
      } else if (error.request) {
         // The request was made but no response was received
         res.status(500).json({ message: error.request })
      } else {
         // Something happened in setting up the request that triggered an Error
         res.status(500).json({ message: error.message })
      }
      res.status(400).json({ message: error.config })
   }
}
