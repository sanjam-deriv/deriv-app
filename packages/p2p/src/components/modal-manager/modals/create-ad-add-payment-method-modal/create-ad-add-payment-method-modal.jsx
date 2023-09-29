import classNames from 'classnames';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, MobileFullPageModal, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import { localize, Localize } from 'Components/i18next';
import AddPaymentMethod from 'Pages/my-profile/payment-methods/add-payment-method/add-payment-method.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const CreateAdAddPaymentMethodModal = () => {
    const { general_store, my_profile_store } = useStores();
    const { hideModal, is_modal_open, showModal } = useModalManagerContext();

    const onCancel = () => {
        if (my_profile_store.selected_payment_method.length > 0 || general_store.is_form_modified) {
            showModal({
                key: 'CancelAddPaymentMethodModal',
                props: {
                    should_hide_all_modals_on_cancel: true,
                },
            });
        } else {
            hideModal({
                should_hide_all_modals: true,
            });
        }
    };

    if (isMobile()) {
        return (
            <MobileFullPageModal
                body_className={classNames('create-ad-add-payment-method-modal__body', {
                    'create-ad-add-payment-method-modal__body--form': my_profile_store.selected_payment_method,
                })}
                height_offset='80px'
                is_flex
                is_modal_open={is_modal_open}
                page_header_className='buy-sell__modal-header'
                page_header_text={localize('Add payment method')}
                pageHeaderReturnFn={onCancel}
            >
                <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className={classNames('create-ad-add-payment-method-modal__error', {
                'create-ad-add-payment-method-modal__error--form': my_profile_store.selected_payment_method,
            })}
            has_close_icon
            height='560px'
            is_open={is_modal_open}
            title={
                <React.Fragment>
                    <Icon
                        icon='icArrowLeftBold'
                        onClick={onCancel}
                        className='create-ad-add-payment-method-modal__icon'
                    />
                    {localize('Add payment method')}
                </React.Fragment>
            }
            toggleModal={onCancel}
        >
            <Modal.Body
                className={classNames({
                    'create-ad-add-payment-method-modal__body--scroll': my_profile_store.selected_payment_method,
                })}
            >
                <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
            </Modal.Body>
            {!my_profile_store.selected_payment_method && (
                <Modal.Footer has_separator>
                    <Button large onClick={onCancel} secondary>
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default observer(CreateAdAddPaymentMethodModal);
