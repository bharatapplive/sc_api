import mongoose from 'mongoose';

/**
 * ServerHealth - Interface for server health status
 */
export interface ServerHealth {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    host?: string;
  };
  environment: string;
  version: string;
}

/**
 * getServerHealth - Returns the current health status of the server
 * This function checks the server status, database connection, and system information
 * @returns {ServerHealth} Object containing health status information
 */
export const getServerHealth = (): ServerHealth => {
  console.log('[ServerHealth] Checking server health...');
  
  // Get database connection status
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const dbHost = mongoose.connection.readyState === 1 ? mongoose.connection.host : undefined;
  
  console.log('[ServerHealth] Database status:', dbStatus);
  
  const health: ServerHealth = {
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
