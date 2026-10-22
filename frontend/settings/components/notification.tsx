import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Notice } from '@wordpress/ui';
import type { ReactNode } from 'react';

interface NotificationProps {
    type: 'success' | 'error' | 'warning';
    message: ReactNode | string;
    hideTitle?: boolean;
    hideCloseButton?: boolean;
    /** Delay in milliseconds, default 6s, disabled when omitted or the close button is visible. */
    autoDismiss?: number;
    onClose?: () => void;
    className?: string;
}

const { Root, Title, Description, CloseIconButton } = Notice;

export const Notification = ( {
    type,
    message,
    hideTitle = true,
    hideCloseButton = true,
    autoDismiss = 6000,
    onClose,
    className = '',
}: NotificationProps ) => {
    useEffect( () => {
        if ( ! hideCloseButton || ! onClose || ! Number.isFinite( autoDismiss ) || autoDismiss <= 0 ) {
            return;
        }

        const timeout = window.setTimeout( onClose, autoDismiss );

        return () => window.clearTimeout( timeout );
    }, [ autoDismiss, hideCloseButton, message, onClose ] );

    return (
        <Root intent={ type } className={ `notification ${ className }` }>
            { ! hideTitle && <Title>{ __( 'Notice', 'redis-cache' ) }</Title> }
            <Description>{ message }</Description>
            { ! hideCloseButton && <CloseIconButton onClick={ onClose } /> }
        </Root>
    );
};
