import { Router } from "express"
import passport from "passport"
import {
   userLogin,
   userLogout,
   userCreate,
   videoDownload,
   searchYoutube,
} from "./controller"
import { isAuth } from "./middleware/auth"

const router = Router()

router.post("/login", passport.authenticate("local"), userLogin)
router.post("/register", userCreate)
router.get("/logout", isAuth, userLogout)
router.get("/api/converter", isAuth, videoDownload)
router.get("/api/youtube", isAuth, searchYoutube)

export default router
