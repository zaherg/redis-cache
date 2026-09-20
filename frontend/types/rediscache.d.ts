export {};

declare global {
    interface Window {
        rediscache: {
            jQuery: string;
            is_php7: boolean;
            is_wp7: boolean;
            is_phpredis311: boolean;
            is_phpredis_installed: boolean;
            is_relay_installed: boolean;
            chart_color: string | null;
            disable_pro: boolean;
            l10n: Record< string, string >;
        };
    }
}
