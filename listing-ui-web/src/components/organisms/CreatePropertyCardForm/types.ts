import { propertyCardSchema } from '../../../schemas/CreatePropertyCardSchema';
import { InferType } from 'yup';

export type INewPropertyCardForm = InferType<typeof propertyCardSchema>;
