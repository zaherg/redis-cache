import apiFetch from '@wordpress/api-fetch';

export interface MessageResponse {
    type: 'error' | 'success';
    message: string;
}

export const flush = async () => {
    const controller = new AbortController();

    return ( await apiFetch( {
        signal: controller?.signal,
        method: 'post',
        path: 'redis-cache/v1/flush-cache',
    } ).catch( ( error ) => {
        if ( error.name === 'AbortError' ) {
            console.log( 'Request has been aborted' );
        }
        return error;
    } ) ) as MessageResponse;
};
export const enable = () => {};
export const disable = () => {};
