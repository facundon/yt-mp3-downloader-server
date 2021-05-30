import { Request, Response } from "express"

export function videoDownload(req: Request, res: Response) {
   res.json({ message: "llego!!" })
}
