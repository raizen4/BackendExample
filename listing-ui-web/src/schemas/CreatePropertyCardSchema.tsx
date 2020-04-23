import { object, string } from 'yup';
import addressSchema from 'shared/components/molecules/AddressLookup/schema';

export const propertyCardSchema = object({
  name: string(),
  address: addressSchema
});
