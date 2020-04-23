import React, { FC } from 'react';
import BasicInfo from './index';
import { render, wait } from '@testing-library/react';
import { Formik, Form } from 'formik';
import selectMaterialUiSelectOption from 'shared/utils/testing/selectMaterialUiDropdown';

import { IListing } from '../../../types/Listing';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

interface WrapperProps {
  initVals?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  const initVals = {
    propertyDetails: {
      propertyType: 'House',
      propertyStyle: 'Pub',
      newBuild: false,
      bedroomTotal: 4
    }
  };

  return (
    <Formik initialValues={initVals} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  );
};

describe('BasicInfo', () => {
  describe('Property Type field', () => {
    it('should display the property type label', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });

      expect(getByLabelText('Type')).not.toBeNull();
    });

    it('should display House as the default value for the property type selector', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Type');
      const input = inputNode as HTMLInputElement;

      expect(input.value).toBe('House');
    });

    it('should change value for the property type when dropdown option is selected', async () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });
      await wait(() => {
        selectMaterialUiSelectOption(getByLabelText('Type'), 'Bungalow');
      });

      const inputNode = getByLabelText('Type');
      const input = inputNode as HTMLInputElement;
      expect(input.value).toBe('Bungalow');
    });
  });

  describe('Property Style field', () => {
    it('should display the property style label', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });

      expect(getByLabelText('Style')).not.toBeNull();
    });

    it('should display Pub as the default value for the property style selector', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Style');
      const input = inputNode as HTMLInputElement;
      expect(input.value).toBe('Pub');
    });

    it('should change value for the property style when dropdown option is selected', async () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });

      await wait(() => {
        selectMaterialUiSelectOption(getByLabelText('Style'), 'Cottage');
      });

      const inputNode = getByLabelText('Style');
      const input = inputNode as HTMLInputElement;
      expect(input.value).toBe('Cottage');
    });
  });

  describe('Property Bedrooms field', () => {
    it('should display the property bedroomTotal label', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });

      expect(getByLabelText('Bedrooms')).not.toBeNull();
    });

    it('should display 4 as the default value for the property bedroomTotal selector', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Bedrooms');
      const input = inputNode as HTMLInputElement;

      expect(input.value).toBe('4');
    });
  });

  describe('New Build field', () => {
    it('should display the new builds label', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });

      expect(getByLabelText('New build?')).not.toBeNull();
    });

    it('should display No as the default value for the new builds selector', () => {
      const { getByLabelText } = render(<BasicInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('New build?');

      expect(inputNode.textContent).toBe('No');
    });
  });
});
