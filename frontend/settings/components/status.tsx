import { Button } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { Card } from '@wordpress/ui';

import { CheckFilled } from '@redis-cache/settings/icons/checkFilled';

const { status, get_status, filesystem_allowed, filesystem_writable } = window.rediscache?.connection ?? {};

const fileSystemStatus = filesystem_writable ? 'writeable' : ! filesystem_allowed ? 'disabled' : 'not_writeable';

const fileSystemLable = filesystem_writable
    ? __( 'File System Writeable', 'redis-cache' )
    : ! filesystem_allowed
      ? __( 'File System Disabled', 'redis-cache' )
      : __( 'File System Not writeable', 'redis-cache' );

export const Status = () => (
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
                    <div className={ typeof status === 'string' || status === null ? 'error-circle' : 'active-circle' }>
                        { sprintf( __( 'Redis %s', 'redis-cache' ), get_status ) }
                    </div>
                    <div className="active-circle">{ __( 'Drop-in valid', 'redis-cache' ) }</div>
                    <div className={ fileSystemStatus !== 'writeable' ? 'error-circle' : 'active-circle' }>
                        { fileSystemLable }
                    </div>
                </div>
            </div>
            <div className="status-card__action-buttons">
                <Button
                    title={ __( 'Flush Cache', 'redis-cache' ) }
                    variant="primary"
                    role="button"
                    className="button-large"
                >
                    { __( 'Flush Cache', 'redis-cache' ) }
                </Button>
                <Button
                    title={ __( 'Disable Object Cache', 'redis-cache' ) }
                    variant="secondary"
                    role="button"
                    className="button-large"
                >
                    { __( 'Disable Object Cache', 'redis-cache' ) }
                </Button>
            </div>
        </Card.Content>
    </Card.Root>
);
