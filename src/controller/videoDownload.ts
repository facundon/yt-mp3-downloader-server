import { Request, Response } from "express"

export function videoDownload(req: Request, res: Response) {
   if (req.isAuthenticated()) {
      res.send("es por aca")
   } else return res.sendStatus(403)
}
