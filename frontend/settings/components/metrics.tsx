import { __ } from '@wordpress/i18n';

export const Metrics = () => (
    <>
        <div id="widget-redis-stats" className="card">
            <ul>
                <li>
                    <a
                        href="#1"
                        className="active"
                        data-chart="time"
                        title={ __(
                            'The total amount of time (in milliseconds) it took Redis to return cache data.',
                            'redis-cache',
                        ) }
                    >
                        { __( 'Time', 'redis-cache' ) }
                    </a>
                </li>
                <li>
                    <a
                        href="#2"
                        data-chart="bytes"
                        title={ __( 'The total amount of bytes that was retrieved from Redis.', 'redis-cache' ) }
                    >
                        { __( 'Bytes', 'redis-cache' ) }
                    </a>
                </li>
                <li>
                    <a
                        href="#3"
                        data-chart="ratio"
                        title={ __( 'The hit/miss ratio of cache data that was already cached.', 'redis-cache' ) }
                    >
                        { __( 'Ratio', 'redis-cache' ) }
                    </a>
                </li>
                <li>
                    <a
                        href="#4"
                        data-chart="calls"
                        title={ __( 'The total amount of commands sent to Redis.', 'redis-cache' ) }
                    >
                        { __( 'Calls', 'redis-cache' ) }
                    </a>
                </li>
            </ul>

            <div id="redis-stats-chart"></div>
        </div>
    </>
);
