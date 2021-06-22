const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObjects) => {
        returnedObjects.id = returnedObjects._id
        delete returnedObjects._id
        delete returnedObjects.__v
    }
})

export const Blog = mongoose.model('Blog', blogSchema)
