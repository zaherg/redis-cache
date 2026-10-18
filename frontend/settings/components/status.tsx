import { Button, Snackbar } from '@wordpress/components';
import { createInterpolateElement, useState } from '@wordpress/element';
import { __, isRTL, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { Card } from '@wordpress/ui';

import { disable, enable, flush } from '@redis-cache/api/cache';
import { getData } from '@redis-cache/api/data';
import type { MessageResponse } from '@redis-cache/api/types';
import { useSettings } from '@redis-cache/settings/hooks/use-settings';
import { CheckFilled } from '@redis-cache/settings/icons/checkFilled';

export const Status = () => {
    const { settings } = useSettings();
    const { status, getStatus, filesystemAllowed, filesystemWritable } = settings?.connection || {};

    const fileSystemLabel =
        filesystemWritable === true
            ? __( 'File System Writeable', 'redis-cache' )
            : ! filesystemAllowed
              ? __( 'File System Disabled', 'redis-cache' )
              : __( 'File System Not writeable', 'redis-cache' );

    return (
        <Card.Root className="status-card">
            <Card.Content className="status-card__content">
                <div className="shrink-0">
                    <Icon icon={ CheckFilled } size={ 48 } className="green" />
                </div>
                <div className="status-card__status">
                    <div className="flex flex-col">
                        <span className="font-xl">
                            { createInterpolateElement(
                                __( '<strong>Redis Object Cache is active</strong>', 'redis-cache' ),
                                { strong: <strong /> },
                            ) }
                        </span>
                    </div>
                    <div className="status-card__features-stats">
                        <div
                            className={
                                typeof status === 'string' || status === null ? 'error-circle' : 'active-circle'
                            }
                        >
                            { sprintf( __( 'Redis %s', 'redis-cache' ), getStatus ) }
                        </div>
                        <div className="active-circle">{ __( 'Drop-in valid', 'redis-cache' ) }</div>
                        <div className={ filesystemWritable === true ? 'active-circle' : 'error-circle' }>
                            { fileSystemLabel }
                        </div>
                    </div>
                </div>
                <ActionButtons />
            </Card.Content>
        </Card.Root>
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
                        variant="primary"
                        role="button"
                        className="button-large"
                        onClick={ () => runCacheAction( flush ) }
                    >
                        { __( 'Flush Cache', 'redis-cache' ) }
                    </Button>
                ) }
                { settings.isCacheDropinValid && settings.connection.filesystemAllowed && (
                    <Button
                        title={ __( 'Disable Object Cache', 'redis-cache' ) }
                        variant="secondary"
                        role="button"
                        className="button-large"
                        onClick={ () => runCacheAction( disable ) }
                    >
                        { __( 'Disable Object Cache', 'redis-cache' ) }
                    </Button>
                ) }
                { settings.connection.status === null && settings.connection.filesystemWritable === true && (
                    <Button
                        title={ __( 'Enable Object Cache', 'redis-cache' ) }
                        variant="secondary"
                        role="button"
                        className="button-large"
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
