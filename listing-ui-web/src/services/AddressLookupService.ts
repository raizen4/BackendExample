import Axios, { AxiosResponse } from 'axios';
import {
  ADDRESS_LOOKUP_URL,
  ADDRESS_LOOKUP_SEARCH_URL
} from '../configuration/domains';
import { authProvider } from '../utils/auth/authProvider';
import IAddress from 'shared/types/Address';
import { IAddressLookupResponse } from 'shared/components/molecules/AddressLookup/types';

const contentType = 'application/json';

const BuildHeaders = (token: string) => ({
  Accept: contentType,
  'Content-Type': contentType,
  Authorization: `Bearer ${token}`
});

export const addressQuery = async (
  id: string,
  source: string
): Promise<AxiosResponse<IAddress>> => {
  if (authProvider) {
    const token = await authProvider.getAccessToken();
    return Axios.get<IAddress>(ADDRESS_LOOKUP_URL, {
      params: { id, source },
      headers: BuildHeaders(token.accessToken)
    });
  }
  throw new Error(`Unable to authenticate`);
};

export const addressFragmentQuery = async (
  query: string
): Promise<AxiosResponse<IAddressLookupResponse>> => {
  if (authProvider) {
    const token = await authProvider.getAccessToken();
    return Axios.get<IAddressLookupResponse>(ADDRESS_LOOKUP_SEARCH_URL, {
      params: { searchTerm: query },
      headers: BuildHeaders(token.accessToken)
    });
  }
  throw new Error(`Unable to authenticate`);
};
