import React, { FC } from 'react';
import { render, fireEvent, wait, cleanup } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core';
import PropertyDescription from './index';
import muiTheme from '../../../configuration/theme';
import { Units } from '../../organisms/CreateListingForm/types';
import { v1 as uuid } from 'uuid';

const nameInputLabel = 'Name of room';

const Wrapper: FC<{ unit?: string }> = ({ children, unit }) => {
  const initialValues = {
    listingDetails: {
      descriptions: {
        summary: '',
        measurementUnit: unit || Units.METRIC,
        rooms: [
          {
            id: uuid(),
            title: 'General',
            displayOrder: 1,
            measurements: {
              width: '',
              length: '',
              area: ''
            },
            description: ''
          },
          {
            id: uuid(),
            title: 'Living room',
            displayOrder: 2,
            measurements: {
              width: '',
              length: '',
              area: ''
            },
            description: ''
          },
          {
            id: uuid(),
            title: 'Bedroom 2',
            displayOrder: 4,
            measurements: {
              width: '',
              length: '',
              area: ''
            },
            description: ''
          },
          {
            id: uuid(),
            title: 'Bedroom 1',
            displayOrder: 3,
            measurements: {
              width: '',
              length: '',
              area: ''
            },
            description: ''
          },
          {
            id: uuid(),
            title: 'Bathroom',
            displayOrder: 5,
            measurements: {
              width: {},
              length: {}
            },
            description: ''
          }
        ]
      }
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    </ThemeProvider>
  );
};

describe('PropertyDescription', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Collapse', () => {
    it('should say show less when collapse is open', () => {
      const { getByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      expect(getByLabelText('show less')).not.toBeNull();
    });

    it('should say show more when collapse is closed', async () => {
      const { getByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByLabelText('show less');
      fireEvent.click(button);

      await wait(() => {
        expect(getByLabelText('show more')).not.toBeNull();
      });
    });
  });
  describe('Measurements', () => {
    it('should show the measurement units as meters when the unit is metric', () => {
      const { getAllByText } = render(
        <Wrapper unit={Units.METRIC}>
          <PropertyDescription />
        </Wrapper>
      );
      expect(getAllByText('m')).toHaveLength(2);
    });
    it('should show the measurement units as feet when the unit is imperial', () => {
      const { getAllByText } = render(
        <Wrapper unit={Units.IMPERIAL}>
          <PropertyDescription />
        </Wrapper>
      );
      expect(getAllByText('ft')).toHaveLength(2);
    });
  });

  describe('Tabs', () => {
    it('should show the first tab on mount', () => {
      const { getByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const inputNode = getByLabelText(nameInputLabel) as HTMLInputElement;

      expect(inputNode.value).toBe('General');
    });

    it('should create a 2nd tab when the add new button is clicked', async () => {
      const { getByText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      await wait(() => {
        expect(getByText('New room')).not.toBeNull();
      });
    });

    it('should show the 2nd tabpanel when the add new button is clicked', async () => {
      const { getByText, getByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      await wait(() => {
        const inputNode = getByLabelText(nameInputLabel) as HTMLInputElement;

        expect(inputNode.value).toBe('New room');
      });
    });

    it('should show the name of the room in the tab when the name of the room is changed', async () => {
      const { getByText, findByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      const inputNode = (await findByLabelText(
        nameInputLabel
      )) as HTMLInputElement;

      fireEvent.change(inputNode, { target: { value: 'test name' } });

      await wait(() => {
        expect(getByText('test name')).not.toBeNull();
      });
    });

    it('should say room index when the name of the room is empty', async () => {
      const { getByText, findByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const inputNode = (await findByLabelText(
        nameInputLabel
      )) as HTMLInputElement;

      fireEvent.change(inputNode, { target: { value: '' } });

      await wait(() => {
        expect(getByText('Room 1')).not.toBeNull();
      });
    });

    it('should show the correct tabpanel when a tab is clicked', async () => {
      const { getByText, getByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      const tab1 = getByText('General');
      fireEvent.click(tab1);

      await wait(() => {
        const inputNode = getByLabelText(nameInputLabel) as HTMLInputElement;

        expect(inputNode.value).toBe('General');
      });
    });

    it('should delete the tab when the delete button is clicked', async () => {
      const { getByText, getByLabelText, queryByText } = render(
        <PropertyDescription />,
        {
          wrapper: Wrapper
        }
      );

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      const tab1 = getByLabelText('Delete General tab');
      fireEvent.click(tab1);

      const dialogConfirmationDeleteButton = getByText('Yes');
      fireEvent.click(dialogConfirmationDeleteButton);

      await wait(() => {
        const tab = queryByText('General');

        expect(tab).toBeNull();
      });
    });

    it('should delete the tab when the BackSpace key is pressed and the tab is focused', async () => {
      const { getByText, queryByText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      const buttonTab2 = getByText('New room');
      fireEvent.keyDown(buttonTab2.parentElement ?? buttonTab2, {
        key: 'Backspace',
        code: 8,
        charCode: 8
      });

      const dialogConfirmationDeleteButton = getByText('Yes');
      fireEvent.click(dialogConfirmationDeleteButton);

      await wait(() => {
        const tab = queryByText('New room');
        expect(tab).toBeNull();
      });
    });

    it('should delete the tab when the Delete key is pressed and the tab is focused', async () => {
      const { getByText, queryByText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      const buttonTab2 = getByText('New room');
      fireEvent.keyDown(buttonTab2.parentElement ?? buttonTab2, {
        key: 'Delete',
        code: 46,
        charCode: 46
      });

      const dialogConfirmationDeleteButton = getByText('Yes');
      fireEvent.click(dialogConfirmationDeleteButton);

      await wait(() => {
        const tab = queryByText('New room');
        expect(tab).toBeNull();
      });
    });

    it('should show the new first tab when the tab is deleted', async () => {
      const { getByText, getByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const tab1 = getByLabelText('Delete General tab');
      fireEvent.click(tab1);

      const dialogConfirmationDeleteButton = getByText('Yes');
      fireEvent.click(dialogConfirmationDeleteButton);

      await wait(() => {
        const inputNode = getByLabelText(nameInputLabel) as HTMLInputElement;

        expect(inputNode.value).toBe('Living room');
      });
    });

    it('should show the previous tabpanel when tab is deleted', async () => {
      const { getByText, getByLabelText } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const button = getByText(/Add new/i);
      fireEvent.click(button);

      const tab2 = getByLabelText('Delete New room tab');
      fireEvent.click(tab2);

      const dialogConfirmationDeleteButton = getByText('Yes');
      fireEvent.click(dialogConfirmationDeleteButton);

      await wait(() => {
        const inputNode = getByLabelText(nameInputLabel) as HTMLInputElement;

        expect(inputNode.value).toBe('Bathroom');
      });
    });

    it('should show the tabs in the correct display order', async () => {
      const { queryAllByTestId } = render(<PropertyDescription />, {
        wrapper: Wrapper
      });

      const tabs = queryAllByTestId('room-tab');

      const expectedOrder = [
        'General',
        'Living room',
        'Bedroom 2',
        'Bedroom 1',
        'Bathroom'
      ];
      tabs.forEach((tabNode: HTMLElement, index: number) => {
        expect(tabNode.textContent).toBe(expectedOrder[index]);
      });
    });
  });
});

describe('Summary', () => {
  it('should display the summary', () => {
    const { getByLabelText } = render(<PropertyDescription />, {
      wrapper: Wrapper
    });
    expect(getByLabelText('property summary')).not.toBeNull();
  });

  it('should display placeholder value for the summary input ', () => {
    const { getByLabelText } = render(<PropertyDescription />, {
      wrapper: Wrapper
    });
    const inputNode = getByLabelText(/general summary/i);
    const input = inputNode as HTMLInputElement;

    expect(input.placeholder).toBe('Add general details about the property...');
  });

  it('should interact and display input', async () => {
    const { getByLabelText } = render(<PropertyDescription />, {
      wrapper: Wrapper
    });
    const input = getByLabelText(/general summary/i) as HTMLInputElement;
    const val = 'This property is amazing!';

    await wait(() => {
      fireEvent.change(input, {
        target: {
          value: val
        }
      });
    });

    expect(input.value).toBe(val);
  });
});
