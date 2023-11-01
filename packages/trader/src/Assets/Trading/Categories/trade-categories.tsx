import React from 'react';
import { Text } from '@deriv/components';
import { VANILLALONG, TURBOS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import AccumulatorTradeDescription from './Description/accumulator-trade-description';
import TurbosTradeDescription from './Description/turbos-trade-description';
import MultiplierTradeDescription from './Description/multiplier-trade-description';

// Templates are from Binary 1.0, it should be checked if they need change or not and add all of trade types
// TODO: refactor the rest of descriptions to use them as components like AccumulatorTradeDescription
const TradeCategories = ({
    category,
    onClick,
    is_vanilla_fx = false,
    is_multiplier_fx = false,
}: {
    category?: string;
    onClick: () => void;
    is_vanilla_fx?: boolean;
    is_multiplier_fx?: boolean;
}) => {
    let TradeTypeTemplate;
    if (category) {
        switch (category) {
            case 'accumulator':
                TradeTypeTemplate = <AccumulatorTradeDescription onClick={onClick} />;
                break;
            case 'rise_fall':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Fall", you win the payout if the exit spot is strictly lower than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'rise_fall_equal':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Rise", you win the payout if the exit spot is strictly higher than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Fall", you win the payout if the exit spot is strictly lower than the entry spot.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Allow equals", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Higher", you win the payout if the exit spot is strictly higher than the barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Lower", you win the payout if the exit spot is strictly lower than the barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize("If the exit spot is equal to the barrier, you don't win the payout.")}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'end':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Ends Between", you win the payout if the exit spot is strictly higher than the Low barrier AND strictly lower than the High barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Ends Outside", you win the payout if the exit spot is EITHER strictly higher than the High barrier, OR strictly lower than the Low barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                "If the exit spot is equal to either the Low barrier or the High barrier, you don't win the payout."
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'stay':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Stays Between", you win the payout if the market stays between (does not touch) either the High barrier or the Low barrier at any time during the contract period'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Goes Outside", you win the payout if the market touches either the High barrier or the Low barrier at any time during the contract period.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'match_diff':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Matches", you will win the payout if the last digit of the last tick is the same as your prediction.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Differs", you will win the payout if the last digit of the last tick is not the same as your prediction.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'even_odd':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Even", you will win the payout if the last digit of the last tick is an even number (i.e., 2, 4, 6, 8, or 0).'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Odd", you will win the payout if the last digit of the last tick is an odd number (i.e., 1, 3, 5, 7, or 9).'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'over_under':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Over", you will win the payout if the last digit of the last tick is greater than your prediction.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Under", you will win the payout if the last digit of the last tick is less than your prediction.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'touch':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Touch", you win the payout if the market touches the barrier at any time during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "No Touch", you win the payout if the market never touches the barrier at any time during the contract period.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'asian':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'Asian options settle by comparing the last tick with the average spot over the period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Asian Rise", you will win the payout if the last tick is higher than the average of the ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Asian Fall", you will win the payout if the last tick is lower than the average of the ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                "If the last tick is equal to the average of the ticks, you don't win the payout."
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'run_high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Only Ups", you win the payout if consecutive ticks rise successively after the entry spot. No payout if any tick falls or is equal to any of the previous ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Only Downs", you win the payout if consecutive ticks fall successively after the entry spot. No payout if any tick rises or is equal to any of the previous ticks.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'reset':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "Reset-Up”, you win the payout if the exit spot is strictly higher than either the entry spot or the spot at reset time.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Reset-Down”, you win the payout if the exit spot is strictly lower than either the entry spot or the spot at reset time.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                "If the exit spot is equal to the barrier or the new barrier (if a reset occurs), you don't win the payout."
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'callputspread':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <h2>{localize('Spread Up')}</h2>
                        <Text as='p'>
                            {localize(
                                'Win maximum payout if the exit spot is higher than or equal to the upper barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between exit spot and lower barrier.'
                            )}
                        </Text>
                        <Text as='p'>{localize('No payout if exit spot is below or equal to the lower barrier.')}</Text>
                        <h2>{localize('Spread Down')}</h2>
                        <Text as='p'>
                            {localize(
                                'Win maximum payout if the exit spot is lower than or equal to the lower barrier.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Win up to maximum payout if exit spot is between lower and upper barrier, in proportion to the difference between upper barrier and exit spot.'
                            )}
                        </Text>
                        <Text as='p'>{localize('No payout if exit spot is above or equal to the upper barrier.')}</Text>
                    </React.Fragment>
                );
                break;
            case 'tick_high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'If you select "High Tick", you win the payout if the selected tick is the highest among the next five ticks.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'If you select "Low Tick", you win the payout if the selected tick is the lowest among the next five ticks.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'lb_high_low':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'By purchasing the "High-to-Low" contract, you\'ll win the multiplier times the difference between the high and low over the duration of the contract.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The high is the highest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The low is the lowest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The close is the latest tick at or before the end time. If you selected a specific end time, the end time is the selected time.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'lb_put':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'By purchasing the "High-to-Close" contract, you\'ll win the multiplier times the difference between the high and close over the duration of the contract.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The high is the highest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The low is the lowest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The close is the latest tick at or before the end time. If you selected a specific end time, the end time is the selected time.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'lb_call':
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'By purchasing the "Close-to-Low" contract, you\'ll win the multiplier times the difference between the close and low over the duration of the contract.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The high is the highest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The low is the lowest point ever reached by the market during the contract period.'
                            )}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The close is the latest tick at or before the end time. If you selected a specific end time, the end time is the selected time.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'multiplier':
                TradeTypeTemplate = (
                    <MultiplierTradeDescription is_multiplier_fx={is_multiplier_fx} onClick={onClick} />
                );
                break;
            case TURBOS.LONG:
            case TURBOS.SHORT:
                TradeTypeTemplate = <TurbosTradeDescription onClick={onClick} />;
                break;
            case VANILLALONG.CALL:
            case VANILLALONG.PUT:
                TradeTypeTemplate = (
                    <React.Fragment>
                        <Text as='p'>
                            {localize(
                                'Vanilla options allow you to predict an upward (bullish) or downward (bearish) direction of the underlying asset by purchasing a "Call" or a "Put".'
                            )}
                        </Text>
                        <Text as='p'>
                            <Localize
                                i18n_default_text='If you select <0>"Call"</0>, you’ll earn a <1>payout</1> if the <1>final price</1> is above the <1>strike price</1> at <1>expiry</1>. Otherwise, you won’t receive a payout.'
                                components={[
                                    <strong key={0} />,
                                    <span
                                        className='contract-type-info__content-definition'
                                        onClick={onClick}
                                        key={1}
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p'>
                            <Localize
                                i18n_default_text='If you select <0>"Put"</0>, you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <Text as='p'>
                            {is_vanilla_fx ? (
                                <Localize
                                    i18n_default_text='Your payout is equal to the <0>payout per pip</0> multiplied by the difference, <1>in pips</1>, between the final price and the strike price. You will only earn a profit if your payout is higher than your initial stake.'
                                    components={[
                                        <span
                                            className='contract-type-info__content-definition'
                                            onClick={onClick}
                                            key={0}
                                        />,
                                        <strong key={0} />,
                                    ]}
                                />
                            ) : (
                                <Localize
                                    i18n_default_text='Your payout is equal to the <0>payout per point</0> multiplied by the difference between the final price and the strike price. You will only earn a profit if your payout is higher than your initial stake.'
                                    components={[
                                        <span
                                            className='contract-type-info__content-definition'
                                            onClick={onClick}
                                            key={0}
                                        />,
                                    ]}
                                />
                            )}
                        </Text>
                        <Text as='p'>
                            {is_vanilla_fx ? (
                                <Localize
                                    i18n_default_text='You may sell the contract up to 24 hours before expiry. If you do, we’ll pay you the <0>contract value</0>.'
                                    components={[
                                        <span
                                            className='contract-type-info__content-definition'
                                            onClick={onClick}
                                            key={0}
                                        />,
                                    ]}
                                />
                            ) : (
                                <Localize
                                    i18n_default_text='You may sell the contract up until 60 seconds before expiry. If you do, we’ll pay you the <0>contract value</0>.'
                                    components={[
                                        <span
                                            className='contract-type-info__content-definition'
                                            onClick={onClick}
                                            key={0}
                                        />,
                                    ]}
                                />
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            default:
                TradeTypeTemplate = <Text as='p'>{localize('Description not found.')}</Text>;
                break;
        }
    }
    return <>{TradeTypeTemplate}</>;
};

export default TradeCategories;
