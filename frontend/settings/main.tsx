import domReady from '@wordpress/dom-ready';

import { Dashboard } from '@redis-cache/settings/dashboard';
import { render } from '@redis-cache/utils/render';

import '@redis-cache/settings/style.css';

domReady(() => {
    const element = document.getElementById('redis-cache');
    if (!element) return;

    render(element, <Dashboard />);
});
