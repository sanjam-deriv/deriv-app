import DemoMessage from 'Components/demo-message';
import { PlatformContext } from '@deriv/shared';
import ProofOfAddressContainer from './proof-of-address-container.jsx';
import React from 'react';
import { observer, useStore } from '@deriv/stores';

const ProofOfAddress = observer(() => {
    const { client, notifications, common } = useStore();
    const { app_routing_history } = common;
    const {
        is_virtual,
        landing_company_shortcode,
        has_restricted_mt5_account,
        is_switching,
        account_settings,
        is_eu,
        states_list,
        fetchResidenceList,
        fetchStatesList,
    } = client;
    const { refreshNotifications, addNotificationMessageByKey, removeNotificationMessage, removeNotificationByKey } =
        notifications;
    const { is_appstore } = React.useContext(PlatformContext);
    if (is_virtual) return <DemoMessage has_demo_icon={is_appstore} has_button={true} />;

    return (
        <ProofOfAddressContainer
            is_mx_mlt={landing_company_shortcode === 'iom' || landing_company_shortcode === 'malta'}
            is_switching={is_switching}
            refreshNotifications={refreshNotifications}
            has_restricted_mt5_account={has_restricted_mt5_account}
            app_routing_history={app_routing_history}
            account_settings={account_settings}
            is_eu={is_eu}
            states_list={states_list}
            fetchResidenceList={fetchResidenceList}
            fetchStatesList={fetchStatesList}
            addNotificationMessageByKey={addNotificationMessageByKey}
            removeNotificationMessage={removeNotificationMessage}
            removeNotificationByKey={removeNotificationByKey}
        />
    );
});

export default ProofOfAddress;
