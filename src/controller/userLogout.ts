import { Request, Response } from "express"

export async function userLogout(req: Request, res: Response) {
   req.logOut()
   res.status(200)
}
