import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import AccountTransfer from '@deriv/cashier/src/pages/account-transfer';

type TAccountTransferModal = {
    is_modal_open: boolean;
    toggleModal: (e?: boolean) => void;
};

const AccountTransferModal = ({ is_modal_open, toggleModal }: TAccountTransferModal) => {
    const {
        modules: {
            cashier: {
                account_transfer: { is_transfer_confirm, should_switch_account },
            },
        },
        traders_hub: { closeModal, openModal, setSelectedAccount },
    } = useStore();

    const history = useHistory();

    React.useEffect(() => {
        return () => {
            setSelectedAccount({});
            closeModal();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const modal_title = !is_transfer_confirm && <Localize i18n_default_text={'Transfer funds to your accounts'} />;

    const onClickDeposit = () => {
        toggleModal();
        history.push(routes.cashier_deposit);
    };

    const onClickNotes = () => {
        toggleModal();
        history.push(routes.cashier_acc_transfer);
    };

    const openAccountSwitcherModal = () => {
        openModal('currency_selection');
    };

    return (
        <Modal
            className={should_switch_account ? 'account-transfer-modal' : ''}
            has_close_icon={!is_transfer_confirm}
            is_open={is_modal_open}
            is_title_centered={is_transfer_confirm}
            small
            title={modal_title}
            toggleModal={toggleModal}
            should_header_stick_body={false}
        >
            <Modal.Body>
                <AccountTransfer
                    openAccountSwitcherModal={openAccountSwitcherModal}
                    onClickDeposit={onClickDeposit}
                    onClickNotes={onClickNotes}
                    onClose={toggleModal}
                />
            </Modal.Body>
        </Modal>
    );
};

export default observer(AccountTransferModal);
