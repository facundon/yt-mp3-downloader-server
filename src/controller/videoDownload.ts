import { WebsocketRequestHandler } from "express-ws"
import { readFile } from "fs/promises"
// import { rm } from "fs"

import { getRepository } from "typeorm"
import { Video } from "../models/Video"
import { execDownload } from "../utils/download"

enum WSResponse {
   READY = "ready",
   RECIEVED = "recieved",
   ERROR = "error",
}

class Response {
   constructor(status: WSResponse, value: string | Buffer) {
      this.status = status
      this.value = value
   }
   status
   value

   getResponse() {
      return JSON.stringify({ status: this.status, value: this.value })
   }
}

export const videoDownload: WebsocketRequestHandler = (ws, req) => {
   ws.on("message", async msg => {
      const response = new Response(WSResponse.ERROR, "You are not logged in")
      if (!req.isAuthenticated()) {
         ws.send(response.getResponse())
         return
      }
      let videosId = msg as string | string[]
      let multiDownload = false
      if (videosId === "all") {
         const videos = await getRepository(Video).find({ user: req.user.id })
         videosId = videos.map(video => video.videoId).join(" ")
         multiDownload = true
      }
      response.status = WSResponse.RECIEVED
      response.value = "Recieved"
      ws.send(response.getResponse())
      try {
         const filePath = await execDownload(videosId, multiDownload, 1)
         const file = await readFile(filePath, { encoding: "base64" })
         response.status = WSResponse.READY
         response.value = file
         ws.send(response.getResponse())
         ws.close()
      } catch (err) {
         ws.send({ status: WSResponse.ERROR, value: err.message })
         ws.close()
      }
   })
}
