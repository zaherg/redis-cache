import apiFetch from '@wordpress/api-fetch';

import type { RedisCache } from '@redis-cache/types/rediscache';

export const getData = async ( setSettings: ( data: RedisCache ) => void ) => {
    setSettings( window.rediscache );
    const data = ( await apiFetch( {
        method: 'get',
        path: 'redis-cache/v1/get-data',
    } ) ) as RedisCache;

    console.log( data );

    return data;
};
