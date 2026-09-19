export const initNoticeDismissal = () => {
    document.querySelectorAll< HTMLElement >( '.notice.is-dismissible[data-dismissible]' ).forEach( ( notice ) => {
        notice.addEventListener( 'click', async ( event ) => {
            if ( ! ( event.target instanceof Element ) || ! event.target.closest( '.notice-dismiss' ) ) return;

            event.preventDefault();

            try {
                const { dismissible, nonce } = notice.dataset;
                if ( ! dismissible || ! nonce ) {
                    throw new Error( 'Missing notice dismissal data.' );
                }

                const body = new URLSearchParams( { action: 'roc_dismiss_notice', notice: dismissible } );
                body.set( '_ajax_nonce', nonce );

                const response = await fetch( window.ajaxurl, { method: 'POST', body } );
                if ( ! response.ok ) {
                    throw new Error( `Notice dismissal failed with HTTP ${ response.status }.` );
                }
            } catch ( error ) {
                console.error( 'Redis Object Cache: could not save notice dismissal.', error );
            }
        } );
    } );
};
