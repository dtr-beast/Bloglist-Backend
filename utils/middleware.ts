import logger = require('./logger')
import jwt = require('jsonwebtoken')
import {SIGN_KEY} from "./config";

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}


const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
    }
    next()
}

const userExtractor = (req, res, next) => {
    if (req.token) {
        const decodedToken = jwt.verify(req.token, SIGN_KEY)
        // @ts-ignore
        req.user = decodedToken.id
    }
    next()
}


const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).json({error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({error: error.message})
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({error: 'token expired'})
    }

    next(error)
}


const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

export {
    requestLogger,
    tokenExtractor,
    userExtractor,
    errorHandler,
    unknownEndpoint
}
