import { Router } from "express"
import { SIGN_KEY } from "../utils/config"
import { User } from "../models/user"

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const loginRouter = Router()

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  if (!user) {
    return response.status(401).send({ error: "invalidUsername" })
  }
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return response.status(401).send({ error: "invalidPassword" })
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, SIGN_KEY)

  response.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
