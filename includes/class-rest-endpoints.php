<?php
/**
 * REST Endpoints class
 *
 * @package Rhubarb\RedisCache
 */

namespace Rhubarb\RedisCache;

defined( 'ABSPATH' ) || exit;

/**
 *  REST Endpoints class
 */
class Rest_Endpoints {

    /**
     * Register the REST API initialization hook.
     */
    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    /**
     * Register cache management routes and their permission callbacks.
     *
     * @return void
     */
    public function register_routes() {

        $routes = [
            'disable-cache' => [ 'POST', 'disable_object_cache' ],
            'enable-cache'  => [ 'POST', 'enable_object_cache' ],
            'flush-cache'   => [ 'POST', 'flush_cache' ],
            'update-dropin'   => [ 'POST', 'update_dropin' ],
            'metrics'   => [
                'GET',
                'get_metrics',
                [
                    'minTime' => [
                        'description' => __( 'Metrics time window in seconds.', 'redis-cache' ),
                        'type'        => 'integer',
                        'default'     => MINUTE_IN_SECONDS * 30,
                        'minimum'     => 1,
                    ],
                ],
            ],
        ];

        foreach ( $routes as $route => $definition ) {
            [ $method, $callback, $args ] = $definition;
            register_rest_route(
                'redis-cache/v1',
                '/' . $route,
                [
                    'methods'             => $method,
                    'callback'            => [ $this, $callback ],
                    'permission_callback' => [ Plugin::instance(), 'current_user_can_manage_redis' ],
                    'args'                => $args ?? [],
                ]
            );
        }
    }

    /**
     * Delete the object cache drop-in and flush Redis if deletion succeeds.
     *
     * @return \WP_REST_Response
     */
    public function disable_object_cache() {
        global $wp_filesystem;
        $url = Plugin::instance()->action_link( 'enable-cache' );

        // do we have filesystem credentials?
        if ( ! Plugin::instance()->initialize_filesystem( $url, true ) ) {
            return new \WP_REST_Response( null, 500 );
        }

        $result = $wp_filesystem->delete( WP_CONTENT_DIR . '/object-cache.php' );

        if ( $result ) {
            ( new Predis() )->flush();
        }

        /**
         * Fires on cache disable event
         *
         * @since 1.3.5
         * @param bool $result Whether the filesystem event (deletion of the `object-cache.php` file) was successful.
         */
        do_action( 'redis_object_cache_disable', $result );

        $data = $result
            ? [
                'type' => 'success',
                'message' => __( 'Object cache disabled.', 'redis-cache' ),
            ]
            : [
                'type' => 'error',
                __( 'Object cache could not be disabled.', 'redis-cache' ),
            ];

        return new \WP_REST_Response( $data, $result ? 200 : 500 );
    }

    /**
     * Install the object cache drop-in and flush Redis if installation succeeds.
     *
     * @return \WP_REST_Response
     */
    public function enable_object_cache() {
        global $wp_filesystem;
        $url = Plugin::instance()->action_link( 'enable-cache' );

        // do we have filesystem credentials?
        if ( ! Plugin::instance()->initialize_filesystem( $url, true ) ) {
            return new \WP_REST_Response( null, 500 );
        }

        $result = $wp_filesystem->copy(
            WP_REDIS_PLUGIN_PATH . '/includes/object-cache.php',
            WP_CONTENT_DIR . '/object-cache.php',
            true,
            FS_CHMOD_FILE
        );
        if ( $result ) {
            ( new Predis() )->flush();
        }

        /**
         * Fires on cache enable event
         *
         * @since 1.3.5
         * @param bool $result Whether the filesystem event (copy of the `object-cache.php` file) was successful.
         */
        do_action( 'redis_object_cache_enable', $result );

        $data = $result
            ? [
                'type' => 'success',
                'message' => __( 'Object cache enabled.', 'redis-cache' ),
            ]
            : [
                'type' => 'error',
                __( 'Object cache could not be enabled.', 'redis-cache' ),
            ];

        return new \WP_REST_Response( $data, $result ? 200 : 500 );
    }

    /**
     * Flush the object cache and return the result.
     *
     * @return \WP_REST_Response
     */
    public function flush_cache() {
        $data = wp_cache_flush()
            ? [
                'type' => 'success',
                'message' => __( 'Object cache flushed.', 'redis-cache' ),
            ]
            : [
                'type' => 'error',
                'message' => __( 'Object cache could not be flushed.', 'redis-cache' ),
            ];

        return new \WP_REST_Response(
            $data,
            $data['type'] === 'success' ? 200 : 500
        );
    }

    /**
     * Replace the object cache drop-in with the bundled version without flushing Redis.
     *
     * @return \WP_REST_Response
     */
    public function update_dropin() {
        global $wp_filesystem;
        $url = Plugin::instance()->action_link( 'enable-cache' );

        // do we have filesystem credentials?
        if ( ! Plugin::instance()->initialize_filesystem( $url, true ) ) {
            return new \WP_REST_Response( null, 500 );
        }

        $result = $wp_filesystem->copy(
            WP_REDIS_PLUGIN_PATH . '/includes/object-cache.php',
            WP_CONTENT_DIR . '/object-cache.php',
            true,
            FS_CHMOD_FILE
        );

        /**
         * Fires on cache update-dropin event
         *
         * @since 1.3.5
         * @param bool $result Whether the filesystem event (copy of the `object-cache.php` file) was successful.
         */
        do_action( 'redis_object_cache_update_dropin', $result );

        $data = $result
            ? [
                'type' => 'success',
                'message' => __( 'Updated object cache drop-in and enabled Redis object cache.', 'redis-cache' ),
            ]
            : [
                'type' => 'error',
                __( 'Object cache drop-in could not be updated.', 'redis-cache' ),
            ];

        return new \WP_REST_Response( $data, $result ? 200 : 500 );
    }

    /**
     * Retrieves recorded metrics for the requested time window.
     *
     * @param \WP_REST_Request $request Request with an optional minTime parameter in seconds. Defaults to 1800 (30 minutes).
     * @return \WP_REST_Response Response containing the recorded metrics.
     */
    public function get_metrics( \WP_REST_Request $request ) {
        if ( ! Metrics::is_enabled() ) {
            return new \WP_REST_Response(
                [
                    'type' => 'error',
                    'message' => __( 'Metrics are not enabled', 'redis-cache' ),
                ],
                500
            );
        }

        if ( ! Plugin::instance()->get_redis_status() ) {
            return new \WP_REST_Response(
                [
                    'type' => 'error',
                    'message' => __( 'Redis is not available.', 'redis-cache' ),
                ],
                500
            );
        }

        $min_time = $request->get_param( 'minTime' ) ?? MINUTE_IN_SECONDS * 30;
        $metrics = Metrics::get( $min_time );

        return new \WP_REST_Response( compact( 'metrics' ), 200 );
    }
}
