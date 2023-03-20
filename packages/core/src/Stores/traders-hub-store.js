import { action, makeObservable, observable, reaction, computed, runInAction } from 'mobx';
import { getCFDAvailableAccount, CFD_PLATFORMS, ContentFlag, formatMoney, getAppstorePlatforms } from '@deriv/shared';
import BaseStore from './base-store';
import { localize } from '@deriv/translations';
import { isEuCountry } from '_common/utility';
import { getMultipliersAccountStatus } from './Helpers/client';

export default class TradersHubStore extends BaseStore {
    available_platforms = [];
    available_cfd_accounts = [];
    available_mt5_accounts = [];
    available_dxtrade_accounts = [];
    combined_cfd_mt5_accounts = [];
    selected_account_type;
    selected_region;
    is_onboarding_visited = false;
    is_balance_calculating = false;
    is_failed_verification_modal_visible = false;
    is_regulators_compare_modal_visible = false;
    is_tour_open = false;
    is_account_type_modal_visible = false;
    account_type_card = '';
    selected_platform_type = 'options';
    active_index = 0;
    open_failed_verification_for = '';
    platform_demo_balance = { balance: 0, currency: 'USD' };
    platform_real_balance = { balance: 0, currency: 'USD' };
    cfd_demo_balance = { balance: 0, currency: 'USD' };
    cfd_real_balance = { balance: 0, currency: 'USD' };
    modal_data = {
        active_modal: '',
        data: {},
    };
    is_account_transfer_modal_open = false;
    selected_account = {};

    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            account_type_card: observable,
            available_cfd_accounts: observable,
            available_dxtrade_accounts: observable,
            available_mt5_accounts: observable,
            available_platforms: observable,
            cfd_demo_balance: observable,
            cfd_real_balance: observable,
            combined_cfd_mt5_accounts: observable,
            is_account_transfer_modal_open: observable,
            is_account_type_modal_visible: observable,
            is_regulators_compare_modal_visible: observable,
            is_failed_verification_modal_visible: observable,
            is_balance_calculating: observable,
            is_tour_open: observable,
            modal_data: observable,
            is_onboarding_visited: observable,
            platform_demo_balance: observable,
            platform_real_balance: observable,
            selected_account: observable,
            selected_account_type: observable,
            selected_platform_type: observable,
            selected_region: observable,
            open_failed_verification_for: observable,
            can_get_more_cfd_mt5_accounts: computed,
            closeModal: action.bound,
            content_flag: computed,
            getAccount: action.bound,
            getAvailableCFDAccounts: action.bound,
            getAvailableDxtradeAccounts: action.bound,
            getExistingAccounts: action.bound,
            handleTabItemClick: action.bound,
            has_any_real_account: computed,
            is_demo_low_risk: computed,
            is_demo: computed,
            is_eu_selected: computed,
            is_real: computed,
            is_currency_switcher_disabled_for_mf: computed,
            no_CR_account: computed,
            no_MF_account: computed,
            multipliers_account_status: computed,
            openDemoCFDAccount: action.bound,
            openModal: action.bound,
            openRealAccount: action.bound,
            selectAccountType: action.bound,
            selectAccountTypeCard: action.bound,
            switchToCRAccount: action.bound,
            selectRegion: action.bound,
            setCombinedCFDMT5Accounts: action.bound,
            setSelectedAccount: action.bound,
            setTogglePlatformType: action.bound,
            should_show_exit_traders_modal: computed,
            show_eu_related_content: computed,
            startTrade: action.bound,
            toggleAccountTransferModal: action.bound,
            toggleAccountTypeModalVisibility: action.bound,
            setIsOnboardingVisited: action.bound,
            toggleFailedVerificationModalVisibility: action.bound,
            openFailedVerificationModal: action.bound,
            toggleIsTourOpen: action.bound,
            toggleRegulatorsCompareModal: action.bound,
            updatePlatformBalance: action.bound,
            showTopUpModal: action.bound,
        });

        reaction(
            () => [
                this.selected_account_type,
                this.selected_region,
                this.root_store.client.is_switching,
                this.root_store.client.mt5_login_list,
                this.root_store.client.dxtrade_accounts_list,
                this.is_demo_low_risk,
                this.root_store.modules?.cfd?.current_list,
                this.root_store.common.current_language,
            ],
            () => {
                this.getAvailablePlatforms();
                this.getAvailableCFDAccounts();
            }
        );

        reaction(
            () => [
                this.selected_region,
                this.root_store.client.is_landing_company_loaded,
                this.root_store.client.loginid,
            ],
            () => {
                if (this.selected_account_type === 'real') {
                    this.setSwitchEU();
                }
            }
        );

        reaction(
            () => [this.root_store.client.loginid, this.root_store.client.residence],
            () => {
                const residence = this.root_store.client.residence;
                const active_demo = /^VRT/.test(this.root_store.client.loginid);
                const active_real_mf = /^MF/.test(this.root_store.client.loginid);

                const default_region = () => {
                    if (((active_demo || active_real_mf) && isEuCountry(residence)) || active_real_mf) {
                        return 'EU';
                    }
                    return 'Non-EU';
                };
                this.selected_account_type = !/^VRT/.test(this.root_store.client.loginid) ? 'real' : 'demo';
                this.selected_region = default_region();
            }
        );

        reaction(
            () => [
                this.root_store.client.balance,
                this.root_store.client.loginid,
                this.root_store.client.obj_total_balance,
                this.root_store.client.mt5_login_list,
                this.root_store.client.dxtrade_accounts_list,
                this.root_store.accounts,
                this.selected_account_type,
                this.selected_region,
            ],
            async () => {
                await this.updatePlatformBalance();
            }
        );
    }

    async setSwitchEU() {
        const { account_list, switchAccount, loginid, setIsLoggingIn } = this.root_store.client;

        const mf_account = account_list.find(acc => acc.loginid?.startsWith('MF'))?.loginid;
        const cr_account = account_list.find(acc => acc.loginid?.startsWith('CR'))?.loginid;

        if (this.selected_region === 'EU' && !loginid?.startsWith('MF')) {
            // if active_loginid is already EU = do nothing
            await switchAccount(mf_account).then(() => {
                setIsLoggingIn(false);
            });
        } else if (this.selected_region === 'Non-EU' && !loginid?.startsWith('CR')) {
            await switchAccount(cr_account).then(() => {
                setIsLoggingIn(false);
            });
        }
    }

    get no_MF_account() {
        const { has_maltainvest_account } = this.root_store.client;
        return this.selected_region === 'EU' && !has_maltainvest_account;
    }

    get no_CR_account() {
        const { active_accounts } = this.root_store.client;
        const result = active_accounts.some(acc => acc.landing_company_shortcode === 'svg');
        return !result && this.selected_region === 'Non-EU';
    }

    setSelectedAccount(account) {
        this.selected_account = account;
    }

    async selectAccountType(account_type) {
        const { account_list, switchAccount, prev_real_account_loginid } = this.root_store.client;

        if (account_type === 'demo') {
            await switchAccount(account_list.find(acc => acc.is_virtual && !acc.is_disabled)?.loginid);
        } else if (account_type === 'real') {
            if (prev_real_account_loginid) {
                await switchAccount(prev_real_account_loginid);
            } else {
                await switchAccount(account_list.find(acc => !acc.is_virtual && !acc.is_disabled)?.loginid);
            }
        }
        this.selected_account_type = account_type;
    }

    async switchToCRAccount() {
        const { account_list, switchAccount, prev_real_account_loginid } = this.root_store.client;

        if (prev_real_account_loginid && !prev_real_account_loginid.startsWith('MF')) {
            //switch to previously selected CR account
            await switchAccount(prev_real_account_loginid);
        } else {
            //if no previously selected CR account , then switch to default CR account
            await switchAccount(
                account_list.find(acc => !acc.is_virtual && !acc.is_disabled && !acc.loginid.startsWith('MF'))?.loginid
            );
        }

        this.selected_account_type = 'real';
        this.selected_region = 'Non-EU';
    }

    selectAccountTypeCard(account_type_card) {
        this.account_type_card = account_type_card;
    }

    selectRegion(region) {
        this.selected_region = region;
    }

    toggleIsTourOpen(is_tour_open) {
        this.is_tour_open = is_tour_open;
    }

    get is_demo_low_risk() {
        const { financial_company, gaming_company } = this.root_store.client.landing_companies;
        return (
            this.content_flag === ContentFlag.CR_DEMO &&
            financial_company?.shortcode === 'maltainvest' &&
            gaming_company?.shortcode === 'svg'
        );
    }

    get content_flag() {
        const { is_logged_in, landing_companies, residence } = this.root_store.client;
        const { financial_company, gaming_company } = landing_companies;

        //this is a conditional check for countries like Australia/Norway which fulfiles one of these following conditions
        const restricted_countries = financial_company?.shortcode === 'svg' || gaming_company?.shortcode === 'svg';

        if (!is_logged_in) return '';
        if (!gaming_company?.shortcode && financial_company?.shortcode === 'maltainvest') {
            if (this.is_demo) return ContentFlag.EU_DEMO;
            return ContentFlag.EU_REAL;
        } else if (
            financial_company?.shortcode === 'maltainvest' &&
            gaming_company?.shortcode === 'svg' &&
            this.is_real
        ) {
            if (this.is_eu_user) return ContentFlag.LOW_RISK_CR_EU;
            return ContentFlag.LOW_RISK_CR_NON_EU;
        } else if (
            ((financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg') || restricted_countries) &&
            this.is_real
        ) {
            return ContentFlag.HIGH_RISK_CR;
        }

        // Default Check
        if (isEuCountry(residence)) {
            if (this.is_demo) return ContentFlag.EU_DEMO;
            return ContentFlag.EU_REAL;
        }
        if (this.is_demo) return ContentFlag.CR_DEMO;
        return ContentFlag.LOW_RISK_CR_NON_EU;
    }

    get show_eu_related_content() {
        const eu_related = [ContentFlag.EU_DEMO, ContentFlag.EU_REAL, ContentFlag.LOW_RISK_CR_EU];
        return eu_related.includes(this.content_flag);
    }

    getAvailablePlatforms() {
        const appstore_platforms = getAppstorePlatforms();
        if (this.is_eu_user && !this.is_demo_low_risk) {
            this.available_platforms = appstore_platforms.filter(platform =>
                ['EU', 'All'].some(region => region === platform.availability)
            );
            return;
        } else if (this.selected_region === 'Non-EU' || this.is_demo_low_risk) {
            this.available_platforms = appstore_platforms.filter(platform =>
                ['Non-EU', 'All'].some(region => region === platform.availability)
            );
            return;
        }
        this.available_platforms = appstore_platforms;
    }

    toggleAccountTypeModalVisibility() {
        this.is_account_type_modal_visible = !this.is_account_type_modal_visible;
    }

    setIsOnboardingVisited(is_visited) {
        this.is_onboarding_visited = is_visited;
    }

    get is_eu_selected() {
        return this.selected_region === 'EU';
    }

    get should_show_exit_traders_modal() {
        //  should display the modal when low risk cr client have atleast one mf account
        const is_low_risk_cr_client = [
            ContentFlag.LOW_RISK_CR_EU,
            ContentFlag.LOW_RISK_CR_NON_EU,
            ContentFlag.CR_DEMO,
        ].includes(this.content_flag);
        const { active_accounts } = this.root_store.client;
        return is_low_risk_cr_client && active_accounts.some(acc => acc.landing_company_shortcode === 'maltainvest');
    }

    toggleRegulatorsCompareModal() {
        this.is_regulators_compare_modal_visible = !this.is_regulators_compare_modal_visible;
    }

    get has_any_real_account() {
        return this.selected_account_type === 'real' && this.root_store.client.has_active_real_account;
    }

    get is_currency_switcher_disabled_for_mf() {
        return !!(
            this.is_eu_user &&
            this.multipliers_account_status &&
            this.multipliers_account_status !== 'need_verification'
        );
    }

    setTogglePlatformType(platform_type) {
        this.selected_platform_type = platform_type;
    }

    getAvailableCFDAccounts() {
        const account_desc =
            !this.is_eu_user || this.is_demo_low_risk
                ? localize('Trade CFDs on MT5 with forex, stock indices, commodities, and cryptocurrencies.')
                : localize(
                      'Trade CFDs on MT5 with forex, stocks, stock indices, synthetics, cryptocurrencies, and commodities.'
                  );

        const all_available_accounts = [
            ...getCFDAvailableAccount(),
            {
                name: !this.is_eu_user || this.is_demo_low_risk ? localize('Financial') : localize('CFDs'),
                description: account_desc,
                platform: CFD_PLATFORMS.MT5,
                market_type: 'financial',
                icon: !this.is_eu_user || this.is_demo_low_risk ? 'Financial' : 'CFDs',
                availability: 'All',
            },
        ];
        this.available_cfd_accounts = all_available_accounts.map(account => {
            return {
                ...account,
                description: account.description,
            };
        });
        this.getAvailableDxtradeAccounts();
        this.getAvailableMt5Accounts();
        this.setCombinedCFDMT5Accounts();
    }

    getAvailableMt5Accounts() {
        if (this.is_eu_user && !this.is_demo_low_risk) {
            this.available_mt5_accounts = this.available_cfd_accounts.filter(account =>
                ['EU', 'All'].some(region => region === account.availability)
            );
            return;
        }

        this.available_mt5_accounts = this.available_cfd_accounts.filter(
            account => account.platform === CFD_PLATFORMS.MT5
        );
    }

    getAvailableDxtradeAccounts() {
        if (this.is_eu_user && !this.is_demo_low_risk) {
            this.available_dxtrade_accounts = this.available_cfd_accounts.filter(
                account =>
                    ['EU', 'All'].some(region => region === account.availability) &&
                    account.platform === CFD_PLATFORMS.DXTRADE
            );
            return;
        }
        this.available_dxtrade_accounts = this.available_cfd_accounts.filter(
            account => account.platform === CFD_PLATFORMS.DXTRADE
        );
    }
    hasCFDAccount(platform, category, type) {
        const current_list_keys = Object.keys(this.root_store.modules.cfd.current_list);
        return current_list_keys.some(key => key.startsWith(`${platform}.${category}.${type}`));
    }

    getExistingAccounts(platform, market_type) {
        const { residence } = this.root_store.client;
        const current_list = this.root_store.modules?.cfd?.current_list || [];
        const current_list_keys = Object.keys(current_list);
        const selected_account_type = this.selected_account_type;
        const existing_accounts = current_list_keys
            .filter(key => {
                const maltainvest_account = current_list[key].landing_company_short === 'maltainvest';

                if (platform === CFD_PLATFORMS.MT5 && !this.is_eu_user && !maltainvest_account) {
                    return key.startsWith(`${platform}.${selected_account_type}.${market_type}`);
                }
                if (platform === CFD_PLATFORMS.DXTRADE && market_type === 'all') {
                    return key.startsWith(`${platform}.${selected_account_type}.${platform}@${market_type}`);
                }
                if (
                    platform === CFD_PLATFORMS.MT5 &&
                    (this.is_eu_user || isEuCountry(residence)) &&
                    maltainvest_account
                ) {
                    return key.startsWith(`${platform}.${selected_account_type}.${market_type}`);
                }

                return key.startsWith(`${platform}.${selected_account_type}.${market_type}@${market_type}`);
            })
            .reduce((_acc, cur) => {
                _acc.push(current_list[cur]);
                return _acc;
            }, []);
        return existing_accounts;
    }

    startTrade(platform, account) {
        const { common, modules } = this.root_store;
        const { toggleMT5TradeModal, setMT5TradeAccount } = modules.cfd;
        const { setAppstorePlatform } = common;
        setAppstorePlatform(platform);
        toggleMT5TradeModal();
        setMT5TradeAccount(account);
    }

    get is_demo() {
        return this.selected_account_type === 'demo';
    }
    get is_real() {
        return this.selected_account_type === 'real';
    }
    get is_eu_user() {
        return this.selected_region === 'EU';
    }

    get multipliers_account_status() {
        const {
            has_maltainvest_account,
            account_status: { authentication },
        } = this.root_store.client;

        const multipliers_account_status = getMultipliersAccountStatus(authentication);
        const should_show_status_for_multipliers_account =
            [ContentFlag.EU_REAL, ContentFlag.LOW_RISK_CR_EU].includes(this.content_flag) &&
            has_maltainvest_account &&
            multipliers_account_status &&
            ['pending', 'failed', 'need_verification'].includes(multipliers_account_status);
        return should_show_status_for_multipliers_account ? multipliers_account_status : null;
    }

    handleTabItemClick(idx) {
        if (idx === 0) {
            this.selected_region = 'Non-EU';
        } else {
            this.selected_region = 'EU';
        }
    }

    openDemoCFDAccount(account_type, platform) {
        const { client, modules, ui } = this.root_store;
        const { standpoint, createCFDAccount, enableCFDPasswordModal, has_maltainvest_account } = modules.cfd;

        const { openAccountNeededModal } = ui;
        const { is_eu } = client;
        if (is_eu && !has_maltainvest_account && standpoint?.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('demo CFDs'));
            return;
        }
        createCFDAccount({ ...account_type, platform });
        enableCFDPasswordModal();
    }

    openRealAccount(account_type, platform) {
        const { client, modules } = this.root_store;
        const { has_active_real_account } = client;
        const { createCFDAccount, enableCFDPasswordModal, toggleJurisdictionModal } = modules.cfd;
        if (has_active_real_account && platform === CFD_PLATFORMS.MT5) {
            toggleJurisdictionModal();
        } else {
            createCFDAccount({ ...account_type, platform });
            enableCFDPasswordModal();
        }
    }

    openModal(modal_id, props = {}) {
        this.modal_data = {
            active_modal: modal_id,
            data: props,
        };
    }

    closeModal() {
        this.modal_data = {
            active_modal: '',
            data: {},
        };
    }

    selectRealLoginid(loginid) {
        const { accounts } = this.root_store.client;
        if (Object.keys(accounts).includes(loginid)) {
            this.selected_loginid = loginid;
        }
    }

    getAccount() {
        const { modules, common } = this.root_store;
        const { account_type } = modules.cfd;
        const { platform } = common;
        if (this.is_demo) {
            this.openDemoCFDAccount(account_type, platform);
        } else {
            this.openRealAccount(account_type, platform);
        }
    }

    get can_get_more_cfd_mt5_accounts() {
        const {
            client: { isEligibleForMoreRealMt5 },
        } = this.root_store;
        const { is_high_risk_client_for_mt5 } = this.root_store.modules.cfd;

        return (
            this.is_real &&
            !this.is_eu_user &&
            (this.hasCFDAccount(CFD_PLATFORMS.MT5, 'real', 'synthetic') ||
                this.hasCFDAccount(CFD_PLATFORMS.MT5, 'real', 'financial')) &&
            (isEligibleForMoreRealMt5('synthetic') || isEligibleForMoreRealMt5('financial')) &&
            !is_high_risk_client_for_mt5
        );
    }

    getServerName = account => {
        if (account) {
            const server_region = account.server_info?.geolocation?.region;
            if (server_region) {
                return `${server_region} ${
                    account?.server_info?.geolocation?.sequence === 1 ? '' : account?.server_info?.geolocation?.sequence
                }`;
            }
        }
        return '';
    };
    hasMultipleSVGAccounts = () => {
        const all_svg_acc = [];
        this.combined_cfd_mt5_accounts.map(acc => {
            if (acc.landing_company_short === 'svg' && acc.market_type === 'synthetic') {
                if (all_svg_acc.length) {
                    all_svg_acc.forEach(svg_acc => {
                        if (svg_acc.server !== acc.server) all_svg_acc.push(acc);
                        return all_svg_acc;
                    });
                } else {
                    all_svg_acc.push(acc);
                }
            }
        });
        return all_svg_acc.length > 1;
    };
    getShortCodeAndRegion(account) {
        let short_code_and_region;
        if (this.is_real && !this.is_eu_user) {
            const short_code =
                account.landing_company_short &&
                account.landing_company_short !== 'svg' &&
                account.landing_company_short !== 'bvi'
                    ? account.landing_company_short?.charAt(0).toUpperCase() + account.landing_company_short?.slice(1)
                    : account.landing_company_short?.toUpperCase();

            let region = '';
            if (this.hasMultipleSVGAccounts()) {
                region =
                    account.market_type !== 'financial' && account.landing_company_short !== 'bvi'
                        ? ` - ${this.getServerName(account)}`
                        : '';
            }
            short_code_and_region = `${short_code}${region}`;
        }
        return short_code_and_region;
    }
    setCombinedCFDMT5Accounts() {
        this.combined_cfd_mt5_accounts = [];
        this.available_mt5_accounts?.forEach(account => {
            const existing_accounts = this.getExistingAccounts(account.platform, account.market_type);
            const has_existing_accounts = existing_accounts.length > 0;
            if (has_existing_accounts) {
                existing_accounts.forEach(existing_account => {
                    this.combined_cfd_mt5_accounts = [
                        ...this.combined_cfd_mt5_accounts,
                        {
                            ...existing_account,
                            icon: account.icon,
                            sub_title: account.name,
                            name: `${formatMoney(existing_account.currency, existing_account.display_balance, true)} ${
                                existing_account.currency
                            }`,
                            short_code_and_region: this.getShortCodeAndRegion(existing_account),
                            platform: account.platform,
                            description: existing_account.display_login,
                            key: `trading_app_card_${existing_account.display_login}`,
                            action_type: 'multi-action',
                            availability: this.selected_region,
                            market_type: account.market_type,
                        },
                    ];
                });
            } else {
                this.combined_cfd_mt5_accounts = [
                    ...this.combined_cfd_mt5_accounts,
                    {
                        icon: account.icon,
                        name: account.name,
                        platform: account.platform,
                        description: account.description,
                        key: `trading_app_card_${account.name}`,
                        action_type: 'get',
                        availability: this.selected_region,
                        market_type: account.market_type,
                    },
                ];
            }
        });
    }

    toggleAccountTransferModal() {
        this.is_account_transfer_modal_open = !this.is_account_transfer_modal_open;
    }

    async updatePlatformBalance() {
        runInAction(() => {
            this.is_balance_calculating = true;
        });
        const { accounts, dxtrade_accounts_list, mt5_login_list } = this.root_store.client;

        const account_list = Object.keys(accounts).map(loginid => accounts[loginid]);
        const platform_demo_account = account_list.find(account => account.is_virtual);
        if (platform_demo_account) {
            const { balance, currency } = platform_demo_account;
            this.platform_demo_balance = { balance, currency };
        }

        const platform_real_accounts = account_list.filter(
            account =>
                !account.is_virtual &&
                (this.is_eu_user
                    ? account.landing_company_shortcode === 'maltainvest'
                    : account.landing_company_shortcode !== 'maltainvest')
        );
        if (platform_real_accounts?.length) {
            this.platform_real_balance = await this.getTotalBalance(
                platform_real_accounts,
                platform_real_accounts[0].currency
            );
        }

        let cfd_accounts = [];
        if (Array.isArray(mt5_login_list)) {
            cfd_accounts = [...cfd_accounts, ...mt5_login_list];
        }
        if (Array.isArray(dxtrade_accounts_list)) {
            cfd_accounts = [...cfd_accounts, ...dxtrade_accounts_list];
        }

        const cfd_real_accounts = cfd_accounts.filter(
            account =>
                account.account_type === 'real' &&
                (this.is_eu_user
                    ? account.landing_company_short === 'maltainvest'
                    : account.landing_company_short !== 'maltainvest')
        );
        if (cfd_real_accounts?.length) {
            this.cfd_real_balance = await this.getTotalBalance(cfd_real_accounts, cfd_real_accounts[0]?.currency);
        } else {
            this.cfd_real_balance = { balance: 0, currency: 'USD' };
        }

        const cfd_demo_accounts = cfd_accounts.filter(account => account.account_type === 'demo');
        if (cfd_demo_accounts?.length) {
            this.cfd_demo_balance = await this.getTotalBalance(cfd_demo_accounts, cfd_demo_accounts[0]?.currency);
        }

        runInAction(() => {
            this.is_balance_calculating = false;
        });
    }

    async getTotalBalance(accounts, base_currency) {
        const { getExchangeRate } = this.root_store.common;
        const total_balance = await accounts.reduce(
            async (total, account) => {
                const { balance, currency } = account;

                let exchange_rate = 1;
                if (currency !== base_currency) {
                    exchange_rate = await getExchangeRate(currency, base_currency);
                }

                (await total).balance += balance * exchange_rate || 0;
                return total;
            },
            { balance: 0 }
        );
        return { balance: total_balance.balance, currency: base_currency };
    }
    toggleFailedVerificationModalVisibility() {
        this.is_failed_verification_modal_visible = !this.is_failed_verification_modal_visible;
    }

    openFailedVerificationModal(selected_account_type) {
        const {
            common,
            modules: { cfd },
        } = this.root_store;
        const { setJurisdictionSelectedShortcode, setAccountType } = cfd;
        const { setAppstorePlatform } = common;

        if (selected_account_type?.platform === CFD_PLATFORMS.MT5) {
            setAppstorePlatform(selected_account_type.platform);
            setAccountType({
                category: selected_account_type.category,
                type: selected_account_type.type,
            });
            setJurisdictionSelectedShortcode(selected_account_type.jurisdiction);
        } else {
            setJurisdictionSelectedShortcode('');
        }
        this.open_failed_verification_for =
            selected_account_type?.platform === CFD_PLATFORMS.MT5 ? selected_account_type?.jurisdiction : 'multipliers';
        this.toggleFailedVerificationModalVisibility();
    }

    showTopUpModal(data) {
        const { ui, modules } = this.root_store;
        const { openTopUpModal } = ui;
        const { setCurrentAccount } = modules.cfd;
        setCurrentAccount(data, {
            category: this.selected_account_type,
            type: data.market_type,
        });
        openTopUpModal();
    }
}
