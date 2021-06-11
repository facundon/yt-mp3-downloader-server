import { createWriteStream, rm } from "fs"
import { exec } from "child_process"
import { create as createArchiver } from "archiver"
import { dlOptions, downloadFolder, upgradeYtDlScript } from "../config"

const getSongPath = (stdout: string) => {
   const searchReference = "[ffmpeg] Destination:"
   const fileExtension = ".mp3"
   const initSubstr = stdout.indexOf(searchReference) + searchReference.length
   const endSubstr = stdout.indexOf(fileExtension) + fileExtension.length
   return stdout.slice(initSubstr, endSubstr).trim()
}

export async function execDownload(
   videosId: string | string[],
   multiDownload: boolean,
   retries = 0
) {
   return new Promise((resolve: (val: string) => void, reject) => {
      let retry = 0
      if (retries && retry === retries) reject("Couldn't download video")

      exec(
         `youtube-dl ${dlOptions.join(" ")} ${videosId}`,
         (err, stdout, stderr) => {
            if (err || stderr) {
               exec(upgradeYtDlScript, err => {
                  !err && console.info("Updated youtube-dl. Trying again...")
                  retry++
                  retries && execDownload(videosId, multiDownload, retry)
               })
            }

            if (multiDownload) {
               zipFolder(downloadFolder, filePath => resolve(filePath))
               return
            }
            resolve(getSongPath(stdout))
            return
         }
      )
   })
}

const zipFolder = (folder: string, cb: (outputPath: string) => void) => {
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
