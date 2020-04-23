import Axios from 'axios';
import { BASE_DOMAIN_URL } from '../configuration/domains';
import { authProvider } from '../utils/auth/authProvider';
import { IGetPropertyCards, IPropertyAddress } from '../types/PropertyCard';

const contentType = 'application/json';

const PropertyCardUrl = (companyId: string) => {
  return `${BASE_DOMAIN_URL}/companies/${companyId}/property-cards`;
};

const BuildHeaders = (token: string) => ({
  Accept: contentType,
  'Content-Type': contentType,
  Authorization: `Bearer ${token}`
});

export const GetFormattedAddress = (address: IPropertyAddress) => {
  let formattedAddress = '';

  if (address) {
    formattedAddress = address.postalCode;

    if (address.line3) {
      formattedAddress = `${address.line3}, ${formattedAddress}`;
    }
    if (address.street) {
      formattedAddress = `${address.street.toUpperCase()}, ${formattedAddress}`;
    }
    if (address.buildingNumber) {
      formattedAddress = `${address.buildingNumber} ${formattedAddress}`;
    }
    if (address.buildingName) {
      formattedAddress = `${address.buildingName}, ${formattedAddress}`;
    }
  }

  return formattedAddress;
};

export const GetPropertyCardsByCompany = async (
  companyId: string
): Promise<IGetPropertyCards> => {
  if (authProvider) {
    const token = await authProvider.getAccessToken();
    const res = await Axios.get<IGetPropertyCards>(PropertyCardUrl(companyId), {
      headers: BuildHeaders(token.accessToken)
    });
    return res.data;
  } else {
    throw new Error(`Unable to authenticate`);
  }
};

export const GetPropertyCardsTest = (): IGetPropertyCards => {
  return {
    propertyCards: [
      {
        uri: '412',
        companyUri: '',
        bedroomTotal: 4,
        propertyType: '',
        propertyStyle: '',
        address: {
          externalId: '',
          externalSource: '',
          uprn: '',
          company: '',
          buildingNumber: '123',
          buildingName: '',
          street: 'Paradise Road',
          line2: '',
          line3: 'Birmingham',
          city: '',
          postalCode: 'B1 1TT',
          countryIso: '',
          propertyType: ''
        },
        updatedDateTime: ''
      },
      {
        uri: '123',
        companyUri: '',
        bedroomTotal: 3,
        propertyType: '',
        propertyStyle: '',
        address: {
          externalId: '',
          externalSource: '',
          uprn: '',
          company: '',
          buildingNumber: '3',
          buildingName: '',
          street: 'Trinity Lane',
          line2: '',
          line3: 'Birmingham',
          city: '',
          postalCode: 'B1 1TT',
          countryIso: '',
          propertyType: ''
        },
        updatedDateTime: '2020-03-24T11:08:35.4461799Z'
      },
      {
        uri: '222',
        companyUri: '',
        bedroomTotal: 1,
        propertyType: 'House',
        propertyStyle: 'Semi Detatched',
        address: {
          externalId: '',
          externalSource: '',
          uprn: '',
          company: '',
          buildingNumber: '123',
          buildingName: '',
          street: 'Corona Street',
          line2: '',
          line3: 'Birmingham',
          city: '',
          postalCode: 'B1 1TT',
          countryIso: '',
          propertyType: ''
        },
        updatedDateTime: '2020-02-12T16:08:35.4461799Z'
      }
    ]
  } as IGetPropertyCards;
};
