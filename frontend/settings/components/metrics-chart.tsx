import { lazy, Suspense, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import type { RedisCache } from '@redis-cache/types/rediscache';
import { computeMetrics, getChart, type MetricName, metricLabels } from '@redis-cache/utils/charts';

// Resolve externally supplied engines at DOM ready, not when the entry script loads.
const Chart = lazy( () => import( 'react-apexcharts' ) );

interface MetricsChartProps {
    metric: MetricName;
    settings: RedisCache;
    height?: number;
}

export const MetricsChart = ( { metric, settings, height = 300 }: MetricsChartProps ) => {
    const samples = window.rediscache_metrics;
    const metrics = useMemo( () => computeMetrics( samples || [] ), [ samples ] );
    const { options, series } = useMemo( () => getChart( metric, metrics, settings ), [ metric, metrics, settings ] );

    if ( ! window.ApexCharts ) {
        return <p>{ __( 'Charts are unavailable.', 'redis-cache' ) }</p>;
    }

    return (
        <div role="img" aria-label={ metricLabels[ metric ] } style={ { minHeight: height } }>
            <Suspense fallback={ null }>
                <Chart type="line" options={ options } series={ series } height={ height } width="100%" />
            </Suspense>
        </div>
    );
};
