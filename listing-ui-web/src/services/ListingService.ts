import Axios from 'axios';
import { LISTING_DOMAIN_URL, BASE_DOMAIN_URL } from '../configuration/domains';
import { authProvider } from '../utils/auth/authProvider';
import { IListing } from '../types/Listing';
import { IAsset } from '../types/Asset';
import { IRemoveFromListingResponse } from './ListingService.types';

const contentType = 'application/json';

const BuildHeaders = (token: string) => ({
  Accept: contentType,
  'Content-Type': contentType,
  Authorization: `Bearer ${token}`
});

export const GetListingById = async (uri: string): Promise<IListing> => {
  try {
    if (authProvider) {
      const token = await authProvider.getAccessToken();
      const res = await Axios.get<IListing>(`${LISTING_DOMAIN_URL}/${uri}`, {
        headers: BuildHeaders(token.accessToken)
      });
      return res.data;
    } else {
      throw new Error(`Unable to authenticate`);
    }
  } catch (error) {
    throw new Error(`Unable to GetListingById`);
  }
};

export const PutListing = async (listing: IListing): Promise<IListing> => {
  try {
    if (authProvider) {
      const token = await authProvider.getAccessToken();
      const res = await Axios.put<IListing>(`${LISTING_DOMAIN_URL}/`, listing, {
        headers: BuildHeaders(token.accessToken)
      });
      return res.data;
    } else {
      throw new Error(`Unable to authenticate`);
    }
  } catch (error) {
    throw new Error(`Unable to PutListing ${error}`);
  }
};

export const DeleteListing = async (listingUri: string): Promise<number> => {
  if (authProvider) {
    const token = await authProvider.getAccessToken();
    const res = await Axios.delete(`${BASE_DOMAIN_URL}${listingUri}/delete`, {
      headers: BuildHeaders(token.accessToken)
    });
    return res.status;
  } else {
    throw new Error(`Unable to authenticate`);
  }
};

export const RestoreListing = async (listingUri: string): Promise<number> => {
  if (authProvider) {
    const token = await authProvider.getAccessToken();
    const res = await Axios.patch(`${BASE_DOMAIN_URL}${listingUri}/restore`, {
      headers: BuildHeaders(token.accessToken)
    });
    return res.status;
  } else {
    throw new Error(`Unable to authenticate`);
  }
};

export const PatchImagesForListing = async (
  listingUri: string,
  image: IAsset
): Promise<Array<IAsset>> => {
  try {
    if (authProvider) {
      const token = await authProvider.getAccessToken();
      const res = await Axios.patch<Array<IAsset>>(
        `${BASE_DOMAIN_URL}${listingUri}/images/add`,
        image,
        {
          headers: BuildHeaders(token.accessToken)
        }
      );
      return res.data;
    } else {
      throw new Error(`Unable to authenticate`);
    }
  } catch (error) {
    throw new Error(`Unable to add image ${image.name}`);
  }
};

export const RequestRemoveImageFromListing = async (
  listingUri: string,
  images: string[]
): Promise<IRemoveFromListingResponse> => {
  try {
    if (authProvider) {
      const token = await authProvider.getAccessToken();
      const response = await Axios.patch<IRemoveFromListingResponse>(
        `${BASE_DOMAIN_URL}${listingUri}/images/remove`,
        images,
        {
          headers: BuildHeaders(token.accessToken)
        }
      );
      return response.data;
    } else {
      throw new Error(`Unable to authenticate`);
    }
  } catch (err) {
    throw new Error(`Unable to Remove images from listing`);
  }
};
