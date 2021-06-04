import { Request, Response } from "express"
import { exec } from "child_process"
import { rm } from "fs"

import { getRepository } from "typeorm"
import { getSongPath, zipFolder } from "../utils"
import { Video } from "../models/Video"

const downloadFolder = "./downloads/"
const upgradeYtDlScript = "pip2 install --upgrade youtube-dl"
const dlOptions = [
   "-f bestaudio/best",
   "--extract-audio",
   "--audio-format mp3",
   "--audio-quality 3",
   `-o '${downloadFolder}%(title)s.%(ext)s'`,
]

export async function videoDownload(req: Request, res: Response) {
   let videosId = req.query.id
   let multiDownload = false
   if (videosId === "all") {
      const videos = await getRepository(Video).find({ user: req.user.id })
      videosId = videos.map(video => video.videoId).join(" ")
      multiDownload = true
   }
   let retry = 0

   const sendFile = (filePath: string) => {
      res.download(filePath, err => {
         if (!err) console.info("Completed!")
         else if (!res.headersSent) res.status(500).json(err)
      })
      rm(filePath, err => err && console.error(err))
   }

   function execDownload() {
      if (retry === 1) return
      exec(
         `youtube-dl ${dlOptions.join(" ")} ${videosId}`,
         (err, stdout, stderr) => {
            if (err || stderr) {
               exec(upgradeYtDlScript, err => {
                  !err && console.info("Updated youtube-dl. Trying again...")
                  retry++
                  execDownload()
               })
            }
            if (multiDownload) {
               zipFolder(downloadFolder, filePath => sendFile(filePath))
               return
            }
            const songPath = getSongPath(stdout)
            sendFile(songPath)
         }
      )
   }
   execDownload()
}
