import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/ui';

interface NotificationProbs {
    type: 'success' | 'error' | 'warning';
    message: string;
    hideTitle?: boolean;
    hideCloseButton?: boolean;
    onClose?: () => void;
    className?: string;
}

export const Notification = ( {
    type,
    message,
    hideTitle = true,
    hideCloseButton = true,
    onClose,
    className = '',
}: NotificationProbs ) => (
    <Notice.Root intent={ type } className={ className }>
        { ! hideTitle && <Notice.Title>{ __( 'Notice', 'redis-cache' ) }</Notice.Title> }
        <Notice.Description>{ message }</Notice.Description>
        { ! hideCloseButton && <Notice.CloseIcon onClick={ onClose } /> }
    </Notice.Root>
);
