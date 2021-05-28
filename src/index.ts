import express from "express"
import session from "express-session"
import passport from "passport"
import { TypeormStore } from "typeorm-store"
import { createConnection } from "typeorm"

import implementLocalStrategy from "./auth/local"
import { Session } from "./models/Session"
import router from "./routes"

import "reflect-metadata"

const port = 5000

createConnection()
   .then(connection => {
      const app = express()
      const sessionRepository = connection.getRepository(Session)
      const SESSION_CONFIG: session.SessionOptions = {
         secret: process.env.SECRET || "testingsecretsession",
         resave: false,
         saveUninitialized: true,
         store: new TypeormStore({ repository: sessionRepository }),
         cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            secure: undefined,
         },
      }
      if (app.get("env") === "production" && SESSION_CONFIG.cookie) {
         app.set("trust proxy", 1) // trust first proxy
         SESSION_CONFIG.cookie.secure = true // serve secure cookies
      }

      app.use(express.json())
      app.use(express.urlencoded({ extended: true }))
      app.use(session(SESSION_CONFIG))
      implementLocalStrategy()
      app.use(passport.initialize())
      app.use(passport.session())
      app.use(router)

      app.listen(port, () => {
         console.log(`Example app listening at http://localhost:${port}`)
      })
   })
   .catch(error => console.log("TypeORM connection error: ", error))
