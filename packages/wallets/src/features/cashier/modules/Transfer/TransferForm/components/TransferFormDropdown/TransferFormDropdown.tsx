import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { useAccountsList } from '@deriv/api';
import { useModal } from '../../../../../../../components/ModalProvider';
import { WalletListCardBadge } from '../../../../../../../components/WalletListCardBadge';
import IcDropdown from '../../../../../../../public/images/ic-dropdown.svg';
import TransferFormAccountCard from '../TransferFormAccountCard/TransferFormAccountCard';
import TransferFormAccountSelection from '../TransferFormAccountSelection/TransferFormAccountSelection';
import './TransferFormDropdown.scss';

type TProps = {
    fieldName: string;
    initialAccount?: NonNullable<ReturnType<typeof useAccountsList>['data']>[number];
    label: string;
};

const TransferFormDropdown: React.FC<TProps> = ({ fieldName, initialAccount, label }) => {
    const [selectedAccount, setSelectedAccount] = useState(initialAccount);
    const modal = useModal();

    const { setFieldValue } = useFormikContext();

    const handleSelect = (value: typeof selectedAccount) => {
        setSelectedAccount(value);
        setFieldValue(fieldName, value);
    };

    return (
        <div className='wallets-transfer-form-dropdown'>
            <div className='wallets-transfer-form-dropdown__divider' />
            <div className='wallets-transfer-form-dropdown__content'>
                <span className='wallets-transfer-form-dropdown__content__label'>{label}</span>
                <div className='wallets-transfer-form-dropdown__content__selection'>
                    {selectedAccount && <TransferFormAccountCard account={selectedAccount} type='input' />}
                </div>
            </div>
            <div className='wallets-transfer-form-dropdown__icons'>
                {selectedAccount && (
                    <WalletListCardBadge
                        isDemo={selectedAccount?.is_virtual}
                        label={selectedAccount?.landing_company_name}
                    />
                )}
                <IcDropdown
                    className='wallets-transfer-form-dropdown__icons-dropdown'
                    onClick={() => modal.show(<TransferFormAccountSelection label={label} onSelect={handleSelect} />)}
                />
            </div>
        </div>
    );
};

export default TransferFormDropdown;
