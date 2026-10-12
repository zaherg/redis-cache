import { createContext, useState } from '@wordpress/element';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

import type { RedisCache } from '@redis-cache/types/rediscache';

interface SettingsContextValue {
    settings: RedisCache;
    setSettings: Dispatch< SetStateAction< RedisCache > >;
}

export const SettingsContext = createContext< SettingsContextValue >( {
    settings: window?.rediscache || {},
    setSettings: () => {},
} );

export const SettingsContextProvider = ( { children }: { children: ReactNode } ) => {
    const [ settings, setSettings ] = useState< RedisCache >( window?.rediscache || {} );

    return <SettingsContext.Provider value={ { settings, setSettings } }>{ children }</SettingsContext.Provider>;
};
