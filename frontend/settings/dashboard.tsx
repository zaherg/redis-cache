import { createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { Connections } from '@redis-cache/settings/components/connections';
import { Metrics } from '@redis-cache/settings/components/metrics';
import { Notification } from '@redis-cache/settings/components/notification';
import { ObjectCachePro } from '@redis-cache/settings/components/object-cache-pro';
import { Status } from '@redis-cache/settings/components/status';

const { is_redis_disabled } = window.rediscache ?? {};

export const Dashboard = () => (
    <>
        <h1 className="mb-3">{ __( 'Redis Object Cache', 'redis-cache' ) }</h1>
        <div className="columns">
            <div className="content-column flex flex-1 flex-col gap-y-4">
                { is_redis_disabled && (
                    <Notification
                        type={ 'error' }
                        message={
                            createInterpolateElement(
                                sprintf(
                                    // translators: %s = the WP_REDIS_DISABLED config constant, wrapped in a <code> tag.
                                    __( 'The object cache is disabled because the %s constant is set.', 'redis-cache' ),
                                    '<code>WP_REDIS_DISABLED</code>',
                                ),
                                {
                                    code: <code />,
                                },
                            ) as unknown as string
                        }
                    />
                ) }
                <section className="status">
                    <Status />
                </section>
                <section className="metrics">
                    <Metrics isLoading={ true } />
                </section>
                <section className="connections">
                    <Connections />
                </section>
            </div>
            <div className="sidebar-column shrink-0">
                <ObjectCachePro />
            </div>
        </div>
    </>
);
