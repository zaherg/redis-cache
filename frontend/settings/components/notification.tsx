import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/ui';

export const Notification = ( {
    type,
    message,
    hideTitle = true,
    hideCloseButton = true,
}: {
    type: 'success' | 'error' | 'warning';
    message: string;
    hideTitle?: boolean;
    hideCloseButton?: boolean;
} ) => (
    <Notice.Root intent={ type }>
        { ! hideTitle && <Notice.Title>{ __( 'Notice', 'redis-cache' ) }</Notice.Title> }
        <Notice.Description>{ message }</Notice.Description>
        { ! hideCloseButton && <Notice.CloseIcon /> }
    </Notice.Root>
);
