import React from 'react';
import useDevice from '../../hooks/useDevice';
import IcAppstoreBinaryBot from '../../public/images/ic-appstore-binary-bot.svg';
import IcAppstoreDerivBot from '../../public/images/ic-appstore-deriv-bot.svg';
import IcAppstoreDerivGo from '../../public/images/ic-appstore-deriv-go.svg';
import IcAppstoreDerivTrader from '../../public/images/ic-appstore-deriv-trader.svg';
import IcAppstoreSmartTrader from '../../public/images/ic-appstore-smart-trader.svg';
import { PrimaryActionButton } from '../PrimaryActionButton';
import { TradingAccountCard } from '../TradingAccountCard';
import './OptionsAndMultipliersListing.scss';

const optionsAndMultipliers = [
    {
        description: 'Options and multipliers trading platform.',
        icon: <IcAppstoreDerivTrader />,
        title: 'Deriv Trader',
    },
    {
        description: 'Automate your trading, no coding needed.',
        icon: <IcAppstoreDerivBot />,
        title: 'Deriv Bot',
    },
    {
        description: 'Our legacy options trading platform.',
        icon: <IcAppstoreSmartTrader />,
        title: 'SmartTrader',
    },
    {
        description: 'Our legacy automated trading platform.',
        icon: <IcAppstoreBinaryBot />,
        title: 'Binary Bot',
    },
    {
        description: 'Trade on the go with our mobile app.',
        icon: <IcAppstoreDerivGo />,
        title: 'Deriv GO',
    },
];

const OptionsAndMultipliersListing = () => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-options-and-multipliers-listing'>
            <section className='wallets-options-and-multipliers-listing__header'>
                {!isMobile && (
                    <div className='wallets-options-and-multipliers-listing__header-title'>
                        {/* TODO: Localization needed*/}
                        <h1>Options & Multipliers</h1>
                    </div>
                )}
                <div className='wallets-options-and-multipliers-listing__header-subtitle'>
                    {/* TODO: Localization needed*/}
                    <h1>
                        Earn a range of payouts by correctly predicting market price movements with{' '}
                        <a className='wallets-options-and-multipliers-listing__header-subtitle__link' href='#' key={0}>
                            options
                        </a>
                        , or get the upside of CFDs without risking more than your initial stake with{' '}
                        <a className='wallets-options-and-multipliers-listing__header-subtitle__link' href='#' key={1}>
                            multipliers
                        </a>
                    </h1>
                </div>
            </section>
            <div className='wallets-options-and-multipliers-listing__content'>
                {optionsAndMultipliers.map(account => (
                    <TradingAccountCard
                        {...account}
                        key={`trading-account-card-${account.title}`}
                        leading={() => (
                            <div className='wallets-options-and-multipliers-listing__content__icon'>{account.icon}</div>
                        )}
                        trailing={() => (
                            <PrimaryActionButton>
                                <p className='wallets-options-and-multipliers-listing__content__text'>Open</p>
                            </PrimaryActionButton>
                        )}
                    >
                        <div className='wallets-options-and-multipliers-listing__content__details'>
                            <p className='wallets-options-and-multipliers-listing__content__details-title'>
                                {account.title}
                            </p>
                            <p className='wallets-options-and-multipliers-listing__content__details-description'>
                                {account.description}
                            </p>
                        </div>
                    </TradingAccountCard>
                ))}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
