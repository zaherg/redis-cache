import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Card } from '@wordpress/ui';

import { MetricsChart } from '@redis-cache/settings/components/metrics-chart';
import { MetricsInactive } from '@redis-cache/settings/components/metrics-images';
import { useSettings } from '@redis-cache/settings/hooks/use-settings';
import { type MetricName, metricLabels, metricNames } from '@redis-cache/utils/charts';

const { Root, Title, Header, Content } = Card;

export const Metrics = () => {
    const { settings } = useSettings();
    const [ metric, setMetric ] = useState< MetricName >( 'time' );
    const isActive = settings.connection?.status === true;
    return (
        <Root className="metrics-card">
            <Header className="metrics-card__header">
                <Title>
                    <h2>{ __( 'Cache activity', 'redis-cache' ) }</h2>
                </Title>
            </Header>
            <Content className="metrics-card__content">
                { isActive ? (
                    <>
                        <fieldset className="metrics-card__metrics" aria-label={ __( 'Cache metrics', 'redis-cache' ) }>
                            { metricNames.map( ( name ) => (
                                <button
                                    key={ name }
                                    type="button"
                                    aria-pressed={ metric === name }
                                    onClick={ () => setMetric( name ) }
                                >
                                    { metricLabels[ name ] }
                                </button>
                            ) ) }
                        </fieldset>
                        <div id="redis-stats-chart">
                            <MetricsChart metric={ metric } settings={ settings } />
                        </div>
                    </>
                ) : (
                    <div className="metrics-card__empty">
                        { <MetricsInactive /> }
                        <h3>{ __( 'No data available', 'redis-cache' ) }</h3>
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
