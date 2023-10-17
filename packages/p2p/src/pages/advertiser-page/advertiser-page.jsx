import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { DesktopWrapper, Loading, MobileWrapper, Text } from '@deriv/components';
import { daysSince, isMobile } from '@deriv/shared';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { OnlineStatusIcon, OnlineStatusLabel } from 'Components/online-status';
import PageReturn from 'Components/page-return';
import RecommendedBy from 'Components/recommended-by';
import StarRating from 'Components/star-rating';
import TradeBadge from 'Components/trade-badge';
import UserAvatar from 'Components/user/user-avatar';
import { api_error_codes } from 'Constants/api-error-codes';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';

import BlockUserOverlay from './block-user/block-user-overlay';
import AdvertiserPageAdverts from './advertiser-page-adverts.jsx';
import AdvertiserPageDropdownMenu from './advertiser-page-dropdown-menu.jsx';
import AdvertiserPageStats from './advertiser-page-stats.jsx';

const AdvertiserPage = () => {
    const { advertiser_page_store, buy_sell_store, general_store, my_profile_store } = useStores();
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();
    const { advertiser_details_name, advertiser_details_id, counterparty_advertiser_info } = advertiser_page_store;
    const { advertiser_id, advertiser_info, counterparty_advertiser_id } = general_store;

    const is_my_advert = advertiser_details_id === advertiser_id;
    // Use general_store.advertiser_info since resubscribing to the same id from advertiser page returns error
    const info = is_my_advert ? advertiser_info : counterparty_advertiser_info;

    const history = useHistory();
    const location = useLocation();

    const {
        basic_verification,
        buy_orders_count,
        created_time,
        first_name,
        full_verification,
        is_online,
        last_online_time,
        last_name,
        name,
        rating_average,
        rating_count,
        recommended_average,
        recommended_count,
        sell_orders_count,
    } = info;

    const joined_since = daysSince(created_time);
    const nickname = advertiser_details_name ?? name;
    // rating_average_decimal converts rating_average to 1 d.p number
    const rating_average_decimal = rating_average ? Number(rating_average).toFixed(1) : null;

    const error_message = () => {
        return !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert
            ? localize("Unblocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name: nickname,
              })
            : localize("Blocking wasn't possible as {{name}} is not using Deriv P2P anymore.", {
                  name: nickname,
              });
    };

    React.useEffect(() => {
        if (location.search || counterparty_advertiser_id) {
            const url_params = new URLSearchParams(location.search);
            general_store.setCounterpartyAdvertiserId(url_params.get('id'));
        }

        buy_sell_store.setShowAdvertiserPage(true);
        advertiser_page_store.onMount();
        advertiser_page_store.setIsDropdownMenuVisible(false);

        const disposeCounterpartyAdvertiserIdReaction = reaction(
            () => [general_store.counterparty_advertiser_id, general_store.is_advertiser_info_subscribed],
            () => {
                // DO NOT REMOVE. This fixes reload on advertiser page routing issue
                advertiser_page_store.onAdvertiserIdUpdate();
            },
            { fireImmediately: true }
        );

        return () => {
            disposeCounterpartyAdvertiserIdReaction();
            advertiser_page_store.onUnmount();
            buy_sell_store.setShowAdvertiserPage(false);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const disposeBlockUnblockUserErrorReaction = reaction(
            () => [advertiser_page_store.active_index, general_store.block_unblock_user_error],
            () => {
                advertiser_page_store.onTabChange();
                if (general_store.block_unblock_user_error) {
                    showModal({
                        key: 'ErrorModal',
                        props: {
                            error_message:
                                general_store.error_code === api_error_codes.INVALID_ADVERTISER_ID
                                    ? error_message()
                                    : general_store.block_unblock_user_error,
                            error_modal_button_text: localize('Got it'),
                            error_modal_title:
                                general_store.error_code === api_error_codes.INVALID_ADVERTISER_ID
                                    ? localize('{{name}} is no longer on Deriv P2P', {
                                          name: nickname,
                                      })
                                    : localize('Unable to block advertiser'),
                            has_close_icon: false,
                            onClose: () => {
                                buy_sell_store.hideAdvertiserPage();
                                history.push(general_store.active_tab_route);
                                if (general_store.active_index !== 0)
                                    my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
                                advertiser_page_store.onCancel();
                                general_store.setBlockUnblockUserError('');
                                hideModal();
                            },
                            width: isMobile() ? '90rem' : '40rem',
                        },
                    });
                }
            },
            { fireImmediately: true }
        );

        return () => {
            disposeBlockUnblockUserErrorReaction();
            advertiser_page_store.onUnmount();
        };
    }, [advertiser_details_name, counterparty_advertiser_info]);

    useRegisterModalProps({
        key: 'BlockUserModal',
        props: {
            advertiser_name: name,
            is_advertiser_blocked: !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
            onCancel: advertiser_page_store.onCancel,
            onSubmit: advertiser_page_store.onSubmit,
        },
    });

    if (advertiser_page_store.is_loading || general_store.is_block_unblock_user_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    return (
        <div
            className={classNames('advertiser-page', {
                'advertiser-page--no-scroll':
                    !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
            })}
        >
            <div className='advertiser-page__page-return-header'>
                <PageReturn
                    className='buy-sell__advertiser-page-return'
                    onClick={() => {
                        buy_sell_store.hideAdvertiserPage();
                        if (general_store.active_index === general_store.path.my_profile)
                            my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
                        history.push(general_store.active_tab_route);
                    }}
                    page_title={localize("Advertiser's page")}
                />
                {!is_my_advert && (
                    <MobileWrapper>
                        <AdvertiserPageDropdownMenu />
                    </MobileWrapper>
                )}
            </div>
            <BlockUserOverlay
                is_visible={!!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert}
                onClickUnblock={() =>
                    showModal({
                        key: 'BlockUserModal',
                    })
                }
            >
                <div className='advertiser-page-details-container'>
                    <div className='advertiser-page__header-details'>
                        <UserAvatar
                            nickname={nickname}
                            size={isMobile() ? 32 : 64}
                            text_size={isMobile() ? 's' : 'sm'}
                        />
                        <div className='advertiser-page__header-name--column'>
                            <div className='advertiser-page__header-name'>
                                <Text color='prominent' weight='bold'>
                                    {nickname}
                                </Text>
                                {first_name && last_name && (
                                    <div className='advertiser-page__header-real-name'>
                                        <Text color='less-prominent' line_height='xs' size='xs'>
                                            {`(${first_name} ${last_name})`}
                                        </Text>
                                    </div>
                                )}
                            </div>
                            <MobileWrapper>
                                <div className='advertiser-page__row'>
                                    <div className='advertiser-page__rating--row'>
                                        <OnlineStatusIcon is_online={is_online} />
                                        <OnlineStatusLabel is_online={is_online} last_online_time={last_online_time} />
                                    </div>
                                    <div className='advertiser-page__rating--row'>
                                        <Text
                                            className='advertiser-page__joined-since'
                                            color='less-prominent'
                                            size='xxxs'
                                        >
                                            {joined_since ? (
                                                <Localize
                                                    i18n_default_text='Joined {{days_since_joined}}d'
                                                    values={{ days_since_joined: joined_since }}
                                                />
                                            ) : (
                                                <Localize i18n_default_text='Joined today' />
                                            )}
                                        </Text>
                                    </div>
                                </div>
                            </MobileWrapper>
                            <div className='advertiser-page__rating'>
                                <DesktopWrapper>
                                    <React.Fragment>
                                        <div className='advertiser-page__rating--row'>
                                            <OnlineStatusIcon is_online={is_online} />
                                            <OnlineStatusLabel
                                                is_online={is_online}
                                                last_online_time={last_online_time}
                                            />
                                        </div>
                                        <div className='advertiser-page__rating--row'>
                                            <Text
                                                className='advertiser-page__joined-since'
                                                color='less-prominent'
                                                size='xs'
                                            >
                                                {joined_since ? (
                                                    <Localize
                                                        i18n_default_text='Joined {{days_since_joined}}d'
                                                        values={{ days_since_joined: joined_since }}
                                                    />
                                                ) : (
                                                    <Localize i18n_default_text='Joined today' />
                                                )}
                                            </Text>
                                        </div>
                                    </React.Fragment>
                                </DesktopWrapper>
                                {rating_average ? (
                                    <React.Fragment>
                                        <div className='advertiser-page__rating--row'>
                                            <Text color='prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                                {rating_average_decimal}
                                            </Text>
                                            <StarRating
                                                empty_star_className='advertiser-page__rating--star'
                                                empty_star_icon='IcEmptyStar'
                                                full_star_className='advertiser-page__rating--star'
                                                full_star_icon='IcFullStar'
                                                initial_value={rating_average_decimal}
                                                is_readonly
                                                number_of_stars={5}
                                                should_allow_hover_effect={false}
                                                star_size={isMobile() ? 17 : 20}
                                            />
                                            <div className='advertiser-page__rating--text'>
                                                <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                                    {rating_count === 1 ? (
                                                        <Localize
                                                            i18n_default_text='({{number_of_ratings}} rating)'
                                                            values={{ number_of_ratings: rating_count }}
                                                        />
                                                    ) : (
                                                        <Localize
                                                            i18n_default_text='({{number_of_ratings}} ratings)'
                                                            values={{ number_of_ratings: rating_count }}
                                                        />
                                                    )}
                                                </Text>
                                            </div>
                                        </div>
                                        <div className='advertiser-page__rating--row'>
                                            <RecommendedBy
                                                recommended_average={recommended_average}
                                                recommended_count={recommended_count}
                                            />
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <div className='advertiser-page__rating--row'>
                                        <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                            <Localize i18n_default_text='Not rated yet' />
                                        </Text>
                                    </div>
                                )}
                            </div>
                            <div className='advertiser-page__row'>
                                <TradeBadge
                                    is_poa_verified={!!full_verification}
                                    is_poi_verified={!!basic_verification}
                                    trade_count={Number(buy_orders_count) + Number(sell_orders_count)}
                                    large
                                />
                            </div>
                        </div>
                        {!is_my_advert && (
                            <DesktopWrapper>
                                <AdvertiserPageDropdownMenu />
                            </DesktopWrapper>
                        )}
                    </div>
                    <AdvertiserPageStats />
                </div>
                <AdvertiserPageAdverts />
            </BlockUserOverlay>
        </div>
    );
};

export default observer(AdvertiserPage);
