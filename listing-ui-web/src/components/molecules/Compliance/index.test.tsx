import React, { FC } from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { Formik } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { format } from 'date-fns';

import theme from '../../../configuration/theme';
import Compliance from './index';
import { IListing } from '../../../types/Listing';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

interface WrapperProps {
  initValues?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({
  initValues = {
    listingDetails: {
      compliance: {
        confirmedLandRegistryOwnership: false,
        landRegistryDocsUri: '',
        agencyAgreementSignedDate: new Date(2020, 2, 18),
        competitorAgreementExpiry: (null as unknown) as string,
        agencyAgreementPeriod: 10
      }
    }
  },
  children
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Formik initialValues={initValues} onSubmit={() => {}}>
        {children}
      </Formik>
    </ThemeProvider>
  );
};

describe('Compliance', () => {
  describe('confirmedLandRegistryOwnership field', () => {
    it('should display the land registry confirmation label', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

      expect(
        getByLabelText(
          'I have seen the Land Registry confirmation that confirms this customer is the owner of the property'
        )
      ).not.toBeNull();
    });
  });

  describe('landRegistryDocsUri field', () => {
    it('should display the land registry document url label', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

      expect(getByLabelText('Link to Land Registry documents')).not.toBeNull();
    });

    it('should display https://landregistry.data.gov.uk/ as the placeholder value for the land registry docs field', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Link to Land Registry documents');
      const input = inputNode as HTMLInputElement;

      expect(input.placeholder).toBe('https://landregistry.data.gov.uk/');
    });

    it('should display the url the user enters', async () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Link to Land Registry documents');
      const input = inputNode as HTMLInputElement;

      fireEvent.change(input, {
        target: {
          value: 'https://landregistry.data.gov.uk/allyourlandarebelongtome'
        }
      });

      await wait(() => {
        expect(input.value).toBe(
          'https://landregistry.data.gov.uk/allyourlandarebelongtome'
        );
      });
    });
  });

  describe('Agreement period field tests', () => {
    it('should display the agreement period', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

      expect(getByLabelText('Period')).not.toBeNull();
    });

    it('should make sure the agreement period representing the correct date used in formik', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

      const labelInput = getByLabelText('Period') as HTMLInputElement;

      expect(labelInput.value).toBe('10 Weeks');
    });

    it('should make sure the agreement period is read-only', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

      const labelInput = getByLabelText('Period') as HTMLInputElement;
      expect(labelInput.hasAttribute('disabled')).toBe(true);
    });
  });
});

describe('Agreement date field tests', () => {
  it('should display the agreement date', () => {
    const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

    expect(getByLabelText('Agreement Date')).not.toBeNull();
  });

  it('should make sure the agreement date is not null whenever is displayed', () => {
    const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

    const labelInput = getByLabelText('Agreement Date') as HTMLInputElement;

    expect(labelInput.value).not.toBe(null);
    expect(labelInput.value).not.toBe('');
  });

  it('should make sure the agreement date representing the correct date used in formik', () => {
    const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

    const labelInput = getByLabelText('Agreement Date') as HTMLInputElement;

    expect(labelInput.value).toBe('18/03/2020');
  });

  it('should make sure the agreement date is read-only', () => {
    const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });
    const labelInput = getByLabelText('Agreement Date') as HTMLInputElement;
    expect(labelInput.hasAttribute('disabled')).toBe(true);
  });

  it('should not display a validation error when the date comes as null from the back-end', () => {
    const { queryByText } = render(<Compliance />, {
      wrapper: Wrapper
    });
    const validationError = queryByText('Invalid Date Format');

    expect(validationError).toBe(null);
  });

  describe('expiry date field tests', () => {
    it('should display the expiry date', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

      expect(getByLabelText('Agreement Expires on')).not.toBeNull();
    });

    it('should display the correct date -placeholder- if the date comes as null from the back-end', () => {
      const { getByLabelText } = render(<Compliance />, { wrapper: Wrapper });

      const expectedDate = '';
      const datePicker = getByLabelText('Agreement Expires on');
      const datePickerDate = datePicker as HTMLInputElement;
      expect(expectedDate).toBe(datePickerDate.value);
    });

    it('should display the correct date -chosen date- if the date does not come null from the back-end', () => {
      const ComponentWithDatePreSet = (
        <Wrapper
          initValues={{
            listingDetails: {
              compliance: {
                confirmedLandRegistryOwnership: false,
                landRegistryDocsUri: '',
                agencyAgreementSignedDate: new Date(2020, 2, 18).toISOString(),
                competitorAgreementExpiry: new Date(2020, 2, 8).toISOString(),
                agencyAgreementPeriod: 10
              }
            }
          }}
        >
          <Compliance />
        </Wrapper>
      );
      const { getByLabelText } = render(ComponentWithDatePreSet);

      const expectedDate = format(new Date(2020, 2, 8), 'dd/MM/yyyy');
      const datePicker = getByLabelText('Agreement Expires on');
      const datePickerDate = datePicker as HTMLInputElement;

      expect(expectedDate).toBe(datePickerDate.value);
    });
  });

  it('should display the correct date -chosen date- if the date does not come null from the back-end', () => {
    const ComponentWithDatePreSet = (
      <Wrapper
        initValues={{
          listingDetails: {
            compliance: {
              confirmedLandRegistryOwnership: false,
              landRegistryDocsUri: '',
              agencyAgreementPeriod: 10,
              agencyAgreementSignedDate: new Date(2020, 2, 18).toISOString(),
              competitorAgreementExpiry: new Date(2020, 2, 8).toISOString()
            }
          }
        }}
      >
        <Compliance />
      </Wrapper>
    );
    const { getByLabelText } = render(ComponentWithDatePreSet);

    const expectedDate = format(new Date(2020, 2, 8), 'dd/MM/yyyy');
    const datePicker = getByLabelText('Agreement Expires on');
    const datePickerDate = datePicker as HTMLInputElement;

    expect(expectedDate).toBe(datePickerDate.value);
  });

  it('should display the correct date -chosen date- when the user wants to correct using the calendar dialog', async () => {
    const ComponentWithDatePreSet = (
      <Wrapper
        initValues={{
          listingDetails: {
            compliance: {
              confirmedLandRegistryOwnership: false,
              landRegistryDocsUri: '',
              agencyAgreementPeriod: 10,
              agencyAgreementSignedDate: new Date(2020, 2, 18).toISOString(),
              competitorAgreementExpiry: new Date(2020, 2, 8).toISOString()
            }
          }
        }}
      >
        <Compliance />
      </Wrapper>
    );
    const { getByLabelText, getByTestId, getByText } = render(
      ComponentWithDatePreSet
    );

    const date = new Date();
    const expectedDate = format(
      new Date(date.getFullYear(), 2, date.getDate() + 1),
      'dd/MM/yyyy'
    );

    const datePickerIcon = getByTestId(
      'open-calendar-icon listingDetails.compliance.competitorAgreementExpiry'
    );
    const datePickerButton = datePickerIcon.parentElement as HTMLSpanElement;
    fireEvent.click(datePickerButton);

    await wait(() => {
      const pickedDate = getByText(`${date.getDate() + 1}`);
      const pickedDateButton = pickedDate.parentElement as HTMLButtonElement;
      fireEvent.click(pickedDateButton);
    });

    await wait(() => {
      const datePicker = getByLabelText(
        'Agreement Expires on'
      ) as HTMLInputElement;
      expect(datePicker.value).toBe(expectedDate);
    });
  });
});
