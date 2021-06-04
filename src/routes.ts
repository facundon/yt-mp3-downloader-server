import { Router } from "express"
import passport from "passport"
import {
   userLogin,
   userLogout,
   userCreate,
   videoDownload,
   searchYoutube,
   addFavorite,
   getFavorites,
   delFavorite,
} from "./controller"
import { isAuth } from "./middleware/auth"

const router = Router()

router.post("/login", passport.authenticate("local"), userLogin)
router.post("/register", userCreate)
router.put("/logout", userLogout)

router.get("/api/converter", isAuth, videoDownload)
router.get("/api/youtube", isAuth, searchYoutube)
router.get("/user", isAuth, userLogin)

router.get("/user/favorites", isAuth, getFavorites)
router.put("/user/favorites/:id", isAuth, addFavorite)
router.delete("/user/favorites/:id", isAuth, delFavorite)

export default router
