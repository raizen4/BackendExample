import IAddress from 'shared/types/Address';
import { IAsset } from './Asset';

export interface IEnergyRating {
  current: number;
  potential: number;
}

export interface IEpc {
  status: string;
  rrn: string;
  eer: IEnergyRating;
  eir: IEnergyRating;
  isValid: boolean;
  files: IAsset[];
}

export interface IHomeReport {
  status: string;
  exemptionReason: string;
  eer: IEnergyRating;
  eir: IEnergyRating;
  files: IAsset[];
}

export interface IPropertyAddress extends IAddress {
  externalId: string;
  externalSource: string;
}

export interface IPropertyCard {
  uri: string;
  companyUri: string;
  propertyActivityPeriodUri: string;
  bedroomTotal: number;
  minPrice: number;
  maxPrice: number;
  epc: IEpc;
  homeReport: IHomeReport;
  propertyType: string;
  propertyStyle: string;
  newBuild: boolean;
  address: IPropertyAddress;
  createdDateTime: string | null;
  updatedDateTime: string | null;
  isScottishProperty: boolean;
}

export interface IPropertyCardListView {
  uri: string;
  companyUri: string;
  bedroomTotal: number;
  propertyType: string;
  propertyStyle: string;
  address: IPropertyAddress;
  updatedDateTime: string | null;
  imageUri: string;
}

export interface IGetPropertyCards {
  propertyCards: IPropertyCardListView[];
}

export interface INewPropertyCard {
  name: string;
}
