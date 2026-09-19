import { escapeAttribute, escapeHTML } from '@wordpress/escape-html';
import { __ } from '@wordpress/i18n';
import type { ApexOptions } from 'apexcharts';

import type { RedisCache, RedisMetric } from '@redis-cache/types/rediscache';

export const metricNames = [ 'time', 'ratio', 'bytes', 'calls' ] as const;
export type MetricName = ( typeof metricNames )[ number ];

export const metricLabels: Record< MetricName, string > = {
    time: __( 'Redis time', 'redis-cache' ),
    ratio: __( 'Hit ratio', 'redis-cache' ),
    bytes: __( 'Cache size', 'redis-cache' ),
    calls: __( 'Calls', 'redis-cache' ),
};

const median = ( values: number[] ) => {
    values.sort( ( a, b ) => a - b );
    const lower = values[ Math.floor( ( values.length - 1 ) / 2 ) ];
    const upper = values[ Math.floor( values.length / 2 ) ];
    if ( lower === undefined || upper === undefined ) {
        throw new Error( 'Cannot calculate the median of an empty metrics bucket.' );
    }
    return ( lower + upper ) / 2;
};

export const computeMetrics = ( samples: readonly RedisMetric[] ): RedisMetric[] => {
    const minutes = new Map< number, RedisMetric[] >();

    for ( const sample of samples ) {
        if ( ! [ sample.timestamp, ...metricNames.map( ( name ) => sample[ name ] ) ].every( Number.isFinite ) ) {
            throw new Error( 'Invalid Redis metrics: expected finite numeric measurements.' );
        }
        const minute = Math.floor( sample.timestamp / 60 ) * 60;
        const bucket = minutes.get( minute ) || [];
        bucket.push( sample );
        minutes.set( minute, bucket );
    }

    if ( minutes.size < 2 ) return [];

    return [ ...minutes.entries() ]
        .sort( ( [ a ], [ b ] ) => a - b )
        .map( ( [ timestamp, samples ] ) => ( {
            timestamp,
            time: median( samples.map( ( sample ) => sample.time ) ) * 1000,
            ratio: median( samples.map( ( sample ) => sample.ratio ) ),
            bytes: median( samples.map( ( sample ) => sample.bytes ) ),
            calls: median( samples.map( ( sample ) => sample.calls ) ),
        } ) );
};

const formatBytes = ( value: number ) => {
    const units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
    const unit =
        value <= 0
            ? 0
            : Math.min( units.length - 1, Math.max( 0, Math.floor( Math.log( value ) / Math.log( 1024 ) ) ) );
    return `${ Number( ( value / 1024 ** unit ).toFixed( unit < 2 ? 0 : 2 ) ) } ${ units[ unit ] }`;
};

const formatValue = ( name: MetricName, value: number, tooltip = false ) => {
    if ( name === 'bytes' ) return formatBytes( value );
    if ( name === 'time' ) return `${ tooltip ? value.toFixed( 2 ) : Math.round( value ) } ms`;
    if ( name === 'ratio' ) return `${ tooltip ? Math.round( value * 100 ) / 100 : Math.round( value ) }%`;
    return String( Math.round( value ) );
};

export const getChart = ( name: MetricName, metrics: readonly RedisMetric[], settings: RedisCache ) => {
    const color =
        settings.chartColor ||
        getComputedStyle( document.body ).getPropertyValue( '--wp-admin-theme-color' ).trim() ||
        ( settings.isWp7 ? '#3858e9' : '#0096dd' );
    const showPro = ! settings.disableProBanner && name !== 'ratio';
    const label = settings.l10n[ name ] || metricLabels[ name ];
    const proLabel = settings.l10n.pro || 'Object Cache Pro';
    const data = metrics.map( ( metric ): [ number, number ] => [ metric.timestamp * 1000, metric[ name ] ] );
    const series: ApexAxisChartSeries = [ { name: label, type: 'area', data } ];

    if ( showPro ) {
        series.push( {
            name: proLabel,
            type: 'line',
            data: data.map( ( [ timestamp, value ] ) => [
                timestamp,
                name === 'time' ? value * 0.5 : name === 'bytes' ? value * 0.3 : Math.round( value / 50 ) + 5,
            ] ),
        } );
    }

    const options: ApexOptions = {
        chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: { enabled: false },
        },
        noData: {
            text: settings.connection.status === true ? settings.l10n.no_data : settings.l10n.no_cache,
            align: 'center',
            verticalAlign: 'middle',
            offsetY: -25,
            style: { color: '#72777c', fontSize: '14px', fontFamily: 'inherit' },
        },
        stroke: { width: [ 2, 2 ], curve: 'smooth', dashArray: [ 0, 8 ] },
        colors: [ color, '#72777c' ],
        dataLabels: { enabled: false },
        legend: { show: false },
        fill: { opacity: [ 0.25, 1 ] },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'HH:mm',
                // biome-ignore lint/style/useNamingConvention: ApexCharts option name.
                datetimeUTC: false,
                style: { colors: '#72777c', fontSize: '13px', fontFamily: 'inherit' },
            },
            tooltip: { enabled: false },
        },
        yaxis: {
            tickAmount: 4,
            min: 0,
            ...( name === 'ratio' ? { max: 100 } : {} ),
            labels: {
                style: { colors: '#72777c', fontSize: '13px', fontFamily: 'inherit' },
                formatter: ( value ) => formatValue( name, value ),
            },
        },
        tooltip: {
            fixed: { enabled: true, position: 'bottomLeft', offsetY: 15, offsetX: 0 },
            custom: ( { dataPointIndex }: { dataPointIndex: number } ) => {
                const point = data[ dataPointIndex ];
                if ( ! point ) return '';
                const title = new Date( point[ 0 ] ).toTimeString().slice( 0, 5 );
                const group = ( name: string, color: string, value?: string ) =>
                    `<div class="apexcharts-tooltip-series-group">
                        <span class="apexcharts-tooltip-marker" style="background-color: ${ escapeAttribute( color ) };"></span>
                        <div class="apexcharts-tooltip-text"><div class="apexcharts-tooltip-y-group">
                            <span class="apexcharts-tooltip-text-label">${ escapeHTML( name ) }${ value === undefined ? '' : ':' }</span>
                            ${ value === undefined ? '' : `<span class="apexcharts-tooltip-text-value">${ escapeHTML( value ) }</span>` }
                        </div></div>
                    </div>`;
                return (
                    `<div class="apexcharts-tooltip-title">${ escapeHTML( title ) }</div>` +
                    group( label, color, formatValue( name, point[ 1 ], true ) ) +
                    ( showPro ? group( proLabel, '#72777c' ) : '' )
                );
            },
        },
    };

    return { options, series };
};
