import {Router} from "express";
import {SIGN_KEY} from "../utils/config";
import {User} from "../models/user";

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = Router()

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({username: body.username})
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, SIGN_KEY)

    response
        .status(200)
        .send({token, username: user.username, name: user.name})
})

module.exports = loginRouter