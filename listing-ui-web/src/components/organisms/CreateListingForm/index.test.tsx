import React, { FC } from 'react';
import { render } from '@testing-library/react';
import CreateListingForm from '.';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../../../configuration/theme';
import { initialValues } from '../../../testsUtils/TestHelper';
import { IListing } from '../../../types/Listing';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

interface WrapperProps {
  initVals?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe('CreateListingForm', () => {
  describe('the property is scottish', () => {
    const { getByTestId, getByText } = render(
      <CreateListingForm
        listing={{
          ...initialValues,
          propertyDetails: {
            ...initialValues.propertyDetails,
            isScottishProperty: true
          }
        }}
        setSaving={() => {}}
        setLastSaved={() => {}}
      />,
      { wrapper: Wrapper }
    );
    it('should show Home Report', () => {
      expect(() => getByText('Home Report')).not.toBeNull();
    });

    it('should hide EPC', () => {
      expect(() => getByTestId('epc-details')).toThrow();
    });

    it('should hide Compliance', () => {
      expect(() => getByText('Compliance')).toThrow();
    });
  });

  describe('the property is not scottish', () => {
    const { getByTestId, getByText } = render(
      <CreateListingForm
        listing={{
          ...initialValues,
          propertyDetails: {
            ...initialValues.propertyDetails,
            isScottishProperty: false
          }
        }}
        setSaving={() => {}}
        setLastSaved={() => {}}
      />,
      { wrapper: Wrapper }
    );

    it('should show EPC', () => {
      expect(() => getByTestId('epc-details')).not.toBeNull();
    });

    it('should show Compliance ', () => {
      expect(() => getByText('Compliance')).not.toBeNull();
    });
  });
});
