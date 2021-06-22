import config = require('./utils/config')
import express = require('express')

require('express-async-errors')
import cors = require('cors')
import blogsRouter = require('./routes/blogs')
import userRouter = require('./routes/users')
import loginRouter = require('./routes/login')
import middleware = require('./utils/middleware')
import logger = require('./utils/logger')
import mongoose = require('mongoose')

const app = express()

logger.info('Connecting to', config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
// app.use(middleware.userExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app