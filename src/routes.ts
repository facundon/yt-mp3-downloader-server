import { Router } from "express"
import passport from "passport"
import {
   userLogin,
   userLogout,
   userCreate,
   videoDownload,
   searchYoutube,
   addFavorite,
   getVideos,
} from "./controller"
import { isAuth } from "./middleware/auth"

const router = Router()

router.post("/login", passport.authenticate("local"), userLogin)
router.post("/register", userCreate)
router.put("/logout", userLogout)

router.get("/api/converter", isAuth, videoDownload)
router.get("/api/youtube", isAuth, searchYoutube)

router.get("/user/favorites", isAuth, getVideos)
router.put("/user/favorites", isAuth, addFavorite)

export default router
