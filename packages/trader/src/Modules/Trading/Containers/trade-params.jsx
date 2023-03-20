import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Amount from 'Modules/Trading/Components/Form/TradeParams/amount.jsx';
import Barrier from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import Duration from 'Modules/Trading/Components/Form/TradeParams/Duration';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import CancelDeal from 'Modules/Trading/Components/Form/TradeParams/Multiplier/cancel-deal.jsx';
import StopLoss from 'Modules/Trading/Components/Form/TradeParams/Multiplier/stop-loss.jsx';
import TakeProfit from 'Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit.jsx';
import Expiration from 'Modules/Trading/Components/Form/TradeParams/Multiplier/expiration.jsx';
import Strike from 'Modules/Trading/Components/Form/TradeParams/strike.jsx';
import VanillaTradeTypes from 'Modules/Trading/Components/Form/TradeParams/vanilla-trade-types.jsx';
import { connect } from 'Stores/connect';
import Fieldset from 'App/Components/Form/fieldset.jsx';

const TradeParams = ({ form_components, is_minimized }) => {
    const isVisible = component_key => {
        return form_components.includes(component_key);
    };
    return (
        <React.Fragment>
            {isVisible('duration') && <Duration key={'duration'} is_minimized={is_minimized} />}
            {isVisible('barrier') && <Barrier key={'barrier'} is_minimized={is_minimized} />}
            {isVisible('last_digit') && <LastDigit key={'last_digit'} is_minimized={is_minimized} />}
            <Fieldset className={classNames('trade-container__fieldset', 'trade-container__fieldset--no-padding')}>
                {isVisible('vanilla_trade_type') && <VanillaTradeTypes key={'vanilla_trade_type'} />}
                {isVisible('strike') && <Strike key={'strike'} />}
                {isVisible('amount') && <Amount key={'amount'} is_minimized={is_minimized} />}
            </Fieldset>
            {isVisible('take_profit') && <TakeProfit key={'take_profit'} />}
            {isVisible('stop_loss') && <StopLoss key={'stop_loss'} />}
            {isVisible('cancellation') && <CancelDeal key={'cancellation'} />}
            {isVisible('expiration') && <Expiration key={'expiration'} />}
        </React.Fragment>
    );
};
TradeParams.propTypes = {
    form_components: MobxPropTypes.arrayOrObservableArray,
    is_minimized: PropTypes.bool,
};

export default connect(({ modules }) => ({
    form_components: modules.trade.form_components,
}))(TradeParams);
