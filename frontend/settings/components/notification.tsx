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

const { Root, Title, Description, CloseIconButton, } = Notice;

export const Notification = ( {
    type,
    message,
    hideTitle = true,
    hideCloseButton = true,
    onClose,
    className = '',
}: NotificationProbs ) => (
    <Root intent={ type } className={ className }>
        { ! hideTitle && <Title>{ __( 'Notice', 'redis-cache' ) }</Title> }
        <Description>{ message }</Description>
        { ! hideCloseButton && <CloseIconButton onClick={ onClose } /> }
    </Root>
);
