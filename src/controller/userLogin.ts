import { Request, Response } from "express"

export async function userLogin(req: Request, res: Response) {
   if (req.isAuthenticated()) {
      res.send("Logeado papu")
   } else {
      res.send("Wrong user papu")
   }
}
