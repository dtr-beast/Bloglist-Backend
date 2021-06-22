import {Blog} from "../models/blog"

const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper
        .initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('GET blog API', () => {
    test('Correct Amount of blogs in the database', async () => {
        const response = await api.get(helper.blogLink)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('Blogs contains ID parameter', async () => {
        const response = await api.get(helper.blogLink)

        response.body.forEach((blog) => {
            expect(blog.id).toBeDefined()
        })
    })
})

// TODO: Fix, add token authentication
describe('POST blog API', () => {
    test('Blog added to the list', async () => {
        const newBlog = {
            title: "Mechanical Engineering",
            author: "RD Sharma",
            url: "https://mech.com/",
            likes: 12
        }
        const response = await api
            .post(helper.blogLink)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toMatchObject(newBlog)
    })

    test('Likes declared as 0 if not given explicitly in POST request', async () => {
        const newBlog = {
            title: "Mechanical Engineering II",
            author: "RD Sharma Ji",
            url: "https://mech2.com/",
        }

        const response = await api
            .post(helper.blogLink)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toMatchObject({...newBlog, likes: 0})

    })

    test('POST Request is rejected is the title or url property is missing', async () => {
        const newBlog = {
            author: 'Ram Kishor',
            likes: 5
        }

        await api
            .post(helper.blogLink)
            .send(newBlog)
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})