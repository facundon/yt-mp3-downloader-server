export const downloadFolder = "./downloads/"
export const upgradeYtDlScript = "pip2 install --upgrade youtube-dl"
export const dlOptions = [
   "-f bestaudio/best",
   "--extract-audio",
   "--audio-format mp3",
   "--audio-quality 3",
   `-o '${downloadFolder}%(title)s.%(ext)s'`,
]
