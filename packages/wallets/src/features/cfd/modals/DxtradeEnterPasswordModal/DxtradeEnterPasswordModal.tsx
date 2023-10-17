import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useCreateOtherCFDAccount } from '@deriv/api';
import { ModalWrapper } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import DxTradePasswordIcon from '../../../../public/images/ic-dxtrade-password.svg';
import { CreatePassword } from '../../screens';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const [password, setPassword] = useState('');
    const { isSuccess, mutate } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { hide } = useModal();

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: activeWallet?.is_virtual ? 'demo' : 'real',
                market_type: 'all',
                password,
                platform: 'dxtrade',
            },
        });
    };

    useEffect(() => {
        if (isSuccess) hide();
    }, [hide, isSuccess]);

    return (
        <ModalWrapper>
            <CreatePassword
                icon={<DxTradePasswordIcon />}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                platform='dxtrade'
            />
        </ModalWrapper>
    );
};

export default DxtradeEnterPasswordModal;
