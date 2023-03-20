import React from 'react';
import { render, screen } from '@testing-library/react';
import P2PCashier from '../p2p-cashier';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';
import { TRootStore } from 'Types';
import CashierProviders from '../../../cashier-providers';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/p2p', () => jest.fn(() => 'P2P'));

describe('<P2PCashier />', () => {
    const history = createBrowserHistory();

    it('should render <Loading /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            notifications: {
                addNotificationMessage: jest.fn(),
                filterNotificationMessages: jest.fn(),
                refreshNotifications: jest.fn(),
                removeNotificationByKey: jest.fn(),
                removeNotificationMessage: jest.fn(),
                setP2POrderProps: jest.fn(),
            },
            client: {
                balance: '',
                currency: '',
                local_currency_config: {},
                loginid: '',
                is_logging_in: true,
                is_virtual: false,
                residence: '',
            },
            ui: {
                notification_messages_ui: null,
                is_dark_mode_on: false,
                is_mobile: false,
                setCurrentFocus: jest.fn(),
                current_focus: '',
            },
            common: {
                platform: '',
            },
            modules: {
                cashier: {
                    general_store: {
                        setNotificationCount: jest.fn(),
                        setOnRemount: jest.fn(),
                    },
                },
            },
        };

        render(
            <Router history={history}>
                <P2PCashier />
            </Router>,
            { wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders> }
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <P2P /> component', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            notifications: {
                addNotificationMessage: jest.fn(),
                filterNotificationMessages: jest.fn(),
                refreshNotifications: jest.fn(),
                removeNotificationByKey: jest.fn(),
                removeNotificationMessage: jest.fn(),
                setP2POrderProps: jest.fn(),
            },
            client: {
                balance: '',
                currency: '',
                local_currency_config: {},
                loginid: '',
                is_logging_in: false,
                is_virtual: false,
                residence: '',
            },
            ui: {
                notification_messages_ui: null,
                is_dark_mode_on: false,
                is_mobile: false,
                setCurrentFocus: jest.fn(),
                current_focus: '',
            },
            common: {
                platform: '',
            },
            modules: {
                cashier: {
                    general_store: {
                        setNotificationCount: jest.fn(),
                        setOnRemount: jest.fn(),
                    },
                },
            },
        };

        render(
            <Router history={history}>
                <P2PCashier />
            </Router>,
            { wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders> }
        );

        expect(screen.getByText('P2P')).toBeInTheDocument();
    });

    it('should redirect to "/cashier/p2p" page with "?order=1" query parameter', () => {
        const history_copy = { ...history, location: { ...history.location, search: 'order=1' } };
        const mockRootStore: DeepPartial<TRootStore> = {
            notifications: {
                addNotificationMessage: jest.fn(),
                filterNotificationMessages: jest.fn(),
                refreshNotifications: jest.fn(),
                removeNotificationByKey: jest.fn(),
                removeNotificationMessage: jest.fn(),
                setP2POrderProps: jest.fn(),
            },
            client: {
                balance: '',
                currency: '',
                local_currency_config: {},
                loginid: '',
                is_logging_in: false,
                is_virtual: false,
                residence: '',
            },
            ui: {
                notification_messages_ui: null,
                is_dark_mode_on: false,
                is_mobile: false,
                setCurrentFocus: jest.fn(),
                current_focus: '',
            },
            common: {
                platform: '',
            },
            modules: {
                cashier: {
                    general_store: {
                        setNotificationCount: jest.fn(),
                        setOnRemount: jest.fn(),
                    },
                },
            },
        };

        render(
            <Router history={history_copy}>
                <P2PCashier />
            </Router>,
            { wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders> }
        );

        expect(history.location.pathname).toBe(routes.cashier_p2p);
    });
});
