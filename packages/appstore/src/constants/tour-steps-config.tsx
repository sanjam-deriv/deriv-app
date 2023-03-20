import { Step, Styles, Locale } from 'react-joyride';
import React from 'react';
import { Text, SpanButton } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import 'Components/toggle-account-type/toggle-account-type.scss';

export const tour_step_config: Step[] = [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Switch accounts')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: <Text as='p'>{localize('Switch between your demo and real accounts.')}</Text>,
        target: '.toggle-account-type__button',
        disableBeacon: true,
        placement: 'bottom-end',
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Trading hub tour')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p'>
                <Localize
                    i18n_default_text='Need help moving around?<0></0>We have a short tutorial that might help. Hit Repeat tour to begin.'
                    components={[<br key={0} />]}
                />
            </Text>
        ),

        target: '.trading-hub-header__tradinghub--onboarding--logo',
        disableBeacon: true,
    },
];

export const eu_tour_step_config: Step[] = [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Switch accounts')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: <Text as='p'>{localize('Switch between your demo and real accounts.')}</Text>,
        target: '.toggle-account-type__button',
        disableBeacon: true,
        placement: 'bottom-end',
    },
    {
        title: (
            <Text as='p' weight='bold' color='brand-red-coral'>
                {localize('Trading hub tour')}
                <div className='toggle-account-type__divider' />
            </Text>
        ),
        content: (
            <Text as='p'>
                <Localize
                    i18n_default_text='Need help moving around?<0></0>We have a short tutorial that might help. Hit Repeat tour to begin.'
                    components={[<br key={0} />]}
                />
            </Text>
        ),

        target: '.trading-hub-header__tradinghub--onboarding--logo',
        disableBeacon: true,
    },
];

export const tour_styles: Styles = {
    options: {
        width: 350,
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.6rem',
        padding: '3rem 0 1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
};

export const tour_styles_dark_mode: Styles = {
    options: {
        width: 350,
        backgroundColor: 'var(--brand-dark-grey)',
        arrowColor: 'var(--brand-dark-grey)',
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.6rem',
        padding: '3rem 0 1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
};

export const tour_step_locale: Locale = {
    back: <SpanButton has_effect text={localize('Repeat tour')} secondary medium />,
    close: localize('Close'),
    last: localize('OK'),
    next: localize('Next'),
    skip: localize('Skip'),
};

export const eu_tour_step_locale: Locale = {
    close: localize('Close'),
    last: localize('OK'),
    next: localize('Next'),
    skip: localize('Skip'),
};
