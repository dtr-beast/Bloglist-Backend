"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownEndpoint = exports.errorHandler = exports.userExtractor = exports.tokenExtractor = exports.requestLogger = void 0;
var logger = require("./logger");
var jwt = require("jsonwebtoken");
var config_1 = require("./config");
var requestLogger = function (req, res, next) {
    logger.info('Method:', req.method);
    logger.info('Path:  ', req.path);
    logger.info('Body:  ', req.body);
    logger.info('---');
    next();
};
exports.requestLogger = requestLogger;
var tokenExtractor = function (req, res, next) {
    var authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7);
    }
    next();
};
exports.tokenExtractor = tokenExtractor;
var userExtractor = function (req, res, next) {
    if (req.token) {
        var decodedToken = jwt.verify(req.token, config_1.SIGN_KEY);
        // @ts-ignore
        req.user = decodedToken.id;
    }
    next();
};
exports.userExtractor = userExtractor;
var errorHandler = function (error, req, res, next) {
    logger.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformed id' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: error.message });
    }
    else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' });
    }
    next(error);
};
exports.errorHandler = errorHandler;
var unknownEndpoint = function (req, res) {
    res.status(404).send({ error: 'unknown endpoint' });
};
exports.unknownEndpoint = unknownEndpoint;
