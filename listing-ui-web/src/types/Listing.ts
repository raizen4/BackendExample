import { IAsset } from './Asset';
import { IPropertyCard } from './PropertyCard';

export interface IRoom {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  measurements: {
    width: number;
    length: number;
  };
}

export interface IDescriptions {
  summary: string;
  measurementUnit: string;
  rooms: IRoom[];
}

export interface IViewingRules {
  sameDay: boolean;
  type: string;
  autoConfirm: boolean;
}

export interface ICompliance {
  confirmedId: boolean;
  confirmedLandRegistryOwnership: boolean;
  landRegistryDocsUri: string;
  confirmedCorrectData: boolean;
  agencyAgreementSignedDate: string;
  agencyAgreementPeriod: number;
  competitorAgreementExpiry: string | null;
}

export interface IKeyFeature {
  order: number;
  feature: string;
}

export interface IFloorplan {
  code: string;
  images: IAsset[];
}

export interface IListingDetails {
  id: string;
  marketPrice: number;
  priceQualifier: string | null;
  images: IAsset[];
  floorPlan: IFloorplan;
  video: string;
  tour: string;
  descriptions: IDescriptions;
  viewingRules: IViewingRules;
  compliance: ICompliance;
  agencyHasKeys: boolean;
  agencyKeysRef: string;
  sentAdvancedMarketingPack: boolean;
  newFeature: string;
  keyFeatures: IKeyFeature[];
}

export interface IListing {
  propertyDetails: IPropertyCard;
  listingUri: string;
  listingDetails: IListingDetails;
}
