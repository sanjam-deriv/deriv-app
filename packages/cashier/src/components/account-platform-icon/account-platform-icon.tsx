import React from 'react';
import { Icon } from '@deriv/components';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';
import { TAccountsList } from 'Types';

type TAccountPlatformIcon = {
    size: number;
    account: TAccountsList['account'];
    is_pre_appstore: boolean;
    icon_class_name?: string;
    appstore_icon_class_name?: string;
    appstoreIconOnClickHandler?: () => void;
};

const AccountPlatformIcon = ({
    account,
    is_pre_appstore,
    size,
    icon_class_name,
    appstore_icon_class_name,
    appstoreIconOnClickHandler,
}: TAccountPlatformIcon) => {
    return is_pre_appstore && account.is_mt && account.platform_icon ? (
        <TradingPlatformIcon
            icon={account.platform_icon}
            size={size}
            className={appstore_icon_class_name}
            onClick={appstoreIconOnClickHandler}
        />
    ) : (
        <Icon
            icon={account.platform_icon || `IcCurrency-${account?.currency?.toLowerCase()}`}
            size={size}
            className={icon_class_name}
        />
    );
};

export default AccountPlatformIcon;
