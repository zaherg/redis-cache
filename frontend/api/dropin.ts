import apiFetch from '@wordpress/api-fetch';

import type { MessageResponse } from '@redis-cache/api/types';

export const updateDropin = async () =>
    ( await apiFetch( {
        method: 'post',
        path: 'redis-cache/v1/update-dropin',
    } ).catch( ( error ) => error ) ) as MessageResponse;
