import { render, wait, fireEvent } from '@testing-library/react';
import React from 'react';
import ConfirmationDialogOneButton from '.';

describe('ConfirmationDialogOneButton tests', () => {
  it('Should show the dialog with the correct message and title', async () => {
    const { getByText } = render(
      <ConfirmationDialogOneButton
        message="Test Message"
        title="Test Title"
        primaryAction={() => {}}
        open={true}
      />
    );

    await wait(() => {
      expect(getByText('Test Title')).not.toBeNull();
      expect(getByText('Test Message')).not.toBeNull();
    });
  });

  it('Should correctly execute primary action', async () => {
    let hasBeenCalled = false;
    const checkPrimaryAction = () => (hasBeenCalled = true);
    const { getByText } = render(
      <ConfirmationDialogOneButton
        message="Test Message"
        title="Test Title"
        primaryAction={() => {
          checkPrimaryAction();
        }}
        open={true}
      />
    );

    const okButton = getByText('Ok') as HTMLButtonElement;
    fireEvent.click(okButton);
    await wait(() => {
      expect(hasBeenCalled).toBe(true);
    });
  });
});
