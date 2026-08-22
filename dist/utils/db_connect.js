"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = require("./error");
const connectDB = async () => {
    try {
        console.log('[DB Connect] Attempting to connect to MongoDB...');
        const MONGO_URI = process.env.mongoDB_url;
        console.log('[DB Connect] MongoDB URI:', MONGO_URI ? '***configured***' : 'NOT FOUND');
        if (!MONGO_URI) {
            console.error('[DB Connect] MongoDB URL not found in environment variables');
            throw new error_1.DatabaseError('MongoDB URL not found in environment variables');
        }
        await mongoose_1.default.connect(MONGO_URI);
        console.log('[DB Connect] MongoDB connected successfully');
    }
    catch (error) {
        console.error('[DB Connect] MongoDB connection error:', error);
        throw new error_1.DatabaseError('Failed to connect to MongoDB');
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        console.log('[DB Connect] Attempting to disconnect from MongoDB...');
        await mongoose_1.default.disconnect();
        console.log('[DB Connect] MongoDB disconnected successfully');
    }
    catch (error) {
        console.error('[DB Connect] MongoDB disconnection error:', error);
        throw new error_1.DatabaseError('Failed to disconnect from MongoDB');
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=db_connect.js.map