import { Router } from "express"
import passport from "passport"
import { userLogin, userCreate, videoDownload } from "./controller"

const router = Router()

router.post("/login", passport.authenticate("local"), userLogin)
router.post("/register", userCreate)

router.get("/api/converter", videoDownload)

export default router
