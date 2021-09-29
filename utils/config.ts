require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URL = process.env.NODE_ENV === 'TEST'
    ? process.env.TEST_MONGODB_URL
    : process.env.MONGODB_URL

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)

const SIGN_KEY =  process.env.SIGN_KEY
export {
    MONGODB_URL,
    PORT,
    SALT_ROUNDS,
    SIGN_KEY
}
