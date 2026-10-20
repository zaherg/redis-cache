import { __ } from '@wordpress/i18n';
import { Card } from '@wordpress/ui';

import { MetricsInactive, MetricsSkeleton } from '@redis-cache/settings/components/metrics-images';
import { useSettings } from '@redis-cache/settings/hooks/use-settings';

const { Root, Title, Header, Content } = Card;

export const Metrics = () => {
    const { settings } = useSettings();
    const { status } = settings.connection;
    const isActive = ! ( typeof status === 'string' || status === null );
    return (
        <Root className="metrics-card">
            <Header className="metrics-card__header">
                <Title>
                    <h2>{ __( 'Cache activity', 'redis-cache' ) }</h2>
                </Title>
                { /*<span className="metrics-card__status" role="status">*/ }
                { /*    { isLoading ? __( 'Loading metrics…', 'redis-cache' ) : __( 'Not collecting data', 'redis-cache' ) }*/ }
                { /*</span>*/ }
            </Header>
            <Content className="metrics-card__content">
                { isActive ? (
                    <>
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
                        <MetricsSkeleton />
                        <div id="widget-redis-stats">
                            <div id="redis-stats-chart"></div>
                        </div>
                    </>
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
            </Content>
        </Root>
    );
};
