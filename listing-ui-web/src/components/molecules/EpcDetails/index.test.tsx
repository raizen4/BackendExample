import React, { FC } from 'react';
import EpcDetails from './index';
import { render, act, fireEvent, within } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
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
}

const TestComponent: FC<TestComponentProps> = ({ status = 'None' }) => {
  const initVals = {
    propertyDetails: {
      epc: {
        status: status,
        isValid: false,
        eer: {
          current: 0,
          potential: 0
        },
        eir: {
          current: 0,
          potential: 0
        },
        files: []
      }
    }
  };

  return (
    <Wrapper initVals={initVals}>
      <EpcDetails />
    </Wrapper>
  );
};

describe('Epc Details', () => {
  describe('Epc Status Radio', () => {
    it('should display the EPC received radio option', () => {
      const { getByLabelText } = render(<TestComponent />);
      expect(getByLabelText('EPC received')).not.toBeNull();
    });

    it('should display the EPC applied for radio option', () => {
      const { getByLabelText } = render(<TestComponent />);
      expect(getByLabelText('EPC applied for')).not.toBeNull();
    });

    it('should display the EPC not yet applied for radio option', () => {
      const { getByLabelText } = render(<TestComponent />);
      expect(getByLabelText('EPC not yet applied for')).not.toBeNull();
    });

    it('should set EPC Status to "EPC received" when radio button is selected', async () => {
      const { getByLabelText } = render(<TestComponent />);
      const radioOptionInput = within(
        getByLabelText('EPC status selector')
      ).getByLabelText('EPC received') as HTMLInputElement;

      expect(radioOptionInput.checked).toBe(false);

      await act(async () => {
        fireEvent.click(radioOptionInput);
      });

      expect(radioOptionInput.checked).toBe(true);
    });

    it('should set EPC Status to "EPC applied for" when radio button is selected', async () => {
      const { getByLabelText } = render(<TestComponent />);
      const radioOptionInput = within(
        getByLabelText('EPC status selector')
      ).getByLabelText('EPC applied for') as HTMLInputElement;

      expect(radioOptionInput.checked).toBe(false);

      await act(async () => {
        fireEvent.click(radioOptionInput);
      });

      expect(radioOptionInput.checked).toBe(true);
    });
  });

  describe('EPC isValid field', () => {
    it('should display the isValid checkbox label, "The EPC is in date and valid"', () => {
      const { getByLabelText } = render(<TestComponent status="Received" />);

      expect(getByLabelText('The EPC is in date and valid')).not.toBeNull();
    });

    it('should check the checkbox when clicked', async () => {
      const { getByLabelText } = render(<TestComponent status="Received" />);

      const checkbox = getByLabelText(
        'The EPC is in date and valid'
      ) as HTMLInputElement;

      await act(async () => {
        fireEvent.click(checkbox);
      });

      expect(checkbox.checked).toBe(true);
    });

    it('should not be visible when epc status is not received', () => {
      const { queryByLabelText } = render(<TestComponent />);
      expect(queryByLabelText('The EPC is in date and valid')).toBeNull();
    });

    it('should display the checkbox when epc status is received', async () => {
      // Arrange
      const { getByLabelText } = render(<TestComponent />);
      const radioOptionInput = within(
        getByLabelText('EPC status selector')
      ).getByLabelText('EPC received') as HTMLInputElement;

      // Act
      await act(async () => {
        fireEvent.click(radioOptionInput);
      });

      // Assert
      expect(radioOptionInput.checked).toBe(true);
      expect(getByLabelText('The EPC is in date and valid')).not.toBeNull();
    });
  });

  describe('EnergyRating', () => {
    it('should not be visible when epc status is not received', () => {
      const { queryByTestId } = render(<TestComponent />);

      expect(queryByTestId('energy-ratings')).toBeNull();
    });

    it('should display when epc status is received', async () => {
      // Arrange
      const { getByLabelText, getByTestId } = render(<TestComponent />);
      const radioOptionInput = within(
        getByLabelText('EPC status selector')
      ).getByLabelText('EPC received') as HTMLInputElement;

      // Act
      await act(async () => {
        fireEvent.click(radioOptionInput);
      });

      // Assert
      expect(getByTestId('energy-ratings')).not.toBeNull();
    });
  });

  describe('Upload EPC report', () => {
    it('should display the dropzone when epc status is received', async () => {
      const { getByTestId } = render(<TestComponent status="Received" />);
      const node = getByTestId('dropzone');
      expect(node).not.toBeNull();
    });
  });
});
