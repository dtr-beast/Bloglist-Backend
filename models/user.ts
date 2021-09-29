const uniqueValidator = require('mongoose-unique-validator')
import {Schema, model} from 'mongoose'

interface User {
    name: string,
    username: string,
    passwordHash: string
    blogs: Schema.Types.ObjectId[]
}
const userSchema = new Schema<User>({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

export const User = model<User>('User', userSchema)