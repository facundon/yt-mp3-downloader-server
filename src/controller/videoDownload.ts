import { Request, Response } from "express"

export function videoDownload(req: Request, res: Response) {
   // const videoId = req.query.id
   res.json({ message: "llego!!" })
}
