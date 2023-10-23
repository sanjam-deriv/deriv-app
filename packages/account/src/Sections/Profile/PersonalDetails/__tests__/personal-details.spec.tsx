import { test } from '@jest/globals';
import React from 'react';
import { cleanup, render, waitFor, screen, fireEvent } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { PersonalDetailsForm } from '../personal-details';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useGetAccountStatus, useResidenceList, useSettings } from '@deriv/api';
import userEvent from '@testing-library/user-event';

afterAll(cleanup);

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSettings: jest.fn(),
    useGetAccountStatus: jest.fn(),
    useResidenceList: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

const mockedUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;
const mockedUseGetAccountStatus = useGetAccountStatus as jest.MockedFunction<typeof useGetAccountStatus>;
const mockedUseResidenceList = useResidenceList as jest.MockedFunction<typeof useResidenceList>;

const mock_settings: ReturnType<typeof useSettings> = {
    update: jest.fn(),
    // @ts-expect-error will not required all mutation from useSettings
    mutation: { isLoading: false, isSuccess: false, error: null, isError: true },
    data: {
        first_name: 'John',
        tax_identification_number: '',
        tax_residence: '',
        place_of_birth: 'id',
        citizen: 'id',
        account_opening_reason: '',
    },
};

const mock_use_get_account_status: ReturnType<typeof useGetAccountStatus> = {
    // @ts-expect-error will not required all data to be returning from useGetAccountStatus
    data: {
        status: [],
    },
};
const mock_use_residence_list: Partial<ReturnType<typeof useResidenceList>> = {
    data: [
        {
            text: 'Indonesia',
            value: 'id',
        },
    ],
};

