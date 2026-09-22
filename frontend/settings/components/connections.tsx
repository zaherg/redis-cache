import { __, sprintf } from '@wordpress/i18n';
import { Card } from '@wordpress/ui';

const { connection } = window.rediscache ?? {};

export const Connections = () => {
    if ( ! connection.status ) return;

    const diagnostics = connection.diagnostics;
    if ( ! connection.status || ! diagnostics ) return;

    const username =
        diagnostics?.username ??
        ( Array.isArray( diagnostics?.password ) ? ( diagnostics.password[ 0 ] ?? null ) : null );

    return (
        <Card.Root className="connections-card">
            <Card.Header className="connections-card__header">
                <Card.Title>
                    <h2>{ __( 'Connection', 'redis-cache' ) }</h2>
                </Card.Title>
            </Card.Header>
            <Card.Content className="connections-card__content">
                <table className="connections-card__table font-md" aria-label={ __( 'Connection', 'redis-cache' ) }>
                    <tbody>
                        { connection.redis_client && (
                            <tr>
                                <th scope="row">{ __( 'Client', 'redis-cache' ) }</th>
                                <td>{ connection.redis_client }</td>
                            </tr>
                        ) }
                        { ( diagnostics.host || diagnostics?.path ) && (
                            <tr>
                                <th scope="row">{ __( 'Host', 'redis-cache' ) }</th>
                                <td>{ diagnostics.host ?? diagnostics.path }</td>
                            </tr>
                        ) }
                        { diagnostics.cluster && (
                            <tr>
                                <th scope="row">{ __( 'Cluster', 'redis-cache' ) }</th>
                                <td>
                                    <ul className="mt-0 mb-0 pl-0">
                                        { diagnostics.cluster.map( ( node: string, index: number ) => (
                                            <li className="mt-0 mb-0" key={ index }>
                                                { node }
                                            </li>
                                        ) ) }
                                    </ul>
                                </td>
                            </tr>
                        ) }
                        { diagnostics.shards && (
                            <tr>
                                <th scope="row">{ __( 'Shards', 'redis-cache' ) }</th>
                                <td>
                                    <ul className="mt-0 mb-0 pl-0">
                                        { diagnostics.shards.map( ( node: string, index: number ) => (
                                            <li className="mt-0 mb-0" key={ index }>
                                                { node }
                                            </li>
                                        ) ) }
                                    </ul>
                                </td>
                            </tr>
                        ) }
                        { diagnostics.servers && (
                            <tr>
                                <th scope="row">{ __( 'Servers', 'redis-cache' ) }</th>
                                <td>
                                    <ul className="mt-0 mb-0 pl-0">
                                        { diagnostics.servers.map( ( node: string, index: number ) => (
                                            <li className="mt-0 mb-0" key={ index }>
                                                { node }
                                            </li>
                                        ) ) }
                                    </ul>
                                </td>
                            </tr>
                        ) }
                        { diagnostics.port && (
                            <tr>
                                <th scope="row">{ __( 'Port', 'redis-cache' ) }</th>
                                <td>{ diagnostics.port }</td>
                            </tr>
                        ) }
                        { username && (
                            <tr>
                                <th scope="row">{ __( 'Username', 'redis-cache' ) }</th>
                                <td>{ username }</td>
                            </tr>
                        ) }

                        { diagnostics.password && (
                            <tr>
                                <th scope="row">{ __( 'Password', 'redis-cache' ) }</th>
                                <td>
                                    <code>••••••••</code>
                                </td>
                            </tr>
                        ) }

                        { diagnostics.database !== '' && (
                            <tr>
                                <th scope="row">{ __( 'Database', 'redis-cache' ) }</th>
                                <td>{ diagnostics.database }</td>
                            </tr>
                        ) }

                        { connection.redis_version && (
                            <tr>
                                <th scope="row">{ __( 'Redis Version', 'redis-cache' ) }</th>
                                <td>{ connection.redis_version ?? __( 'Unknown', 'redis-cache' ) }</td>
                            </tr>
                        ) }

                        { diagnostics.timeout && (
                            <tr>
                                <th scope="row">{ __( 'Connection Timeout', 'redis-cache' ) }</th>
                                <td>
                                    { sprintf(
                                        // translators: %s = Redis connection/read timeout in seconds.
                                        __( '%ss', 'redis-cache' ),
                                        diagnostics.timeout,
                                    ) }
                                </td>
                            </tr>
                        ) }

                        { diagnostics.read_timeout && (
                            <tr>
                                <th scope="row">{ __( 'Read Timeout', 'redis-cache' ) }</th>
                                <td>
                                    { sprintf(
                                        // translators: %s = Redis connection/read timeout in seconds.
                                        __( '%ss', 'redis-cache' ),
                                        diagnostics.read_timeout,
                                    ) }
                                </td>
                            </tr>
                        ) }

                        { diagnostics.retry_interval && (
                            <tr>
                                <th scope="row">{ __( 'Retry Interval', 'redis-cache' ) }</th>
                                <td>
                                    { sprintf(
                                        // translators: %s = Redis retry interval in milliseconds.
                                        __( '%sms', 'redis-cache' ),
                                        diagnostics.retry_interval,
                                    ) }
                                </td>
                            </tr>
                        ) }
                    </tbody>
                </table>
            </Card.Content>
        </Card.Root>
    );
};
