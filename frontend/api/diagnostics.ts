import apiFetch from '@wordpress/api-fetch';

export const getDiagnostics = async ( signal: AbortSignal ): Promise< string > => {
    const report = await apiFetch< unknown >( {
        method: 'get',
        path: 'redis-cache/v1/diagnostics',
        signal,
    } );

    if ( typeof report !== 'string' || ! report.trim() ) {
        throw new TypeError( 'Invalid diagnostics report.' );
    }

    return report;
};
