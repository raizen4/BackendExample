import { object, string, array, number, boolean } from 'yup';
import { Units } from '../components/organisms/CreateListingForm/types';
import { IKeyFeature } from '../types/Listing';
import { ExemptionReasonsAsRegex } from '../data/ExemptionReasons';

const sanitiseFeature = (value: string) => value.trim().toLowerCase();

export const assetSchema = object({
  uri: string(),
  id: string(),
  name: string(),
  fileSize: number(),
  fileType: string(),
  isPrimary: boolean().nullable(),
  caption: string().nullable()
});

export const energyRatingSchema = object({
  current: number()
    .integer()
    .min(0)
    .max(100)
    .label('Current rating'),
  potential: number()
    .integer()
    .min(0)
    .max(100)
    .label('Potential rating')
});

export const epcSchema = object({
  status: string(),
  rrn: string(),
  eer: energyRatingSchema,
  eir: energyRatingSchema,
  isValid: boolean(),
  files: array().of(assetSchema)
});

export const homeReportSchema = object({
  status: string(),
  exemptionReason: string().when('status', {
    is: 'Exempt',
    then: string().matches(ExemptionReasonsAsRegex()),
    otherwise: string()
      .matches(/None/)
      .nullable()
  }),
  eer: energyRatingSchema,
  eir: energyRatingSchema,
  files: array().of(assetSchema)
});

export const propertyDetailsSchema = object({
  bedroomTotal: number(),
  minPrice: number(),
  maxPrice: number(),
  epc: object().when('isScottishProperty', {
    is: true,
    then: epcSchema.nullable(),
    otherwise: epcSchema
  }),
  homeReport: object().when('isScottishProperty', {
    is: false,
    then: homeReportSchema.nullable(),
    otherwise: homeReportSchema
  }),
  propertyType: string(),
  propertyStyle: string(),
  newBuild: boolean(),
  isScottishProperty: boolean()
});

export const dimensionSchema = object({
  main: number()
    .typeError('Please enter a number')
    .integer('Please enter a whole number')
    .positive('Please enter a number greater than 0'),
  sub: number()
    .typeError('Please enter a number')
    .integer('Please enter a whole number')
    .positive('Please enter a number greater than 0')
});

export const roomSchema = object({
  id: string(),
  title: string(),
  description: string(),
  displayOrder: number()
    .integer()
    .min(0),
  measurements: object({
    length: dimensionSchema,
    width: dimensionSchema
  })
});

export const descriptionSchema = object({
  summary: string(),
  measurementUnit: string().oneOf([Units.IMPERIAL, Units.METRIC]),
  rooms: array().of(roomSchema)
});

export const viewingRulesSchema = object({
  sameDay: boolean(),
  type: string(),
  autoConfirm: boolean()
});

export const complianceSchema = object({
  confirmedId: boolean(),
  confirmedLandRegistryOwnership: boolean(),
  landRegistryDocsUri: string(),
  confirmedCorrectData: boolean(),
  agencyAgreementSignedDate: string(),
  agencyAgreementPeriod: number(),
  competitorAgreementExpiry: string().nullable()
});

export const newFeatureSchema = string()
  .test('notInFeatures', 'This feature already exists', function(
    newFeature = ''
  ) {
    const currentFeatures: IKeyFeature[] = this.parent?.keyFeatures || [];
    const sanitisedValue = sanitiseFeature(newFeature);
    const matching = currentFeatures.filter(
      (feature: IKeyFeature) =>
        sanitiseFeature(feature?.feature || '') === sanitisedValue
    );
    return !matching.length;
  })
  .min(3, 'Min characters is 3')
  .max(60, 'Max characters is 60');

export const keyFeaturesSchema = object({
  order: number(),
  feature: string()
    .required()
    .min(3, 'Min characters is 3')
    .max(60, 'Max characters is 60')
}).test('notInFeatures', 'Duplicate feature', function({
  feature,
  order
}: IKeyFeature) {
  const currentFeatures: IKeyFeature[] = this.parent || [];
  const sanitisedValue = sanitiseFeature(feature);
  const matching = currentFeatures.filter(
    (feature: IKeyFeature) =>
      sanitiseFeature(feature?.feature || '') === sanitisedValue &&
      feature.order !== order
  );
  return !matching.length;
});

export const floorplanSchema = object({
  code: string()
    .max(6)
    .label('Metropix Floor Plan code'),
  images: array().of(assetSchema)
});

export const listingDetailsSchema = object({
  id: string(),
  marketPrice: number(),
  priceQualifier: string().nullable(),
  images: array().of(assetSchema),
  floorPlan: floorplanSchema,
  video: string(),
  tour: string(),
  descriptions: descriptionSchema,
  viewingRules: viewingRulesSchema,
  compliance: complianceSchema,
  agencyHasKeys: boolean(),
  agencyKeysRef: string(),
  sentAdvancedMarketingPack: boolean(),
  newFeature: newFeatureSchema,
  keyFeatures: array().of(keyFeaturesSchema)
});

export const createListingSchema = object({
  propertyDetails: propertyDetailsSchema,
  listingUri: string(),
  listingDetails: listingDetailsSchema
});
