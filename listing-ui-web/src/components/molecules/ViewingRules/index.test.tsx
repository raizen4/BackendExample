import React, { FC } from 'react';
import ViewingRules from './index';
import { render, wait, fireEvent, within } from '@testing-library/react';
import { Formik } from 'formik';
import selectMaterialUiSelectOption from 'shared/utils/testing/selectMaterialUiDropdown';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../../../configuration/theme';

const Wrapper: FC<{ autoConfirm?: boolean }> = ({ children, autoConfirm }) => {
  const initVals = {
    listingDetails: {
      viewingRules: {
        type: 'accompanied',
        autoConfirm: autoConfirm,
        sameDay: false
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Formik initialValues={initVals} onSubmit={() => {}}>
        {children}
      </Formik>
    </ThemeProvider>
  );
};

describe('Same day appointment area tests', () => {
  it('should display same day appointment group', () => {
    const { getByText } = render(<ViewingRules />, { wrapper: Wrapper });

    expect(getByText('Same day viewing appointments allowed')).not.toBeNull();
  });

  it('should show the initial state of the radio group correctly with the `NO` option chosen by default', () => {
    const { getByLabelText } = render(<ViewingRules />, { wrapper: Wrapper });

    const yesRadioOptionInput = within(
      getByLabelText('same-day-confirmation-radio-group')
    ).getByLabelText('Yes') as HTMLInputElement;
    const noRadioOptionInput = within(
      getByLabelText('same-day-confirmation-radio-group')
    ).getByLabelText('No') as HTMLInputElement;

    expect(yesRadioOptionInput.checked).toBe(false);
    expect(noRadioOptionInput.checked).toBe(true);
  });

  it('should show the state of the radio group correctly when the user changes it ', async () => {
    const { getByLabelText } = render(<ViewingRules />, { wrapper: Wrapper });

    const yesRadioOptionInput = within(
      getByLabelText('same-day-confirmation-radio-group')
    ).getByLabelText('Yes') as HTMLInputElement;
    const noRadioOptionInput = within(
      getByLabelText('same-day-confirmation-radio-group')
    ).getByLabelText('No') as HTMLInputElement;

    fireEvent.click(yesRadioOptionInput);

    await wait(() => {
      expect(yesRadioOptionInput.checked).toBe(true);
      expect(noRadioOptionInput.checked).toBe(false);
    });
  });
});

describe('Type of viewing appointments field', () => {
  it('should display the type of viewing appointments label', () => {
    const { getByLabelText } = render(<ViewingRules />, { wrapper: Wrapper });

    expect(getByLabelText('Type of viewing appointments')).not.toBeNull();
  });

  it('should display "Accompanied" as the default value', () => {
    const { getByLabelText } = render(<ViewingRules />, { wrapper: Wrapper });
    const inputNode = getByLabelText('Type of viewing appointments');
    const input = inputNode as HTMLInputElement;
    expect(input.value).toBe('accompanied');
  });

  it('should change value to "Combined" when dropdown option is selected', async () => {
    const { getByLabelText } = render(<ViewingRules />, { wrapper: Wrapper });
    const inputNode = getByLabelText('Type of viewing appointments');

    await wait(() => {
      selectMaterialUiSelectOption(inputNode, 'combined');
    });

    const input = inputNode as HTMLInputElement;
    expect(input.value).toBe('combined');
  });

  it('should change value to "Unaccompanied" when dropdown option is selected', async () => {
    const { getByLabelText } = render(<ViewingRules />, { wrapper: Wrapper });
    const inputNode = getByLabelText('Type of viewing appointments');

    await wait(() => {
      selectMaterialUiSelectOption(inputNode, 'unaccompanied');
    });

    const input = inputNode as HTMLInputElement;
    expect(input.value).toBe('unaccompanied');
  });
});

describe('Autoconfirm radio button', () => {
  it('should disable auto-confirm viewing appointments radio when "Unaccompanied" viewing type dropdown option is selected', async () => {
    const { getByLabelText } = render(<ViewingRules />, {
      wrapper: Wrapper
    });

    await wait(() => {
      selectMaterialUiSelectOption(
        getByLabelText('Type of viewing appointments'),
        'unaccompanied'
      );
    });

    const yesRadioOptionInput = within(
      getByLabelText('Auto confirm viewing appointments')
    ).getByLabelText('Yes') as HTMLInputElement;

    const noRadioOptionInput = within(
      getByLabelText('Auto confirm viewing appointments')
    ).getByLabelText('No') as HTMLInputElement;

    expect(yesRadioOptionInput.disabled).toBe(true);
    expect(noRadioOptionInput.disabled).toBe(true);
  });

  it('should set "autoConfirm" viewing rule to "No" when "Unaccompanied" viewing type dropdown option is selected', async () => {
    const { getByLabelText } = render(
      <Wrapper autoConfirm={true}>
        <ViewingRules />
      </Wrapper>
    );

    const yesRadioOptionInput = within(
      getByLabelText('Auto confirm viewing appointments')
    ).getByLabelText('Yes') as HTMLInputElement;

    const noRadioOptionInput = within(
      getByLabelText('Auto confirm viewing appointments')
    ).getByLabelText('No') as HTMLInputElement;

    expect(yesRadioOptionInput.checked).toBe(true);
    expect(noRadioOptionInput.checked).toBe(false);

    await wait(() => {
      selectMaterialUiSelectOption(
        getByLabelText('Type of viewing appointments'),
        'unaccompanied'
      );
    });

    expect(yesRadioOptionInput.checked).toBe(false);
    expect(noRadioOptionInput.checked).toBe(true);
  });

  it('should set "autoConfirm" to "Yes" when "Auto-confirm viewing appointments?" radio button is selected', async () => {
    const { getByLabelText } = render(<ViewingRules />, { wrapper: Wrapper });
    const yesRadioOptionInput = within(
      getByLabelText('Auto confirm viewing appointments')
    ).getByLabelText('Yes') as HTMLInputElement;

    expect(yesRadioOptionInput.checked).toBe(false);

    await wait(() => {
      fireEvent.click(yesRadioOptionInput);
    });
    expect(yesRadioOptionInput.checked).toBe(true);
  });
});
