import React, { FC } from 'react';
import { render } from '@testing-library/react';
import PropertyCardList from '.';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../../../configuration/theme';
import { IPropertyCardListView } from '../../../types/PropertyCard';

const Wrapper: FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}));

const energy = {
  current: 0,
  potential: 0
};

const propertyData = {
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
    buildingNumber: '',
    buildingName: '123',
    street: 'Corona Street',
    line2: '',
    line3: 'Birmingham',
    city: '',
    postalCode: 'B1 1TT',
    countryIso: '',
    propertyType: ''
  },
  updatedDateTime: '',
  imageUri: ''
} as IPropertyCardListView;

describe('PropertyCardList', () => {
  describe('SaveForm speed dial', () => {
    const { getByTestId } = render(<PropertyCardList propertyData={[]} />, {
      wrapper: Wrapper
    });
    it('should show speed dial to add property', () => {
      expect(() => getByTestId('speed-dial')).not.toBeNull();
    });
  });

  describe('Property Card', () => {
    const { getByTestId } = render(
      <PropertyCardList propertyData={[propertyData]} />,
      {
        wrapper: Wrapper
      }
    );
    it('should display one or more property cards when data', () => {
      expect(() => getByTestId('property-card-0')).not.toBeNull();
    });
  });
});
