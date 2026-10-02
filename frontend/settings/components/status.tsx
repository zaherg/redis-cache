import { Button } from '@wordpress/components';
import { createInterpolateElement, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { Card } from '@wordpress/ui';

import { disable, enable, flush } from '@redis-cache/api/cache';
import type { MessageResponse } from '@redis-cache/api/types';
import { Notification } from '@redis-cache/settings/components/notification';
import { CheckFilled } from '@redis-cache/settings/icons/checkFilled';

const { status, get_status, filesystem_allowed, filesystem_writable } = window.rediscache?.connection ?? {};

const fileSystemLabel = filesystem_writable
    ? __( 'File System Writeable', 'redis-cache' )
    : ! filesystem_allowed
      ? __( 'File System Disabled', 'redis-cache' )
      : __( 'File System Not writeable', 'redis-cache' );

export const Status = () => {
    const [ notifications, setNotifications ] = useState< MessageResponse | undefined >();
    const flushCache = async () => setNotifications( await flush() );
    const enableCache = async () => setNotifications( await enable() );
    const disableCache = async () => setNotifications( await disable() );

    return (
        <>
            { notifications && (
                <Notification
                    type={ notifications.type }
                    message={ notifications.message }
                    hideCloseButton={ false }
                    onClose={ () => setNotifications( undefined ) }
                    className="mb-4"
                />
            ) }
            <Card.Root className="status-card">
                <Card.Content className="status-card__content">
                    <div className="justify-start">
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
                                { sprintf( __( 'Redis %s', 'redis-cache' ), get_status ) }
                            </div>
                            <div className="active-circle">{ __( 'Drop-in valid', 'redis-cache' ) }</div>
                            <div className={ filesystem_writable ? 'active-circle' : 'error-circle' }>
                                { fileSystemLabel }
                            </div>
                        </div>
                    </div>
                    <div className="status-card__action-buttons">
                        <Button
                            title={ __( 'Flush Cache', 'redis-cache' ) }
                            variant="primary"
                            role="button"
                            className="button-large"
                            onClick={ flushCache }
                        >
                            { __( 'Flush Cache', 'redis-cache' ) }
                        </Button>
                        <Button
                            title={ __( 'Disable Object Cache', 'redis-cache' ) }
                            variant="secondary"
                            role="button"
                            className="button-large"
                            onClick={ disableCache }
                        >
                            { __( 'Disable Object Cache', 'redis-cache' ) }
                        </Button>
                        <Button
                            title={ __( 'Enable Object Cache', 'redis-cache' ) }
                            variant="secondary"
                            role="button"
                            className="button-large"
                            onClick={ enableCache }
                        >
                            { __( 'Enable Object Cache', 'redis-cache' ) }
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </>
    );
};
