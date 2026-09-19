import { useContext } from '@wordpress/element';

import { SettingsContext } from '@redis-cache/settings/data/settings';

export const useSettings = () => useContext( SettingsContext );
