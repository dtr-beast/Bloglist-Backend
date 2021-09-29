import {Blog} from "../models/blog";
import {User} from "../models/user";

import {Router} from "express";

const testingRouter = Router()

testingRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.send({"Success": "Database is Reset"}).status(204).end()
})

module.exports = testingRouter
