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
            is_php7: boolean;
            is_wp7: boolean;
            is_phpredis311: boolean;
            is_phpredis_installed: boolean;
            is_relay_installed: boolean;
            pro_url: string;
            chart_color: string | null;
            disable_pro: boolean;
            l10n: Record< string, string >;
            is_redis_disabled: boolean;
            connection: {
                status: boolean | null;
                get_status: string;
                redis_client: string | null;
                redis_prefix: string | null;
                redis_maxttl: string | null;
                redis_version: string | null;
                redis_connection: boolean | null;
                filesystem_allowed: boolean;
                filesystem_writable: boolean;
                diagnostics: RedisDiagnostics | null;
            };
        };
    }
}
