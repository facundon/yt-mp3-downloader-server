import { Request, Response } from "express"
import { exec } from "child_process"
import { rm } from "fs"
import { getSongPath } from "../utils"

const upgradeYtDlScript = "pip2 install --upgrade youtube-dl"
const dlOptions = [
   "-f bestaudio/best",
   "--extract-audio",
   "--audio-format mp3",
   "--audio-quality 3",
   "-o './downloads/%(title)s.%(ext)s'",
]

export function videoDownload(req: Request, res: Response) {
   const videoId = req.query.id
   let retry = 0
   function execDownload() {
      if (retry === 1) return
      exec(
         `youtube-dl ${dlOptions.join(" ")} ${videoId}`,
         (err, stdout, stderr) => {
            if (err || stderr) {
               exec(upgradeYtDlScript, err => {
                  !err && console.info("Updated youtube-dl. Trying again...")
                  retry++
                  execDownload()
               })
            }
            const songPath = getSongPath(stdout)
            res.download(songPath, err => {
               if (!err) console.info("Completed!")
               else if (!res.headersSent) res.status(500).json(err)
            })
            rm(songPath, err => err && console.log(err))
         }
      )
   }
   execDownload()
}
