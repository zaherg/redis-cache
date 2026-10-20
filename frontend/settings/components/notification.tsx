import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/ui';
import type { ReactNode } from 'react';

interface NotificationProps {
    type: 'success' | 'error' | 'warning';
    message: ReactNode | string;
    hideTitle?: boolean;
    hideCloseButton?: boolean;
    onClose?: () => void;
    className?: string;
}

const { Root, Title, Description, CloseIconButton } = Notice;

export const Notification = ( {
    type,
    message,
    hideTitle = true,
    hideCloseButton = true,
    onClose,
    className = '',
}: NotificationProps ) => (
    <Root intent={ type } className={ className }>
        { ! hideTitle && <Title>{ __( 'Notice', 'redis-cache' ) }</Title> }
        <Description>{ message }</Description>
        { ! hideCloseButton && <CloseIconButton onClick={ onClose } /> }
    </Root>
);
