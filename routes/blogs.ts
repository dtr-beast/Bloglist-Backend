import {Blog} from "../models/blog";
import {User} from "../models/user";
import {SIGN_KEY} from "../utils/config";

import {Router} from "express";

const jwt = require('jsonwebtoken')
const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', {name: 1})
    res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const ID = req.params.id
    const blog = await Blog.findById(ID).populate('user', {name: 1})
    res.json(blog)
})

// TODO: Check if the Token authorization is working and write tests (4.19)
blogsRouter.post('/', async (req, res) => {

    const body = req.body
    if (!req.user) {
        return res.status(401).json({error: "Unauthorized"})
    }
    const user = await User.findById(req.user)

    const savedBlog = await new Blog({...body, user: req.user}).save()
    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
    const ID = req.params.id
    const decodedToken = jwt.verify(req.token, SIGN_KEY)

    if (!req.token || !decodedToken.id) {
        return res.status(401).json({error: 'token missing or invalid'})
    }

    const toBeDeletedBlog = await Blog.findById(ID)
    if (toBeDeletedBlog.user.toString() !== decodedToken.id) {
        return res.status(401).json({error: 'Unauthorized: blog can only be deleted by its creator'})
    }

    await toBeDeletedBlog.delete()

    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {new: true})
    res.json(updatedBlog)
})

module.exports = blogsRouter
