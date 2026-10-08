export {};

interface RedisDiagnostics {
    client?: string;
    username?: string | null;
    password?: string | [ username: string, password: string ] | null;
    host?: string;
    path?: string;
    port?: number | string;
    database?: number | string;
    timeout?: string;
    read_timeout?: string;
    retry_interval?: string | null;
    cluster?: string[];
    shards?: string[];
    servers?: string[];
}

declare global {
    interface Window {
        rediscache: {
            jQuery: string;
            isPhp7: boolean;
            isWp7: boolean;
            isPhpredis311: boolean;
            isPhpredisInstalled: boolean;
            isRelayInstalled: boolean;
            isRedisDisabled: boolean;
            chartColor: string | null;
            disableProBanner: boolean;
            l10n: Record< string, string >;
            isCacheDropinValid: boolean;
            links: {
                objectCachePro: string;
                enableCache: string;
                disableCache: string;
                flushCache: string;
            };
            connection: {
                status: boolean | null;
                getStatus: string;
                clientName: string | null;
                prefix: string | null;
                maxTtl: string | null;
                version: string | null;
                connection: boolean | null;
                filesystemAllowed: boolean;
                filesystemWritable: boolean;
                diagnostics: RedisDiagnostics | null;
            };
        };
    }
}
