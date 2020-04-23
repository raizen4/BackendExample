import React, { FC } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core/styles';

import PropertyCard from './index';
import theme from '../../../configuration/theme';
import { IPropertyCardListView } from '../../../types/PropertyCard';

const Wrapper: FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const propertyData = {
  uri: '412',
  companyUri: '',
  bedroomTotal: 4,
  propertyType: 'House',
  propertyStyle: 'Detached',
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
  updatedDateTime: '2020-03-24T11:08:35.4461799Z',
  imageUri: ''
} as IPropertyCardListView;

describe('PropertyCard', () => {
  describe('Image', () => {
    it('should display the property image', () => {
      const { getByAltText } = render(
        <PropertyCard property={propertyData} />,
        { wrapper: Wrapper }
      );
      expect(getByAltText(`image for ${propertyData.address.postalCode}`)).not.toBeNull();
    });
  });

  describe('Details', () => {
    it('should display the formatted address', () => {
      const { getByText } = render(<PropertyCard property={propertyData} />, {
        wrapper: Wrapper
      });

      expect(getByText('123 CORONA STREET, Birmingham, B1 1TT')).not.toBeNull();
    });

    it('should display the propertyType chip', () => {
      const { getByText } = render(<PropertyCard property={propertyData} />, {
        wrapper: Wrapper
      });

      expect(getByText(propertyData.propertyType)).not.toBeNull();
    });

    it('should display the propertyStyle chip', () => {
      const { getByText } = render(<PropertyCard property={propertyData} />, {
        wrapper: Wrapper
      });

      expect(getByText(propertyData.propertyStyle)).not.toBeNull();
    });

    it('should display the bedroomTotal chip', () => {
      const { getByText } = render(<PropertyCard property={propertyData} />, {
        wrapper: Wrapper
      });

      expect(getByText(`${propertyData.bedroomTotal} bedrooms`)).not.toBeNull();
    });
  });

  describe('Last Updated label', () => {
    it('should display the time if updated less than 24-hours ago', () => {
      const dateTime = new Date();
      const updatedProperty = { ...propertyData };
      updatedProperty.updatedDateTime = dateTime.toLocaleString();

      const { getByText } = render(
        <PropertyCard property={updatedProperty} />,
        { wrapper: Wrapper }
      );

      const timeString = new Date(dateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      expect(getByText(`Last updated ${timeString}`)).not.toBeNull();
    });

    it('should display the date if updated over 24-hours ago', () => {
      const { getByText } = render(<PropertyCard property={propertyData} />, {
        wrapper: Wrapper
      });

      const dateVal = propertyData.updatedDateTime as string;
      const updatedDate = Date.parse(dateVal);
      const formattedDate = new Date(updatedDate).toLocaleDateString();
      expect(getByText(`Last updated ${formattedDate}`)).not.toBeNull();
    });

    it('should display N/A if no updated date', () => {
      const updatedProperty = { ...propertyData };
      updatedProperty.updatedDateTime = '';

      const { getByText } = render(
        <PropertyCard property={updatedProperty} />,
        { wrapper: Wrapper }
      );

      expect(getByText('Last updated N/A')).not.toBeNull();
    });
  });
});
