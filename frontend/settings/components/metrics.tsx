import { __ } from '@wordpress/i18n';
import { Card } from '@wordpress/ui';

import { MetricsInactive, MetricsSkeleton } from '@redis-cache/settings/components/metrics-images';

export const Metrics = ( { isLoading = false }: { isLoading?: boolean } ) => (
    <Card.Root className="metrics-card">
        <Card.Header className="metrics-card__header">
            <Card.Title>
                <h2>{ __( 'Cache activity', 'redis-cache' ) }</h2>
            </Card.Title>
            <span className="metrics-card__status" role="status">
                { isLoading ? __( 'Loading metrics…', 'redis-cache' ) : __( 'Not collecting data', 'redis-cache' ) }
            </span>
        </Card.Header>
        <Card.Content className="metrics-card__content" aria-busy={ isLoading }>
            <fieldset className="metrics-card__metrics" aria-label={ __( 'Cache metrics', 'redis-cache' ) }>
                <button type="button" disabled>
                    { __( 'Redis time', 'redis-cache' ) }
                </button>
                <button type="button" disabled>
                    { __( 'Hit ratio', 'redis-cache' ) }
                </button>
                <button type="button" disabled>
                    { __( 'Cache size', 'redis-cache' ) }
                </button>
                <button type="button" disabled>
                    { __( 'Calls', 'redis-cache' ) }
                </button>
            </fieldset>
            { isLoading ? (
                <MetricsSkeleton />
            ) : (
                <div className="metrics-card__empty">
                    { <MetricsInactive /> }
                    <h3>{ __( 'No chart data available', 'redis-cache' ) }</h3>
                    <p>{ __( 'Enable object cache to collect data.', 'redis-cache' ) }</p>
                    <p className="metrics-card__hint">
                        { __( 'Activity will appear after requests have been recorded.', 'redis-cache' ) }
                    </p>
                </div>
            ) }

            <div id="widget-redis-stats" className="card">
                <ul>
                    <li>
                        <a
                            href="#1"
                            className="active"
                            data-chart="time"
                            title="<?php esc_attr_e( 'The total amount of time (in milliseconds) it took Redis to return cache data.', 'redis-cache' ); ?>"
                        >
                            Time
                        </a>
                    </li>
                    <li>
                        <a
                            href="#2"
                            data-chart="bytes"
                            title="<?php esc_attr_e( 'The total amount of bytes that was retrieved from Redis.', 'redis-cache' ); ?>"
                        >
                            Bytes
                        </a>
                    </li>
                    <li>
                        <a
                            href="#3"
                            data-chart="ratio"
                            title="<?php esc_attr_e( 'The hit/miss ratio of cache data that was already cached.', 'redis-cache' ); ?>"
                        >
                            Ratio
                        </a>
                    </li>
                    <li>
                        <a
                            href="#4"
                            data-chart="calls"
                            title="<?php esc_attr_e( 'The total amount of commands sent to Redis.', 'redis-cache' ); ?>"
                        >
                            Calls
                        </a>
                    </li>
                </ul>

                <div id="redis-stats-chart"></div>
            </div>
        </Card.Content>
    </Card.Root>
);