describe('<PersonalDetailsForm />', () => {
    const history = createBrowserHistory();
    const mock_store = mockStore({});

    const renderComponent = (modified_store = mock_store) => {
        mockedUseSettings.mockReturnValue(mock_settings);
        mockedUseGetAccountStatus.mockReturnValue(mock_use_get_account_status);
        // @ts-expect-error will not have to mock all return value from useResidenceList
        mockedUseResidenceList.mockReturnValue(mock_use_residence_list);
        return render(
            <Router history={history}>
                <StoreProvider store={modified_store}>
                    <PersonalDetailsForm history={history} />
                </StoreProvider>
            </Router>
        );
    };

    it('should render successfully', async () => {
        renderComponent();
        expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
        await screen.findByText(
            /Please make sure your information is correct or it may affect your trading experience./i
        );
    });

    it('should render all the personal details fields', () => {
        renderComponent();
        const fields = [
            'First name*',
            'Last name*',
            'Place of birth',
            'Date of birth*',
            'Citizenship',
            'Country of residence*',
            'Phone number*',
            'First line of address*',
            'Second line of address (optional)',
            'Town/City*',
            'State/Province (optional)',
            'Postal/ZIP code',
        ];
        fields.forEach(value => {
            expect(screen.getByText(value)).toBeInTheDocument();
        });
    });

    it('should have "required" validation errors on required form fields', async () => {
        renderComponent();

        await waitFor(() => {
            const first_name = screen.getByTestId('dt_first_name');
            userEvent.clear(first_name);
        });
        expect(screen.getByText(/First name is required./)).toBeInTheDocument();
    });

    it('should display error for 2-50 characters length validation, for First name when entered characters are less than 2', async () => {
        renderComponent();
        await waitFor(() => {
            const last_name = screen.getByTestId('dt_last_name');
            fireEvent.input(last_name, { target: { value: 'b' } });
        });

        expect(screen.getByText(/You should enter 2-50 characters./)).toBeInTheDocument();
    });

    it('should display error for 2-50 characters length validation, for Last name when entered characters are more than 50', async () => {
        renderComponent();
        await waitFor(() => {
            const first_name = screen.getByTestId('dt_last_name');
            fireEvent.input(first_name, { target: { value: 'fifty chars fifty chars fifty chars fifty chars fifty' } });
        });
        expect(screen.getByText(/You should enter 2-50 characters./)).toBeInTheDocument();
    });

    it('should display error for the regex validation, for First name when unacceptable characters are entered', async () => {
        renderComponent();

        await waitFor(() => {
            const first_name = screen.getByTestId('dt_first_name');
            fireEvent.input(first_name, { target: { value: 'test 3' } });
            expect(screen.getByText('Letters, spaces, periods, hyphens, apostrophes only.')).toBeInTheDocument();
        });
    });

    it('should not display error for the regex validation, for First name when acceptable characters are entered', async () => {
        renderComponent();
        await waitFor(() => {
            const first_name = screen.getByTestId('dt_first_name');
            fireEvent.input(first_name, { target: { value: "test-with' chars." } });
            expect(screen.queryByText('Letters, spaces, periods, hyphens, apostrophes only.')).not.toBeInTheDocument();
        });
    });

    it('should render professional client if support_professional_client is true with not verified account', async () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        renderComponent();
        const professional_client_text = [
            /Professional Client/,
            /By default, all Deriv.com clients are retail clients but anyone can request to be treated as a professional client./,
            /A professional client receives a lower degree of client protection due to the following./,
            /We presume that you possess the experience, knowledge, and expertise to make your own investment decisions and properly assess the risk involved./,
            /We’re not obliged to conduct an appropriateness test, nor provide you with any risk warnings./,
            /You’ll need to authenticate your account before requesting to become a professional client./,
            /Authenticate my account/,
        ];
        professional_client_text.forEach(value => {
            expect(screen.getByText(value)).toBeInTheDocument();
        });
        const auth_text = screen.getByText(/Authenticate my account/);
        const auth_link = auth_text.getAttribute('href');
        expect(auth_link).toBe('/account/proof-of-identity');
    });

    it('should render POI auth link', async () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        renderComponent();
        const auth_text = screen.getByText(/Authenticate my account/);
        const auth_link = auth_text.getAttribute('href');
        expect(auth_link).toBe('/account/proof-of-identity');
    });

    it('should render POA auth link', async () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        mock_store.client.authentication_status.identity_status = 'verified';
        renderComponent();
        const auth_text = screen.getByText(/Authenticate my account/);
        const auth_link = auth_text.getAttribute('href');
        expect(auth_link).toBe('/account/proof-of-address');
    });

    it('should render professional client if support_professional_client is true with verified account', async () => {
        mock_store.client.current_landing_company.support_professional_client = 'true';
        mock_store.client.authentication_status.document_status = 'verified';
        mock_store.client.authentication_status.identity_status = 'verified';
        renderComponent();
        expect(
            screen.getByRole('checkbox', { name: /I would like to be treated as a professional client./ })
        ).toBeInTheDocument();
    });

    it('should update user profile after clicking on submit', async () => {
        renderComponent();
        const first_name = screen.getByTestId('dt_first_name') as HTMLInputElement;
        await waitFor(() => {
            expect(first_name.value).toBe('John');
            fireEvent.input(first_name, { target: { value: 'James' } });
        });
        const submit_button = screen.getByRole('button', { name: /Submit/ });
        userEvent.click(submit_button);
        expect(first_name.value).toBe('James');
    });

    it('should only display country of residence if isVirtual is true', () => {
        mock_store.client.is_virtual = true;
        renderComponent();
        const exceptional_fields = [
            'First name*',
            'Last name*',
            'Place of birth',
            'Date of birth*',
            'Citizenship',
            'Phone number*',
            'First line of address*',
            'Second line of address (optional)',
            'Town/City*',
            'State/Province (optional)',
            'Postal/ZIP code',
        ];
        exceptional_fields.forEach(value => {
            expect(screen.queryByText(value)).not.toBeInTheDocument();
        });
        expect(screen.getByText('Country of residence*')).toBeInTheDocument();
    });

    it('should render loading component', () => {
        mock_settings.mutation.isLoading = true;
        renderComponent();
        expect(screen.queryByText(/Loading/)).toBeInTheDocument();
    });
});
