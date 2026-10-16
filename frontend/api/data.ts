import apiFetch from '@wordpress/api-fetch';

import type { RedisCache } from '@redis-cache/types/rediscache';

export const getData = async ( setSettings: ( data: RedisCache ) => void ) => {
    const currentData = window.rediscache;
    const updatedValues = ( await apiFetch( {
        method: 'get',
        path: 'redis-cache/v1/get-data',
    } ) ) as RedisCache;

    setSettings( { ...currentData, ...updatedValues } );
};
