import React, { FC } from 'react';

import InputText from 'shared/components/molecules/InputText';
import AddressLookup from 'shared/components/molecules/AddressLookup';
import { Form, Formik } from 'formik';
import { propertyCardSchema } from '../../../schemas/CreatePropertyCardSchema';
import { INewPropertyCardForm } from './types';
import PropertyCardSection from '../../atoms/PropertyCardSection';
import {
  addressQuery,
  addressFragmentQuery
} from '../../../services/AddressLookupService';

const initVals: INewPropertyCardForm = {
  name: '',
  address: {
    query: '',
    street: '',
    line2: '',
    city: '',
    postalCode: ''
  }
};

const form: FC = () => {
  const handleSubmit = (values: INewPropertyCardForm) => {};
  return (
    <Formik
      initialValues={initVals}
      onSubmit={handleSubmit}
      validationSchema={propertyCardSchema}
    >
      <Form>
        <PropertyCardSection
          title={`New Property Card Section`}
          descriptionTitle={`Section Description`}
          descriptionBody={`Section Description body`}
        >
          <InputText label="Name" name="name" variant="outlined" fullWidth />
        </PropertyCardSection>
        <PropertyCardSection
          title={`Property address`}
          descriptionTitle={`Property address`}
          descriptionBody={`This is the address of the property for valuation/instruction etc`}
        >
          <AddressLookup
            searchQuery={addressQuery}
            searchFragmentQuery={addressFragmentQuery}
          />
        </PropertyCardSection>
      </Form>
    </Formik>
  );
};

export default form;
