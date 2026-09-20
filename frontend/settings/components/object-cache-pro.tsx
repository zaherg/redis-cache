import { createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

// TODO:
// - check if it can use obj pro: ( $is_php7 && ( $is_phpredis311 || $relay_installed ) )
// - what version of PHP7 they use
// - is phpredis_installed
// - is_phpredis311 installed
// - get the version of redis phpversion( 'redis' )
// - is acceleratewp_install/ed or not if not we can show the section

const features = [
    __( 'Rewritten for raw performance', 'redis-cache' ),
    __( '100% WordPress API compliant', 'redis-cache' ),
    __( 'Faster serialization and compression', 'redis-cache' ),
    __( 'Easy debugging & logging', 'redis-cache' ),
    __( 'Cache prefetching and analytics', 'redis-cache' ),
    __( 'Fully unit tested (100% code coverage)', 'redis-cache' ),
    __( 'Secure connections with TLS', 'redis-cache' ),
    __( 'Health checks via WordPress & WP CLI', 'redis-cache' ),
    __( 'Optimized for WooCommerce, Jetpack & Yoast SEO', 'redis-cache' ),
];

const { is_php7, disable_pro, is_phpredis_installed, is_relay_installed, is_phpredis311 } = window.rediscache;

export const ObjectCachePro = () => {
    if ( disable_pro ) return;
    return (
        <>
            <h6>{ __( 'Resources', 'redis-cache' ) }</h6>
            <div className="sction-pro">
                <div className="card">
                    <h2
                        className="title"
                        style={ {
                            lineHeight: 1.4,
                        } }
                    >
                        { __( 'Need more performance and reliability?', 'redis-cache' ) }
                        <br />
                        { createInterpolateElement(
                            sprintf(
                                // translators: %s = Object Cache Pro wrapped in formatting tags.
                                __( 'Check out %s', 'redis-cache' ),
                                '<brand>Object Cache Pro</brand>',
                            ),
                            { brand: <span style={ { color: '#dc2626' } } /> },
                        ) }
                    </h2>
                    <p>
                        { createInterpolateElement(
                            __(
                                '<strong>A business class object cache backend.</strong> Truly reliable, highly-optimized and fully customizable, with a <u>dedicated engineer</u> when you most need it.',
                                'redis-cache',
                            ),
                            { strong: <strong />, u: <u /> },
                        ) }
                    </p>
                    <ul>
                        { features?.map( ( feature, index ) => (
                            <li key={ index }>{ feature }</li>
                        ) ) }
                    </ul>
                    <p>
                        <a className="button button-primary" target="_blank" rel="noopener" href="#refs">
                            { __( 'Learn more', 'redis-cache' ) }
                        </a>
                    </p>
                </div>
                <p className="compatibility">
                    { is_php7 && ( is_phpredis311 || is_relay_installed ) ? (
                        <>
                            <span className="dashicons dashicons-yes"></span>
                            <span>
                                { __( 'Your site meets the system requirements for the Pro version.', 'redis-cache' ) }
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="dashicons dashicons-no"></span>
                            <span>
                                { createInterpolateElement(
                                    __(
                                        'Your site <i>does not</i> meet the requirements for the Pro version:',
                                        'redis-cache',
                                    ),
                                    { i: <i /> },
                                ) }
                            </span>
                        </>
                    ) }
                </p>
                <ul>
                    { ! is_php7 && (
                        <li>
                            { sprintf(
                                // translators: %s = PHP Version.
                                __(
                                    'The current version of PHP (%s) is too old. PHP 7.2 or newer is required.',
                                    'redis-cache',
                                ),
                                '7.0',
                            ) }
                        </li>
                    ) }
                    { ! is_phpredis_installed && (
                        <li>{ __( 'The PhpRedis extension is not installed.', 'redis-cache' ) }</li>
                    ) }

                    { ! is_phpredis311 && (
                        <li>
                            { sprintf(
                                // translators: %s = Version of the PhpRedis extension.
                                __(
                                    'The current version of the PhpRedis extension (%s) is too old. PhpRedis 3.1.1 or newer is required.',
                                    'redis-cache',
                                ),
                                'redis_version_7.0',
                            ) }
                        </li>
                    ) }
                </ul>
            </div>
        </>
    );
};
