import { Request, Response } from "express"

export async function userLogin(req: Request, res: Response) {
   if (req.isAuthenticated()) {
      return res.sendStatus(202)
   } else {
      return res.status(401).send("Wrong email or password")
   }
}
