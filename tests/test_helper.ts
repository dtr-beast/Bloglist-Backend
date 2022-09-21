import { Blog } from "../models/blog"
import { User } from "../models/user"

const blogLink = "/api/blogs"
const userLink = "/api/users"

interface Blogs {
  title: string
  author: string
  url: string
  likes: number
}

const initialBlogs: Blogs[] = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Canonical string reduction",
    author: "Edger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
  {
    title: "Discovery India",
    author: "Jawaharlal Nehru",
    url: "https://blog.cleancoder.com/adsf",
    likes: 9,
  },

  {
    title: "My experiences with Truth",
    author: "Mahatma Gandhi",
    url: "https://blog.cleancoder.com",
    likes: 4,
  },
]

const initialUsers: { name: string; username: string; password: string }[] = [
  {
    name: "Hampton Barrera",
    username: "Foreman6Walsh",
    password: "84Strong}86",
  },
  {
    name: "Hines Cunningham",
    username: "Pittman9Houston",
    password: "64Brookfield}101",
  },
  {
    name: "Inez Wilkinson",
    username: "Morrow9Gracie",
    password: "47Irwin}97",
  },
  {
    name: "Dona Keith",
    username: "Montgomery3Rhonda",
    password: "11Deseret}34",
  },
  {
    name: "Viola Ramirez",
    username: "Clay3Wallace",
    password: "05Wacissa}1010",
  },
]

async function blogsInDB() {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

async function usersInDB() {
  const users = await User.find({})
  return users.map((user) => user.toJSON)
}

export default {
  initialBlogs,
  initialUsers,
  blogsInDB,
  usersInDB,
  blogLink,
  userLink,
}
