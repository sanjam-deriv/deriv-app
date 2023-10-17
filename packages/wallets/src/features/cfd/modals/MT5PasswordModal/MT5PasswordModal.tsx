import React, { useState } from 'react';
import {
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useSortedMT5Accounts,
} from '@deriv/api';
import { ModalWrapper } from '../../../../components/Base';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { AccountReady, CreatePassword, EnterPassword } from '../../screens';

type TProps = {
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType }) => {
    const [password, setPassword] = useState('');
    const { isSuccess, mutate } = useCreateMT5Account();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();

    const hasMT5Account = mt5Accounts?.find(account => account.login);

    const onSubmit = () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;

        mutate({
            payload: {
                account_type: activeWallet?.is_virtual ? 'demo' : accountType,
                company: 'svg',
                country: settings?.country_code || '',
                email: settings?.email || '',
                leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage || 500,
                mainPassword: password,
                ...(marketType === 'financial' && { mt5_account_type: 'financial' }),
                ...(marketType === 'all' && { sub_account_category: 'swap_free' }),
                name: settings?.first_name || '',
            },
        });
    };

    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {isSuccess && <AccountReady marketType={marketType} />}
            {!isSuccess &&
                (hasMT5Account ? (
                    <EnterPassword
                        marketType={marketType}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        platform='mt5'
                    />
                ) : (
                    <CreatePassword
                        icon={<MT5PasswordIcon />}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        platform='mt5'
                    />
                ))}
        </ModalWrapper>
    );
};

export default MT5PasswordModal;
