import apiFetch from '@wordpress/api-fetch';

import type { MessageResponse } from '@redis-cache/api/types';

export const flush = async () =>
    ( await apiFetch( {
        method: 'post',
        path: 'redis-cache/v1/flush-cache',
    } ).catch( ( error ) => error ) ) as MessageResponse;

export const enable = async () =>
    ( await apiFetch( {
        method: 'post',
        path: 'redis-cache/v1/enable-cache',
    } ).catch( ( error ) => error ) ) as MessageResponse;

export const disable = async () =>
    ( await apiFetch( {
        method: 'post',
        path: 'redis-cache/v1/disable-cache',
    } ).catch( ( error ) => error ) ) as MessageResponse;
