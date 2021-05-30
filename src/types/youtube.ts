type YouTubeThumbnails = {
   url: string
   width: number
   height: number
}

export type YouTubeSearchItem = {
   kind: "youtube#searchResult"
   etag: string
   id: {
      kind: string
      videoId: string
      channelId: string
      playlistId: string
   }
   snippet: {
      publishedAt: Date
      channelId: string
      title: string
      description: string
      thumbnails: {
         default: YouTubeThumbnails
         medium: YouTubeThumbnails
         high: YouTubeThumbnails
      }
   }
}

export type YouTubeVideoItem = {
   contentDetails: {
      caption: string
      contentRating: Record<string, never>
      definition: string
      dimension: string
      duration: string
      licensedContent: boolean
      projection: string
   }
   etag: string
   id: string
   kind: "youtube#video"
}

export type YouTubeSearchResponse = {
   etag: string
   items: YouTubeSearchItem[]
   kind: "youtube#searchListResponse"
   nexPageToken: string
   regionCode: string
   pageInfo: {
      resultsPerPage: number
      totalResults: number
   }
}

export type YouTubeVideoResponse = {
   etag: string
   items: YouTubeVideoItem[]
   kind: "youtube#videoListResponse"
   pageInfo: {
      resultsPerPage: number
      totalResults: number
   }
}

export type YouTubeVideo = YouTubeSearchItem & { duration: string }
