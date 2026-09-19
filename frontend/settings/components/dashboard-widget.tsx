import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Card } from '@wordpress/ui';

import { MetricsChart } from '@redis-cache/settings/components/metrics-chart';
import { MetricsInactive } from '@redis-cache/settings/components/metrics-images';
import { useSettings } from '@redis-cache/settings/hooks/use-settings';
import { type MetricName, metricLabels, metricNames } from '@redis-cache/utils/charts';

const { Root, Content } = Card;

export const DashboardWidget = () => {
    const [ metric, setMetric ] = useState< MetricName >( 'time' );
    const { settings } = useSettings();
    const isActive = settings.connection?.status === true;

    return (
        <Root className="metrics-card no-border">
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

                            <button type="button" onClick={ () => ( window.location.href = settings.links.settings ) }>
                                { __( 'Settings', 'redis-cache' ) }
                            </button>
                        </fieldset>
                        <div id="redis-stats-chart">
                            <MetricsChart metric={ metric } settings={ settings } height={ 250 } />
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
