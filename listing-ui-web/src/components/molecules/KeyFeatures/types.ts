import { keyFeatureSchema } from './index';
import { InferType, ValidationError } from 'yup';

export type KeyFeatureSchema = InferType<typeof keyFeatureSchema>;

export interface IKeyFeatureVariables {
  value: string;
  error: null | ValidationError;
}
