import React, { FC } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { render, cleanup } from '@testing-library/react';
import { INewPropertyCard } from '../../../types/PropertyCard';
import theme from '../../../configuration/theme';
import CreatePropertyCardForm from '.';

jest.mock('../../../services/AddressLookupService');

const Wrapper: FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
beforeEach(() => {
  cleanup();
});
describe('CreatePropertyCardFrom', () => {
  const { getByText } = render(<CreatePropertyCardForm />, {
    wrapper: Wrapper
  });
  it('renders form card', () => {
    expect(() => getByText('New Property Card Section')).toBeDefined();
  });
});

describe('Address lookup', () => {
  const { getByLabelText } = render(<CreatePropertyCardForm />, {
    wrapper: Wrapper
  });
  it('renders address card', () => {
    expect(() => getByLabelText('Start typing your address...')).toBeDefined();
  });
});
