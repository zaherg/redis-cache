import { Button, Snackbar } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, isRTL, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { Card } from '@wordpress/ui';

import { disable, enable, flush } from '@redis-cache/api/cache';
import { getData } from '@redis-cache/api/data';
import type { MessageResponse } from '@redis-cache/api/types';
import { useSettings } from '@redis-cache/settings/hooks/use-settings';
import { CheckCircle, PowerOff } from '@redis-cache/settings/icons';

const { Root, Content } = Card;

export const Status = () => {
    const { settings } = useSettings();
    const { status, getStatus, filesystemAllowed, filesystemWritable } = settings?.connection || {};
    const isActive = ! ( typeof status === 'string' || status === null );

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
                            { sprintf( __( 'Redis %s', 'redis-cache' ), getStatus ) }
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
    const [ notifications, setNotifications ] = useState< MessageResponse | undefined >();
    const { settings, setSettings } = useSettings();
    const refreshData = () => getData( setSettings );

    const runCacheAction = async ( action: () => Promise< MessageResponse > ) => {
        setNotifications( await action() );
        await refreshData();
    };

    return (
        <>
            <div className="status-card__action-buttons">
                { settings.connection.status && (
                    <Button
                        title={ __( 'Flush Cache', 'redis-cache' ) }
                        variant="tertiary"
                        role="button"
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
                        variant="tertiary"
                        role="button"
                        size="compact"
                        onClick={ () => runCacheAction( disable ) }
                    >
                        { __( 'Disable Object Cache', 'redis-cache' ) }
                    </Button>
                ) }
                { settings.connection.status === null && settings.connection.filesystemWritable === true && (
                    <Button
                        title={ __( 'Enable Object Cache', 'redis-cache' ) }
                        variant="tertiary"
                        role="button"
                        size="compact"
                        onClick={ () => runCacheAction( enable ) }
                    >
                        { __( 'Enable Object Cache', 'redis-cache' ) }
                    </Button>
                ) }
            </div>
            <div
                style={ {
                    position: 'absolute',
                    top: '10px',
                    right: isRTL() ? undefined : '20px',
                    left: isRTL() ? '20px' : undefined,
                } }
            >
                { notifications && (
                    <Snackbar onRemove={ () => setNotifications( undefined ) }>{ notifications?.message }</Snackbar>
                ) }
            </div>
        </>
    );
};
