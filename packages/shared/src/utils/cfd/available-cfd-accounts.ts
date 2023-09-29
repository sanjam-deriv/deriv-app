import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '../platform';

export interface AvailableAccount {
    name: string;
    description?: string;
    is_visible?: boolean;
    is_disabled?: boolean;
    platform?: string;
    market_type?: 'all' | 'financial' | 'synthetic';
    icon: string;
    availability: string;
    link_to?: string;
}

export const getCFDAvailableAccount = () => [
    {
        name: 'Derived',
        description: localize('Trade CFDs on MT5 with synthetics, baskets, and derived FX.'),
        platform: CFD_PLATFORMS.MT5,
        market_type: 'synthetic',
        icon: 'Derived',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv X',
        description: localize('Trade CFDs on Deriv X with financial markets and our Derived indices.'),
        platform: CFD_PLATFORMS.DXTRADE,
        market_type: 'all',
        icon: 'DerivX',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv cTrader',
        description: localize('This account offers CFDs on a feature-rich trading platform.'),
        platform: CFD_PLATFORMS.CTRADER,
        market_type: 'all',
        icon: 'CTrader',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv EZ',
        description: localize('Trade CFDs on an easy-to-get-started platform with all your favourite assets.'),
        platform: CFD_PLATFORMS.DERIVEZ,
        market_type: 'all',
        icon: 'DerivEz',
        availability: 'Non-EU',
    },
];
