import { InferType } from 'yup';
import { FileWithPath } from 'react-dropzone';
import {
  createListingSchema,
  assetSchema
} from '../../../schemas/CreateListingSchema';
import {
  IPropertyAddress,
  IEpc,
  IHomeReport
} from '../../../types/PropertyCard';

export enum Units {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

export interface ListingAsset extends InferType<typeof assetSchema> {
  isUploading: boolean;
  isUploaded: boolean;
  error: boolean;
  file?: FileWithPath;
  preview?: string;
}

export interface ICreateListingUI {
  listingDetails: {
    floorPlan: {
      images: ListingAsset[];
    };
    images: ListingAsset[];
    descriptions: {
      rooms: CreateListingRoom[];
    };
  };
}

export interface CreateListingPropertyDetails {
  propertyDetails: {
    uri: string;
    companyUri: string;
    propertyActivityPeriodUri: string;
    address: IPropertyAddress;
    createdDateTime: string | null;
    updatedDateTime: string | null;
    epc: IEpc;
    homeReport: IHomeReport | null;
  };
}

export interface CreateListingRoom {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  measurements: {
    length: {
      main: number;
      sub: number;
    };
    width: {
      main: number;
      sub: number;
    };
  };
}

export type CreateListing = InferType<typeof createListingSchema> &
  ICreateListingUI &
  CreateListingPropertyDetails;
