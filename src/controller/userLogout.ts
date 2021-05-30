import { Request, Response } from "express"

export function userLogout(req: Request, res: Response) {
   req.logOut()
   res.sendStatus(200)
}
