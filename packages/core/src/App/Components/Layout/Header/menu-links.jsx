import React from 'react';
import { Text, Icon, Counter } from '@deriv/components';
import { BinaryLink } from '../../Routes';
import { observer, useStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useP2PNotificationCount } from '@deriv/hooks';
import './menu-links.scss';
import { useHistory } from 'react-router';

const MenuItems = ({ id, text, icon, link_to, handleClickCashier }) => {
    return (
        <BinaryLink
            id={id}
            key={icon}
            to={link_to}
            className='header__menu-link'
            active_class='header__menu-link--active'
            onClick={handleClickCashier}
        >
            <Text size='m' line_height='xs' title={text} className='header__menu-link-text'>
                {icon}
                {text}
            </Text>
        </BinaryLink>
    );
};

const ReportTab = () => (
    <MenuItems
        id={'dt_reports_tab'}
        icon={<Icon icon='IcReports' className='header__icon' />}
        text={localize('Reports')}
        link_to={routes.reports}
    />
);

const CashierTab = observer(() => {
    const { client, ui } = useStore();
    const { has_any_real_account, is_virtual } = client;
    const { toggleReadyToDepositModal } = ui;
    const p2p_notification_count = useP2PNotificationCount();

    const history = useHistory();

    const toggle_modal_routes =
        window.location.pathname === routes.root || window.location.pathname === routes.traders_hub;

    const toggleModal = () => {
        if (toggle_modal_routes && !has_any_real_account) {
            toggleReadyToDepositModal();
        }
    };

    const handleClickCashier = () => {
        if (!has_any_real_account && is_virtual) {
            toggleModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    const cashier_redirect = toggle_modal_routes && !has_any_real_account && is_virtual;

    return (
        <MenuItems
            id={'dt_cashier_tab'}
            icon={
                <>
                    <Icon icon='IcCashier' className='header__icon' />
                    {p2p_notification_count > 0 && (
                        <Counter className='cashier__counter' count={p2p_notification_count} />
                    )}
                </>
            }
            text={localize('Cashier')}
            link_to={!cashier_redirect ? routes.cashier : null}
            handleClickCashier={handleClickCashier}
        />
    );
});

const MenuLinks = observer(() => {
    const { client, common, ui } = useStore();
    const { is_logged_in } = client;
    const { current_language } = common;
    const { is_mobile } = ui;
    const is_traders_hub = window.location.pathname === routes.traders_hub;

    if (!is_logged_in) return <></>;

    return (
        <div key={`menu-links__${current_language}`} className='header__menu-links'>
            {!is_traders_hub && <ReportTab />}
            {!is_mobile && <CashierTab />}
        </div>
    );
});

export { MenuLinks };
