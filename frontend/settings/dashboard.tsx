import { createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { Connections } from '@redis-cache/settings/components/connections';
import { Metrics } from '@redis-cache/settings/components/metrics';
import { Notification } from '@redis-cache/settings/components/notification';
import { ObjectCachePro } from '@redis-cache/settings/components/object-cache-pro';
import { Status } from '@redis-cache/settings/components/status';
import { Troubleshooting } from '@redis-cache/settings/components/troubleshooting';
import { SettingsContextProvider } from '@redis-cache/settings/data/settings';

const { isRedisDisabled } = window.rediscache ?? {};

export const Dashboard = () => (
    <>
        <div className="columns">
            <div className="content-column flex flex-1 flex-col gap-y-4">
                { isRedisDisabled && (
                    <Notification
                        type={ 'error' }
                        message={ createInterpolateElement(
                            sprintf(
                                // translators: %s = the WP_REDIS_DISABLED config constant, wrapped in a <code> tag.
                                __( 'The object cache is disabled because the %s constant is set.', 'redis-cache' ),
                                '<code>WP_REDIS_DISABLED</code>',
                            ),
                            { code: <code /> },
                        ) }
                    />
                ) }
                <SettingsContextProvider>
                    <section className="status">
                        <Status />
                    </section>
                    <section className="metrics">
                        <Metrics />
                    </section>
                    <section className="connections">
                        <Connections />
                    </section>
                    <section className="troubleshooting">
                        <Troubleshooting />
                    </section>
                </SettingsContextProvider>
            </div>
            <div className="sidebar-column shrink-0">
                <ObjectCachePro />
            </div>
        </div>
    </>
);
