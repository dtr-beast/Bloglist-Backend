"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
});
userSchema.plugin(uniqueValidator);
userSchema.set('toJSON', {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});
exports.User = mongoose_1.model('User', userSchema);
