import { IListing } from '../types/Listing';

export const initialValues: IListing = {
  propertyDetails: {
    uri: '/agent-properties/dc4c5751-3fec-46ba-87b6-cf45e611cfde',
    companyUri: 'companies/1234',
    propertyActivityPeriodUri:
      '/properties/802c4a94-0f3b-4adc-a00b-9cc2bfb08321/activity-periods/c8e9af98-27e7-4f12-9116-c3067958528f',
    bedroomTotal: 4,
    minPrice: 200000,
    maxPrice: 240000,
    epc: {
      status: 'Received',
      rrn: '',
      isValid: true,
      eer: {
        current: 23,
        potential: 32
      },
      eir: {
        current: 45,
        potential: 43
      },
      files: [
        {
          uri: 'string',
          name: 'string',
          fileSize: 1.3,
          fileType: 'string',
          isPrimary: null,
          caption: null,
          id: 'string1.3'
        }
      ]
    },
    homeReport: {
      status: 'None',
      exemptionReason: 'None',
      eer: {
        current: 0,
        potential: 0
      },
      eir: {
        current: 0,
        potential: 0
      },
      files: [
        {
          uri: 'string',
          name: 'string',
          fileSize: 1.3,
          fileType: 'string',
          isPrimary: null,
          caption: null,
          id: 'string1.3'
        }
      ]
    },
    propertyType: 'House',
    propertyStyle: 'DetachedHouse',
    newBuild: false,
    address: {
      uprn: '1275381625465',
      company: '',
      buildingNumber: '31',
      buildingName: '',
      street: 'Court Lane',
      line2: '',
      line3: 'Birmingham',
      city: '',
      postalCode: 'B17 2AA',
      countryIso: '',
      propertyType: '',
      externalId: '',
      externalSource: ''
    },
    createdDateTime: '2020-02-06T14:12:38.3944476+00:00',
    updatedDateTime: '2020-03-09T16:24:28.6397279Z',
    isScottishProperty: false
  },
  listingUri: '/listings/be836067-b65b-4075-a5c3-9fda21fdc840',
  listingDetails: {
    id: '',
    marketPrice: 210000,
    priceQualifier: 'From',
    images: [],
    floorPlan: {
      code: 'd',
      images: [
        {
          uri: 'string',
          name: 'string',
          fileSize: 1.3,
          fileType: 'string',
          isPrimary: null,
          caption: null,
          id: 'string1.3'
        }
      ]
    },
    video: '',
    tour: 'www.zoomzoomzoom.com',
    descriptions: {
      summary:
        "This is a house with some stuff....howdy i'm typing in the form i'm not sure if this will get saved to the backend",
      measurementUnit: 'metric',
      rooms: []
    },
    viewingRules: {
      sameDay: false,
      type: 'combined',
      autoConfirm: false
    },
    compliance: {
      confirmedId: true,
      confirmedLandRegistryOwnership: false,
      landRegistryDocsUri: '',
      confirmedCorrectData: false,
      agencyAgreementSignedDate: '2020-01-20T00:00:00',
      agencyAgreementPeriod: 6,
      competitorAgreementExpiry: '2022-02-21T00:00:00Z'
    },
    agencyHasKeys: true,
    agencyKeysRef: '',
    sentAdvancedMarketingPack: true,
    newFeature: '',
    keyFeatures: []
  }
};
