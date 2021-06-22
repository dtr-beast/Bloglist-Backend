import {initialUsers, initialBlogs, blogLink, userLink} from "./test_helper";

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

async function insertData() {
    for (let i = 0; i < 3; i++) {
        const i2 = i * 2

        const newUser = await api
            .post(userLink)
            .send(initialUsers[i])

        // const newBlog1 = await api
        //     .post(blogLink)
        //     .send({
        //         ...initialBlogs[i2],
        //         user: newUser.body.id
        //     })
        //
        // const newBlog2 = await api
        //     .post(blogLink)
        //     .send({
        //         ...initialBlogs[i2 + 1],
        //         user: newUser.body.id
        //     })
        // const newUser = await new User({
        //     ...initialUsers[i]
        // }).save()
        //
        // const newBlog1 = await new Blog({
        //     ...initialBlogs[i2],
        //     author: newUser.id
        // }).save()
        //
        // const newNote2 = await new Blog({
        //     ...initialBlogs[i2 + 1],
        //     author: newUser.id
        // }).save()

        console.log('User:', newUser.body)
        // console.log('Blog 1:', newBlog1.body)
        // console.log('Blog 2:', newBlog2.body)
    }
}

insertData().then(() => console.log("Done!"))