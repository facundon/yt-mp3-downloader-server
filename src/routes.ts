import { Router } from "express"
import passport from "passport"
import { userLogin, userLogout, userCreate, videoDownload } from "./controller"
import { isAuth } from "./middleware/auth"

const router = Router()

router.post("/login", passport.authenticate("local"), userLogin)
router.get("/logout", userLogout)
router.post("/register", userCreate)
router.get("/isAuth", isAuth, (_, res) => {
   res.status(201)
})
router.get("/api/converter", isAuth, videoDownload)

export default router
