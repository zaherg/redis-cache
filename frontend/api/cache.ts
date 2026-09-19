import apiFetch from '@wordpress/api-fetch';

import type { MessageResponse } from '@redis-cache/api/types';

export const flush = () =>
    apiFetch< MessageResponse >( {
        method: 'post',
        path: 'redis-cache/v1/flush-cache',
    } );

export const enable = () =>
    apiFetch< MessageResponse >( {
        method: 'post',
        path: 'redis-cache/v1/enable-cache',
    } );

export const disable = () =>
    apiFetch< MessageResponse >( {
        method: 'post',
        path: 'redis-cache/v1/disable-cache',
    } );
