import React from 'react';
import { configure, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TContractInfo } from '@deriv/shared';
import ContractUpdateForm from '../contract-update-form';
import { TGetCardLables } from '../../../types';

const mockCardLabels = () => ({
    APPLY: 'Apply',
    DECREMENT_VALUE: 'Decrement value',
    INCREMENT_VALUE: 'Increment value',
    STOP_LOSS: 'Stop loss:',
    TAKE_PROFIT: 'Take profit:',
    TOTAL_PROFIT_LOSS: 'Total profit/loss:',
});

const contract_info: TContractInfo = {
    contract_id: 1,
    contract_type: 'ACCU',
    is_sold: 0,
    is_valid_to_cancel: 1,
    profit: 50,
};

const contract = {
    contract_update_config: { contract_update_stop_loss: '', contract_update_take_profit: '' }, //contains applied values
    contract_update_stop_loss: '', // contains entered values
    contract_update_take_profit: '', // contains entered values
    has_contract_update_stop_loss: false,
    has_contract_update_take_profit: false,
    contract_info,
    clearContractUpdateConfigValues: jest.fn(),
    updateLimitOrder: jest.fn(),
    validation_errors: { contract_update_stop_loss: [], contract_update_take_profit: [] },
    onChange: jest.fn(),
};

const el_modal = document.createElement('div');

describe('ContractUpdateForm', () => {
    const mock_props: React.ComponentProps<typeof ContractUpdateForm> = {
        addToast: jest.fn(),
        contract,
        current_focus: null,
        getCardLabels: mockCardLabels as TGetCardLables,
        getContractById: jest.fn(),
        is_accumulator: true,
        onMouseLeave: jest.fn(),
        removeToast: jest.fn(),
        setCurrentFocus: jest.fn(),
        status: 'profit',
        toggleDialog: jest.fn(),
    };
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });
    afterAll(() => {
        document.body.removeChild(el_modal);
    });
    it(`should render unchecked Take profit input with checkbox and disabled Apply button
        for Accumulators when take profit is not selected or applied`, () => {
        render(<ContractUpdateForm {...mock_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: mockCardLabels().TAKE_PROFIT });
        const stop_loss_checkbox = screen.queryByRole('checkbox', { name: mockCardLabels().STOP_LOSS });
        const take_profit_input = screen.getByRole('textbox');
        const decrement_button = screen.getByRole('button', { name: mockCardLabels().DECREMENT_VALUE });
        const increment_button = screen.getByRole('button', { name: mockCardLabels().INCREMENT_VALUE });
        const apply_button = screen.getByRole('button', { name: mockCardLabels().APPLY });
        expect(take_profit_checkbox).not.toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('');
        expect(decrement_button).toBeInTheDocument();
        expect(increment_button).toBeInTheDocument();
        expect(stop_loss_checkbox).not.toBeInTheDocument();
        expect(apply_button).toBeDisabled();
    });
    it(`should render checked Take profit input with checkbox and enabled Apply button
        when take profit is already applied`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                contract_update_config: { contract_update_stop_loss: '', contract_update_take_profit: '56' },
                contract_update_take_profit: '56',
                has_contract_update_take_profit: true,
                limit_order: {
                    take_profit: {
                        order_amount: 56,
                        order_date: 1234560000,
                    },
                },
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: mockCardLabels().TAKE_PROFIT });
        const take_profit_input = screen.getByRole('textbox');
        const apply_button = screen.getByRole('button', { name: mockCardLabels().APPLY });
        expect(take_profit_checkbox).toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('56');
        expect(apply_button).toBeEnabled();
    });
    it(`should render checked Take profit input with checkbox and diabled Apply button
        when take profit is selected, but not entered`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                has_contract_update_take_profit: true,
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: mockCardLabels().TAKE_PROFIT });
        const apply_button = screen.getByRole('button', { name: mockCardLabels().APPLY });
        expect(take_profit_checkbox).toBeChecked();
        expect(apply_button).toBeDisabled();
    });
    it(`should render checked Take profit input with checkbox and enabled Apply button
        when take profit is selected, entered, and there are no validation errors`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                contract_update_config: { contract_update_stop_loss: '', contract_update_take_profit: '5' },
                contract_update_take_profit: '56',
                has_contract_update_take_profit: true,
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: mockCardLabels().TAKE_PROFIT });
        const take_profit_input = screen.getByRole('textbox');
        const apply_button = screen.getByRole('button', { name: mockCardLabels().APPLY });
        expect(take_profit_checkbox).toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('56');
        expect(apply_button).toBeEnabled();
        // when chechbox is unchecked, Apply button should remain enabled:
        userEvent.click(take_profit_checkbox);
        expect(take_profit_checkbox).not.toBeChecked();
        expect(apply_button).toBeEnabled();
        // when Apply button is clicked, toggleDialog should be called:
        userEvent.click(apply_button);
        expect(new_props.toggleDialog).toHaveBeenCalled();
    });
    it(`should render checked Take profit input with checkbox, disabled Apply button & error message
        when take profit is selected, entered, and there are validation errors`, () => {
        const new_props = {
            ...mock_props,
            current_focus: 'contract_update_take_profit',
            contract: {
                ...contract,
                contract_update_take_profit: '',
                has_contract_update_take_profit: true,
                validation_errors: {
                    contract_update_take_profit: ['Please enter a take profit amount.'],
                    contract_update_stop_loss: [],
                },
            },
        };
        render(<ContractUpdateForm {...new_props} />);
        const take_profit_checkbox = screen.getByRole('checkbox', { name: mockCardLabels().TAKE_PROFIT });
        const take_profit_input = screen.getByRole('textbox');
        const apply_button = screen.getByRole('button', { name: mockCardLabels().APPLY });
        configure({ testIdAttribute: 'data-tooltip' });
        const error_message = screen.getByTestId('Please enter a take profit amount.');
        expect(take_profit_checkbox).toBeChecked();
        expect(take_profit_input).toHaveDisplayValue('');
        expect(apply_button).toBeDisabled();
        expect(error_message).toBeInTheDocument();
        // when typing a value, onChange should be called:
        userEvent.type(take_profit_input, '5');
        expect(new_props.contract.onChange).toHaveBeenCalled();
    });
    it(`should render unchecked Take profit & Stop loss inputs with checkboxes and disabled Apply button
        for Multipliers when neither take profit, nor stop loss is selected or applied`, () => {
        const new_props = {
            ...mock_props,
            contract: {
                ...contract,
                contract_info: {
                    ...contract_info,
                    contract_type: 'MULTDOWN',
                },
            },
            is_accumulator: false,
        };
        render(<ContractUpdateForm {...new_props} />);
        const stop_loss_checkbox = screen.getByRole('checkbox', { name: mockCardLabels().STOP_LOSS });
        const take_profit_checkbox = screen.queryByRole('checkbox', { name: mockCardLabels().TAKE_PROFIT });
        const inputs = screen.getAllByRole('textbox');
        const apply_button = screen.getByRole('button', { name: mockCardLabels().APPLY });
        expect(stop_loss_checkbox).not.toBeChecked();
        expect(take_profit_checkbox).not.toBeChecked();
        expect(inputs).toHaveLength(2);
        expect(apply_button).toBeDisabled();
    });
});
