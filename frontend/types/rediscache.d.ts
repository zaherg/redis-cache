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

interface FileSystemWritingErrors {
    disallowed?: [];
    fs?: [];
    writable?: [];
}

interface SerializedWpError {
    errors: Record< string, string[] >;
    error_data: Record< string, unknown > | FileSystemWritingErrors | [];
}

export interface RedisMetric {
    timestamp: number;
    time: number;
    bytes: number;
    ratio: number;
    calls: number;
}

export interface RedisCache {
    isPhp7: boolean;
    isWp7: boolean;
    isPhpredis311: boolean;
    isPhpredisInstalled: boolean;
    isRelayInstalled: boolean;
    isRedisDisabled: boolean;
    chartColor: string | null;
    disableProBanner: boolean;
    l10n: {
        time: string;
        bytes: string;
        ratio: string;
        calls: string;
        no_data: string;
        no_cache: string;
        pro: string;
    };
    isCacheDropinValid: boolean;
    isDropinOutdated: boolean;
    links: {
        objectCachePro: string;
        settings: string;
    };
    connection: {
        status: boolean | null;
        getStatus: string;
        clientName: string | null;
        prefix: string | null;
        maxTtl: string | null;
        version: string | null;
        connection: boolean | string | null;
        filesystemAllowed: boolean;
        filesystemWritable: boolean | SerializedWpError;
        diagnostics: RedisDiagnostics | null;
    };
}

declare global {
    interface Window {
        ajaxurl: string;
        rediscache: RedisCache;
        rediscache_metrics?: RedisMetric[];
        // biome-ignore lint/style/useNamingConvention: ApexCharts defines this browser global.
        ApexCharts?: typeof import('apexcharts').default;
    }
}
