import React, { FC } from 'react';
import HomeReport from './index';
import { render, fireEvent, within, act, wait } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import selectMaterialUiSelectOption from 'shared/utils/testing/selectMaterialUiDropdown';
import { createListingSchema } from '../../../schemas/CreateListingSchema';

import theme from '../../../configuration/theme';
import { CreateListing } from '../../organisms/CreateListingForm/types';

type PropertyDetailsValues = Pick<CreateListing, 'propertyDetails'>;
type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

const Wrapper: FC<{
  initVals: PartialNested<PropertyDetailsValues>;
}> = ({ children, initVals }) => {
  const schema = createListingSchema;

  return (
    <ThemeProvider theme={theme}>
      <Formik
        validationSchema={schema}
        initialValues={initVals}
        enableReinitialize
        onSubmit={() => {}}
      >
        <Form>{children}</Form>
      </Formik>
    </ThemeProvider>
  );
};

interface TestComponentProps {
  status?: string;
  currentEer?: number;
  potentialEer?: number;
  currentEir?: number;
  potentialEir?: number;
  exemptionReason?: string;
}

const TestComponent: FC<TestComponentProps> = ({
  status = 'None',
  currentEer = 0,
  potentialEer = 0,
  currentEir = 0,
  potentialEir = 0,
  exemptionReason = 'Seasonal'
}) => {
  const initVals = {
    propertyDetails: {
      homeReport: {
        status: status,
        exemptionReason,
        eer: {
          current: currentEer,
          potential: potentialEer
        },
        eir: {
          current: currentEir,
          potential: potentialEir
        },
        files: []
      }
    }
  };

  return (
    <Wrapper initVals={initVals}>
      <HomeReport />
    </Wrapper>
  );
};

describe('Home Report', () => {
  describe('Home Report Status Radio', () => {
    it('should display the "Home Report received" radio option', () => {
      const { getByLabelText } = render(<TestComponent />);
      expect(getByLabelText('Home report received')).not.toBeNull();
    });

    it('should display the "Property exempt from home report" radio option', () => {
      const { getByLabelText } = render(<TestComponent />);
      expect(getByLabelText('Property exempt from home report')).not.toBeNull();
    });

    it('should display the "Home report not received" radio option', () => {
      const { getByLabelText } = render(<TestComponent />);
      expect(getByLabelText('Home report not received')).not.toBeNull();
    });

    it('should set Home Report Status to "Home report received" when radio button is selected', async () => {
      const { getByLabelText } = render(<TestComponent />);
      const radioOptionInput = within(
        getByLabelText('Home report status selector')
      ).getByLabelText('Home report received') as HTMLInputElement;

      expect(radioOptionInput.checked).toBe(false);
      await act(async () => {
        fireEvent.click(radioOptionInput);
      });
      expect(radioOptionInput.checked).toBe(true);
    });

    it('should set EPC Status to "Property exempt from home report" when radio button is selected', async () => {
      const { getByLabelText } = render(<TestComponent />);
      const radioOptionInput = within(
        getByLabelText('Home report status selector')
      ).getByLabelText('Property exempt from home report') as HTMLInputElement;

      expect(radioOptionInput.checked).toBe(false);
      await act(async () => {
        fireEvent.click(radioOptionInput);
      });
      expect(radioOptionInput.checked).toBe(true);
    });

    it('should have home report exemption invisible by default', async () => {
      const { getByLabelText, queryByLabelText } = render(<TestComponent />);

      const radioOptionInput = within(
        getByLabelText('Home report status selector')
      ).getByLabelText('Property exempt from home report') as HTMLInputElement;
      const homeReportExemptionReason = queryByLabelText('Exemption reason');

      expect(radioOptionInput.checked).toBe(false);
      expect(homeReportExemptionReason).toBeNull();
    });

    it('should have home report exemption visible and works when exempt radio button is shown', async () => {
      const { getByLabelText } = render(<TestComponent />);

      const radioOptionInput = within(
        getByLabelText('Home report status selector')
      ).getByLabelText('Property exempt from home report') as HTMLInputElement;

      await act(async () => {
        fireEvent.click(radioOptionInput);
      });
      const homeReportExemptionReason = getByLabelText(
        'Exemption reason'
      ) as HTMLInputElement;

      await wait(() => {
        selectMaterialUiSelectOption(
          getByLabelText('Exemption reason'),
          'Other'
        );
      });
      expect(radioOptionInput.checked).toBe(true);
      expect(homeReportExemptionReason).toBeDefined();

      expect(homeReportExemptionReason.value).toBe('Other');
    });
  });

  describe('Energy Rating', () => {
    it('should not be visible when home report status is not received', () => {
      const { queryByTestId } = render(<TestComponent />);

      expect(queryByTestId('energy-ratings')).toBeNull();
    });

    it('should display when home report status is received', async () => {
      // Arrange
      const { getByLabelText, getByTestId } = render(<TestComponent />);
      const radioOptionInput = within(
        getByLabelText('Home report status selector')
      ).getByLabelText('Home report received') as HTMLInputElement;

      // Act
      await act(async () => {
        fireEvent.click(radioOptionInput);
      });

      // Assert
      expect(getByTestId('energy-ratings')).not.toBeNull();
    });
  });

  describe('Upload home report', () => {
    it('should display the dropzone when home report status is received', () => {
      const { getByTestId } = render(<TestComponent status="Received" />);
      const node = getByTestId('dropzone');
      expect(node).not.toBeNull();
    });
  });
});
