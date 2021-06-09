import express from "express"
import session from "express-session"
import passport from "passport"
import helmet from "helmet"
import cors, { CorsOptions } from "cors"
import { TypeormStore } from "typeorm-store"
import { createConnection } from "typeorm"

import implementLocalStrategy from "./auth/local"
import implementFacebookStrategy from "./auth/facebook"
// import implementGoogleStrategy from "./auth/google"

import { Session } from "./models/Session"
import router from "./routes"

import "reflect-metadata"

const PORT = parseInt(process.env.PORT!) || 8080
const HOST = process.env.HOST || "localhost"
const CORS_CONFIG: CorsOptions = {
   origin: process.env.FRONTEND_URL,
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   allowedHeaders: ["Content-Type", "Authorization"],
   preflightContinue: true,
   credentials: true,
   optionsSuccessStatus: 204,
}

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
            sameSite: "none",
         },
      }
      if (app.get("env") === "production") {
         app.set("trust proxy", 1) // trust first proxy
         SESSION_CONFIG.cookie!.secure = true // serve secure cookies
      }
      app.use(helmet())
      app.use(express.json())
      app.use(express.urlencoded({ extended: true }))
      app.use(cors(CORS_CONFIG))
      app.use(session(SESSION_CONFIG))
      implementLocalStrategy()
      implementFacebookStrategy()
      // implementGoogleStrategy()
      app.use(passport.initialize())
      app.use(passport.session())
      app.use(router)
      //
      app.listen(PORT, "0.0.0.0", () => {
         console.log(`Server listening at http://${HOST}:${PORT}`)
      })
   })
   .catch(error => console.log("TypeORM connection error: ", error))
