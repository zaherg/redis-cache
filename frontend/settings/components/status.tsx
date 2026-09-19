import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { Card } from '@wordpress/ui';

import { disable, enable, flush } from '@redis-cache/api/cache';
import { getData } from '@redis-cache/api/data';
import type { MessageResponse } from '@redis-cache/api/types';
import { Notification } from '@redis-cache/settings/components/notification';
import { useSettings } from '@redis-cache/settings/hooks/use-settings';
import { CheckCircle, PowerOff } from '@redis-cache/settings/icons';

const { Root, Content } = Card;

const getErrorMessage = ( error: unknown ) => {
    if ( typeof error === 'object' && error !== null && 'message' in error ) {
        const { message } = error;
        if ( typeof message === 'string' && message.trim() ) {
            return message;
        }
    }

    return __( 'An unknown error occurred.', 'redis-cache' );
};

export const Status = () => {
    const { settings } = useSettings();
    const { status, getStatus, filesystemAllowed, filesystemWritable, connection, prefix } = settings?.connection || {};
    const isActive = status === true;

    const fileSystemLabel =
        filesystemWritable === true
            ? __( 'File System Writeable', 'redis-cache' )
            : ! filesystemAllowed
              ? __( 'File System Disabled', 'redis-cache' )
              : __( 'File System Not writeable', 'redis-cache' );

    const dropinClassName = settings.isDropinOutdated
        ? 'warning-circle'
        : settings.isCacheDropinValid
          ? 'active-circle'
          : 'error-circle';

    return (
        <Root className="status-card">
            <Content className="status-card__content">
                <div className="shrink-0">
                    <Icon
                        icon={ isActive ? CheckCircle : PowerOff }
                        size={ 40 }
                        className={ isActive ? 'green' : 'red' }
                    />
                </div>
                <div className="status-card__status">
                    <div className="status-card__features-stats">
                        <div className={ isActive ? 'active-circle' : 'error-circle' }>
                            { sprintf(
                                // translator: %s is the status we get back from the server.
                                __( 'Status %s', 'redis-cache' ),
                                getStatus,
                            ) }
                        </div>
                        <div className={ dropinClassName }>
                            { settings.isDropinOutdated
                                ? __( 'Drop-in outdated', 'redis-cache' )
                                : settings.isCacheDropinValid
                                  ? __( 'Drop-in valid', 'redis-cache' )
                                  : __( 'Drop-in invalid', 'redis-cache' ) }
                        </div>
                        <div className={ filesystemWritable === true ? 'active-circle' : 'error-circle' }>
                            { fileSystemLabel }
                        </div>
                    </div>
                </div>
                <ActionButtons />
            </Content>
        </Root>
    );
};

const ActionButtons = () => {
    const [ notification, setNotification ] = useState< MessageResponse | undefined >();
    const { settings, setSettings } = useSettings();
    const refreshData = () => getData( setSettings );

    const runCacheAction = async ( action: () => Promise< MessageResponse > ) => {
        try {
            const response: MessageResponse = await action();
            setNotification( response );
            await refreshData();
        } catch ( error ) {
            setNotification( {
                type: 'error',
                // translators: %s = request error message.
                message: sprintf( __( 'Cache request failed: %s', 'redis-cache' ), getErrorMessage( error ) ),
            } );
        }
    };

    return (
        <>
            <div className="status-card__action-buttons">
                { settings.connection.status && (
                    <Button
                        title={ __( 'Flush Cache', 'redis-cache' ) }
                        variant="secondary"
                        size="compact"
                        onClick={ () => runCacheAction( flush ) }
                    >
                        { __( 'Flush Cache', 'redis-cache' ) }
                    </Button>
                ) }
                { settings.isCacheDropinValid && settings.connection.filesystemAllowed && (
                    <Button
                        title={ __( 'Disable Object Cache', 'redis-cache' ) }
                        isDestructive
                        variant="secondary"
                        size="compact"
                        onClick={ () => runCacheAction( disable ) }
                    >
                        { __( 'Disable Object Cache', 'redis-cache' ) }
                    </Button>
                ) }
                { settings.connection.status === null && settings.connection.filesystemWritable === true && (
                    <Button
                        title={ __( 'Enable Object Cache', 'redis-cache' ) }
                        variant="secondary"
                        size="compact"
                        onClick={ () => runCacheAction( enable ) }
                    >
                        { __( 'Enable Object Cache', 'redis-cache' ) }
                    </Button>
                ) }
            </div>
            <div className="notifications-container">
                { notification && (
                    <Notification
                        type={ notification.type }
                        message={ notification.message }
                        onClose={ () => setNotification( undefined ) }
                    />
                ) }
            </div>
        </>
    );
};
