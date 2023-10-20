import { useMemo } from 'react';
import useResidenceList from './useResidenceList';
import useSettings from './useSettings';
import useAuthentication from './useAuthentication';

/** A custom hook to get the proof of identity verification info of the current user. */
const usePOI = () => {
    const { data: authentication_data, ...rest } = useAuthentication();
    const { data: residence_list_data } = useResidenceList();
    const { data: get_settings_data } = useSettings();

    const previous_service = useMemo(() => {
        const latest_poi_attempt = authentication_data?.attempts?.latest;
        return latest_poi_attempt?.service;
    }, [authentication_data?.attempts?.latest]);

    /**
     * @description Get the previous POI attempts details (if any)
     */
    const previous_poi = useMemo(() => {
        if (!previous_service) {
            return null;
        }

        const services = authentication_data?.identity?.services;
        if (services && services.manual) {
            return {
                service: previous_service,
                status: services.manual.status,
            };
        }

        const current_service = services?.[previous_service as 'idv' | 'onfido'];
        return {
            service: previous_service,
            status: current_service?.status,
            reported_properties: current_service?.reported_properties,
            last_rejected: current_service?.last_rejected,
            submissions_left: current_service?.submissions_left || 0,
        };
    }, [previous_service, authentication_data?.identity?.services]);

    /**
     * @description Get the next step based on a few check. Returns configuration for document validation as well
     */
    const next_poi = useMemo(() => {
        const user_country_code = get_settings_data?.citizen || get_settings_data?.country_code;
        const matching_residence_data = residence_list_data?.find(r => r.value === user_country_code);
        const is_idv_supported = matching_residence_data?.identity?.services?.idv?.is_country_supported;
        const is_onfido_supported = matching_residence_data?.identity?.services?.onfido?.documents_supported;
        const services = authentication_data?.identity?.services;
        const idv_submission_left = services?.idv?.submissions_left ?? 0;
        const onfido_submission_left = services?.onfido?.submissions_left ?? 0;
        if (is_idv_supported && idv_submission_left && !authentication_data?.is_idv_disallowed) {
            return {
                service: 'idv',
                submission_left: idv_submission_left,
                document_supported: matching_residence_data?.identity?.services?.idv?.documents_supported,
            };
        } else if (is_onfido_supported && onfido_submission_left) {
            return {
                service: 'onfido',
                submission_left: onfido_submission_left,
                document_supported: matching_residence_data?.identity?.services?.onfido?.documents_supported,
            };
        }
        return {
            service: 'manual',
        };
    }, [
        get_settings_data?.citizen,
        get_settings_data?.country_code,
        residence_list_data,
        authentication_data?.identity?.services,
        authentication_data?.is_idv_disallowed,
    ]);

    const modified_verification_data = useMemo(() => {
        if (!authentication_data) return;

        return {
            ...authentication_data?.identity,
            previous: previous_poi,
            next: next_poi,
        };
    }, [authentication_data, next_poi, previous_poi]);

    return {
        data: modified_verification_data,
        ...rest,
    };
};

export default usePOI;
