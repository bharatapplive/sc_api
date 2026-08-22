"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerHealth = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getServerHealth = () => {
    console.log('[ServerHealth] Checking server health...');
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
    const dbHost = mongoose_1.default.connection.readyState === 1 ? mongoose_1.default.connection.host : undefined;
    console.log('[ServerHealth] Database status:', dbStatus);
    const health = {
        status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
            status: dbStatus,
            host: dbHost,
        },
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
    };
    console.log('[ServerHealth] Server health check completed:', health);
    return health;
};
exports.getServerHealth = getServerHealth;
//# sourceMappingURL=server_health.js.map