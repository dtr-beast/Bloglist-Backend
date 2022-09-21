require("dotenv").config()

const MONGODB_URL =
  process.env.NODE_ENV === "TEST"
    ? process.env.TEST_MONGODB_URL
    : process.env.MONGODB_URL

const PORT = Number(process.env.PORT) || 3000
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 5
const SIGN_KEY = process.env.SIGN_KEY ?? "THIS_IS_NOT_A_GOOD_KEY"
const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME ?? "90 days"
const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/blogListApp"

export { PORT, SALT_ROUNDS, SIGN_KEY, TOKEN_EXPIRE_TIME, MONGODB_URI }
