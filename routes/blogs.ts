import { Blog } from "../models/blog"
import { User } from "../models/user"

import { Router } from "express"

const blogsRouter = Router()

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { name: 1 })
  res.json(blogs)
})

blogsRouter.get("/:id", async (req, res) => {
  const ID = req.params.id
  const blog = await Blog.findById(ID).populate("user", { name: 1 })
  res.json(blog)
})

// TODO: Check if the Token authorization is working and write tests
blogsRouter.post("/", async (req, res) => {
  const body = req.body
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // TODO: Segregate this logic into the middleware itself 
  const user = await User.findById(req.user)

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const savedBlog = await new Blog({ ...body, user: req.user }).save()
  // TODO: Check if this is the best way to update the user's blogs
  user.blogs = user.blogs.concat(savedBlog.id)

  await user.save()

  res.status(201).json(savedBlog)
})

/**
 Verify if the token is valid.
 Then, check if the token is of the user who wrote the blog.
 If the blog.user.id matches the user.id, then the blog list is deleted, otherwise the request is rejected.
 */
blogsRouter.delete("/:id", async (req, res) => {
  const ID = req.params.id

  const toBeDeletedBlog = await Blog.findById(ID)

  if (!toBeDeletedBlog) {
    return res.status(404).json({ error: "Blog not found" })
  }

  // User ID is provided by the userExtractor middleware
  if (toBeDeletedBlog.user.toString() !== req.user) {
    return res
      .status(401)
      .json({ error: "Unauthorized: blog can only be deleted by its creator" })
  }

  await toBeDeletedBlog.delete()

  res.status(204).end()
})

blogsRouter.put("/:id", async (req, res) => {
  const ID = req.params.id
  const body = req.body

  const toBeUpdatedBlog = await Blog.findById(ID)

  if (!toBeUpdatedBlog) {
    return res.status(404).json({ error: "Blog not found" })
  }

  if (toBeUpdatedBlog.user.toString() !== req.user) {
    return res
      .status(401)
      .json({ error: "Unauthorized: blog can only be updated by its creator" })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(ID, body, { new: true })
  res.json(updatedBlog)
})

export default blogsRouter
