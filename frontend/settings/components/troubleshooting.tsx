import { Button } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Card } from '@wordpress/ui';

import { getDiagnostics } from '@redis-cache/api/diagnostics';
import { useSettings } from '@redis-cache/settings/hooks/use-settings';

declare global {
    interface Window {
        // biome-ignore lint/style/useNamingConvention: ClipboardJS is provided by WordPress.
        ClipboardJS?: new (
            trigger: Element,
            options: { text: () => string },
        ) => {
            on: ( event: 'success' | 'error', callback: ( event: { clearSelection: () => void } ) => void ) => void;
            destroy: () => void;
        };
    }
}

type DiagnosticsState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; report: string };

export const Troubleshooting = () => {
    const { settings } = useSettings();
    const [ diagnostics, setDiagnostics ] = useState< DiagnosticsState >( { status: 'loading' } );
    const [ copyStatus, setCopyStatus ] = useState< 'success' | 'error' | undefined >();
    const copyButtonRef = useRef< HTMLButtonElement >( null );

    useEffect( () => {
        const controller = new AbortController();
        setDiagnostics( { status: 'loading' } );
        setCopyStatus( undefined );

        getDiagnostics( controller.signal )
            .then( ( report ) => {
                if ( ! controller.signal.aborted ) setDiagnostics( { status: 'ready', report } );
            } )
            .catch( () => {
                if ( ! controller.signal.aborted ) setDiagnostics( { status: 'error' } );
            } );

        return () => controller.abort();
    }, [ settings ] );

    useEffect( () => {
        if ( ! copyStatus ) return;

        const id = setTimeout( () => setCopyStatus( undefined ), 5000 );
        return () => clearTimeout( id );
    }, [ copyStatus ] );

    useEffect( () => {
        if ( diagnostics.status !== 'ready' || ! copyButtonRef.current || ! window.ClipboardJS ) return;

        const clipboard = new window.ClipboardJS( copyButtonRef.current, {
            text: () => diagnostics.report,
        } );
        clipboard.on( 'success', ( event ) => {
            event.clearSelection();
            setCopyStatus( 'success' );
        } );
        clipboard.on( 'error', () => setCopyStatus( 'error' ) );

        return () => clipboard.destroy();
    }, [ diagnostics, copyStatus ] );

    return (
        <Card.Root className="troubleshooting-card">
            <Card.Header className="troubleshooting-card__header">
                <Card.Title>
                    <h2>{ __( 'Troubleshooting', 'redis-cache' ) }</h2>
                </Card.Title>
                { ! [ 'success', 'error' ].includes( copyStatus || '' ) && (
                    <Button
                        ref={ copyButtonRef }
                        variant="secondary"
                        size="compact"
                        disabled={ diagnostics.status !== 'ready' || ! window.ClipboardJS }
                    >
                        { __( 'Copy to clipboard', 'redis-cache' ) }
                    </Button>
                ) }
                { copyStatus === 'success' && <div className="success">{ __( 'Copied!', 'redis-cache' ) }</div> }
            </Card.Header>
            <Card.Content className="troubleshooting-card__content">
                { diagnostics.status === 'loading' && (
                    <p role="status">{ __( 'Loading diagnostics…', 'redis-cache' ) }</p>
                ) }
                { diagnostics.status === 'error' && (
                    <p role="alert">
                        { __( 'Diagnostics could not be loaded. Reload the page to try again.', 'redis-cache' ) }
                    </p>
                ) }
                { diagnostics.status === 'ready' && (
                    <textarea
                        className="troubleshooting-card__report"
                        aria-label={ __( 'Diagnostics', 'redis-cache' ) }
                        readOnly
                        rows={ 18 }
                        value={ diagnostics.report }
                    />
                ) }
                <p className="troubleshooting-card__feedback" role="status">
                    { copyStatus === 'error' && (
                        <div className="error">
                            __( 'Could not copy diagnostics. Select and copy the report manually.', 'redis-cache' )
                        </div>
                    ) }
                </p>
            </Card.Content>
        </Card.Root>
    );
};
