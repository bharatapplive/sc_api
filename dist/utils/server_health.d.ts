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
export declare const getServerHealth: () => ServerHealth;
