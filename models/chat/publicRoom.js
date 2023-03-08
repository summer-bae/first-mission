"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const publicRoomSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'account'
    },
    createdAt: {
        type: String,
    }
});
exports.default = mongoose_1.default.model('publicRoom', publicRoomSchema);
