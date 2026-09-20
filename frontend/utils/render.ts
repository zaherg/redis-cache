import { createRoot, render as deprecatedRender, type Element } from '@wordpress/element';

export const render = ( container: HTMLElement, component: Element ) => {
    if ( typeof createRoot !== 'function' ) {
        deprecatedRender( component, container );
        return;
    }
    createRoot( container ).render( component );
};
