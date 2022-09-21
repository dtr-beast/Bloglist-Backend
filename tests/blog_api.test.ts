import { Blog, BlogsParam } from "../models/blog"
import { User } from "../models/user"
import { SALT_ROUNDS, SIGN_KEY } from "../utils/config"
import app from "../app"
import helper from "./test_helper"

import supertest from "supertest"
import mongoose from "mongoose"

const api = supertest(app)
let token = ""
// TODO: Use falso to create fake data.
beforeEach(async () => {
  // Reset Database
  await User.deleteMany({})
  await Blog.deleteMany({})

  // Generate a dummy user for authentication
  const bcrypt = require("bcrypt")
  const passwordHash = await bcrypt.hash("sekret", SALT_ROUNDS)
  const user = await new User({
    username: "root",
    name: "rooter",
    passwordHash,
  }).save()

  const jwt = require("jsonwebtoken")
  token = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    SIGN_KEY
  )
  // Generate dummy blogs and add them to the database
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user.id })
  )
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe("GET blog API", () => {
  test("Correct Amount of blogs in the database", async () => {
    const response = await api.get(helper.blogLink)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test("Blogs contains ID parameter", async () => {
    const response = await api.get(helper.blogLink)

    // TODO: Type this blog, use ZOD for data validation and use those types
    response.body.forEach((blog: any) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe("POST blog API", () => {
  test("Blog added to the list", async () => {
    const newBlog = {
      title: "Mechanical Engineering",
      author: "RD Sharma",
      url: "https://mech.com/",
      likes: 12,
    }
    const response = await api
      .post(helper.blogLink)
      .send(newBlog)
      .auth(token, { type: "bearer" })
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(response.body).toMatchObject(newBlog)
  })

  test("Likes declared as 0 if not given explicitly in POST request", async () => {
    const newBlog = {
      title: "Mechanical Engineering II",
      author: "RD Sharma Ji",
      url: "https://mech2.com/",
    }

    const response = await api
      .post(helper.blogLink)
      .send(newBlog)
      .auth(token, { type: "bearer" })
      .expect(201)
      .expect("Content-Type", /application\/json/)

    expect(response.body).toMatchObject({ ...newBlog, likes: 0 })
  })

  test("POST Request is rejected is the title or url property is missing", async () => {
    const newBlog = {
      author: "Ram Kishor",
      likes: 5,
    }

    await api
      .post(helper.blogLink)
      .send(newBlog)
      .auth(token, { type: "bearer" })
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
