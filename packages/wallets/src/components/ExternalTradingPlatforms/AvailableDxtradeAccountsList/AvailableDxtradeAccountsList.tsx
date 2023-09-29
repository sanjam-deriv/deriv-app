import React from 'react';
import DerivX from '../../../public/images/derivx.svg';
import { DxtradeEnterPasswordModal } from '../../DxtradeEnterPasswordModal';
import { useModal } from '../../ModalProvider';
import { SecondaryActionButton } from '../../SecondaryActionButton';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AvailableDxtradeAccountsList.scss';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();

    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-dxtrade__icon'>
                    <DerivX />
                </div>
            )}
            trailing={() => (
                <SecondaryActionButton onClick={() => show(<DxtradeEnterPasswordModal />)}>
                    <p className='wallets-available-dxtrade__text'>Get</p>
                </SecondaryActionButton>
            )}
        >
            <div className='wallets-available-dxtrade__details'>
                <p className='wallets-available-dxtrade__details-title'>Deriv X</p>
                <p className='wallets-available-dxtrade__details-description'>
                    This account offers CFDs on a highly customisable CFD trading platform.
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
