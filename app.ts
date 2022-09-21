import express from "express"
import "express-async-errors"
import cors from "cors"
import mongoose from "mongoose"

import { MONGODB_URI } from "./utils/config"
import blogsRouter from "./routes/blogs"
import userRouter from "./routes/users"
import loginRouter from "./routes/login"
import middleware from "./utils/middleware"
import logger from "./utils/logger"

const app = express()

logger.info("Connecting to", MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB")
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message)
  })

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use("/api/blogs", middleware.userExtractor, blogsRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === "TEST") {
  const testingRouter = require("./routes/testing").default
  app.use("/api/testing", testingRouter)
  logger.info("Testing Mode")
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
