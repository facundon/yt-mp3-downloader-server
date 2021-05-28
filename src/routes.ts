import { Router } from "express"
import passport from "passport"
import { userLogin, userCreate } from "./controller"

const router = Router()

router.get("/login", (req, res) => {
   res.send(
      "<form method='post' action='/login'><input name='email' type='text'/><input name='password' type='password'/><button type='submit'>Submit</button></form>"
   )
})

router.get("/register", (req, res) => {
   res.send(
      "<form method='post' action='/register'><input name='email' type='text'/><input name='name' type='text'/><input name='password' type='password'/><button type='submit'>Submit</button></form>"
   )
})

router.post("/login", passport.authenticate("local"), userLogin)
router.post("/register", userCreate)

export default router
