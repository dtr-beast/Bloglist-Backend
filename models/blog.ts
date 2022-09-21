import { Schema, model } from "mongoose"

export interface BlogsParam {
  title: string
  author: string
  url: string
  likes: number
  user: Schema.Types.ObjectId
}

const blogSchema = new Schema<BlogsParam>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export const Blog = model<BlogsParam>("Blog", blogSchema)
