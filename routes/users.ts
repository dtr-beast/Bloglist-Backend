import {Router} from "express";
import {User} from "../models/user";
import {SALT_ROUNDS} from "../utils/config";

const userRouter = Router();
const bcrypt = require('bcrypt')

userRouter.post('/', async (req, res, next) => {
    const {username, name, password} = req.body

    if (password.length < 6) {
        return res.status(403).send({error: 'Password must be at least 6 letters long'}).end()
    }
    if (!password.match(/[a-z]/g)) {
        return res.status(403).send({error: 'small'})
    }
    if (!password.match(/[A-Z]/g)) {
        return res.status(403).send({error: 'capital'})
    }
    if (!password.match(/[0-9]/g)) {
        return res.status(403).send({error: 'number'})
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const newUser = await new User({
        username,
        name,
        passwordHash
    }).save()

    res.json(newUser)
});

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {title: 1})
    res.json(users)
})

module.exports = userRouter
