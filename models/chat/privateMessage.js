"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const privateMessageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'account',
        required: true
    },
    username: {
        type: String,
        require: true
    },
    message: {
        type: String,
        required: true
    },
    receiver: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
});
exports.default = mongoose_1.default.model('privateMessage', privateMessageSchema);
