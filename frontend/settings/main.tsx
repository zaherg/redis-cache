import domReady from '@wordpress/dom-ready';

import { DashboardWidget } from '@redis-cache/settings/components/dashboard-widget';
import { Dashboard } from '@redis-cache/settings/dashboard';
import { initNoticeDismissal } from '@redis-cache/utils/dismiss-notices';
import { render } from '@redis-cache/utils/render';

import '@redis-cache/settings/style.css';

document.readyState === 'loading'
    ? document.addEventListener( 'DOMContentLoaded', initNoticeDismissal, { once: true } )
    : initNoticeDismissal();

domReady( () => {
    const element = document.getElementById( 'redis-cache' );
    if ( element ) {
        render( element, <Dashboard /> );
        return;
    }

    const widget = document.getElementById( 'widget-redis-stats' );
    if ( widget ) render( widget, <DashboardWidget /> );
} );
