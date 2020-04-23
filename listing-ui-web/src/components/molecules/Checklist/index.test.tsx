import React, { FC } from 'react';
import Checklist from './index';
import { render, fireEvent, wait } from '@testing-library/react';
import { Formik, Form } from 'formik';

const Wrapper: FC = ({ children }) => {
  const initVals = {
    listingDetails: {
      agencyHasKeys: false,
      agencyKeysRef: '',
      compliance: {
        confirmedId: false
      },
      sentAdvancedMarketingPack: false
    }
  };

  return (
    <Formik initialValues={initVals} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  );
};

describe('Checklist', () => {
  describe('confirmedId field', () => {
    it('should display the id disclaimer label', () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });

      expect(
        getByLabelText(
          'I confirm I have seen photo ID and a current utility bill for the customer'
        )
      ).not.toBeNull();
    });

    it('should not be checked initially', () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      const inputNode = getByLabelText(
        'I confirm I have seen photo ID and a current utility bill for the customer'
      );
      const input = inputNode as HTMLInputElement;

      expect(input.checked).toBe(false);
    });

    it('should be checked after being clicked on', async () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      const inputNode = getByLabelText(
        'I confirm I have seen photo ID and a current utility bill for the customer'
      );
      const input = inputNode as HTMLInputElement;

      fireEvent.click(input);

      await wait(() => {
        expect(input.checked).toBe(true);
      });
    });
  });

  describe('sentAdvancedMarketingPack field', () => {
    it('should display the advanced marketing pack label', () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });

      expect(
        getByLabelText('Advanced marketing pack sent to customer')
      ).not.toBeNull();
    });

    it('should not be checked initially', () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      const inputNode = getByLabelText(
        'Advanced marketing pack sent to customer'
      );
      const input = inputNode as HTMLInputElement;

      expect(input.checked).toBe(false);
    });

    it('should be checked after being clicked on', async () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      const inputNode = getByLabelText(
        'Advanced marketing pack sent to customer'
      );
      const input = inputNode as HTMLInputElement;

      fireEvent.click(input);

      await wait(() => {
        expect(input.checked).toBe(true);
      });
    });
  });

  describe('agencyHasKeys field', () => {
    it('should display the agent has keys checkbox label', () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      expect(getByLabelText('Agent has keys for property')).not.toBeNull();
    });

    it('should check the checkbox correctly', async () => {
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      const checkbox = getByLabelText(
        'Agent has keys for property'
      ) as HTMLInputElement;
      fireEvent.click(checkbox);
      await wait(() => {
        expect(checkbox.value).toBe('checked');
      });
    });
  });

  describe('agencyKeysRef field', () => {
    it('should not be visible when agencyHasKeys is false by default', () => {
      const { queryByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      expect(queryByLabelText('Reference number for keys (if any)')).toBeNull();
    });

    it('should display the agency keys reference label when agencyHasKeys is true', async () => {
      // Arrange
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      const checkbox = getByLabelText(
        'Agent has keys for property'
      ) as HTMLInputElement;

      // Act
      fireEvent.click(checkbox);

      await wait(() => {
        expect(checkbox.value).toBe('checked');
      });

      // Assert
      expect(
        getByLabelText('Reference number for keys (if any)')
      ).not.toBeNull();
    });

    it('should interact and display input', async () => {
      // Arrange
      const { getByLabelText } = render(<Checklist />, { wrapper: Wrapper });
      const checkbox = getByLabelText(
        'Agent has keys for property'
      ) as HTMLInputElement;

      // Act
      fireEvent.click(checkbox);

      await wait(() => {
        expect(checkbox.value).toBe('checked');
      });

      const input = getByLabelText(
        'Reference number for keys (if any)'
      ) as HTMLInputElement;

      const val = 'Key 123';

      fireEvent.change(input, {
        target: {
          value: val
        }
      });

      // Assert
      expect(input.value).toBe(val);
    });
  });
});
