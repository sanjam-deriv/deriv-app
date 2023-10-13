import { useAuthorize, useQuery } from '@deriv/api';

/**
 * A custom hook for fetching the details of connected oauth apps.
 */
const useOAuthConnectedApps = () => {
    const { isSuccess } = useAuthorize();

    const { data, ...rest } = useQuery('oauth_apps', {
        options: { enabled: isSuccess },
    });

    return {
        data: data?.oauth_apps,
        ...rest,
        isError: Object.hasOwn(data ?? {}, 'error'),
        isSuccess: !Object.hasOwn(data ?? {}, 'error'),
    };
};

export default useOAuthConnectedApps;
