import React, { FC } from 'react';
import { Formik } from 'formik';
import KeyFeatures from './index';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { render, fireEvent, wait } from '@testing-library/react';
import theme from '../../../configuration/theme';
import { IListing } from '../../../types/Listing';

const labelText = 'Add and edit features';
const placeholderText = 'e.g. Off road parking';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};
interface WrapperProps {
  initVals?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({
  initVals = {
    listingDetails: {
      newFeature: '',
      keyFeatures: [
        { order: 0, feature: 'Big Pool' },
        { order: 1, feature: 'Shed of unicorns' }
      ]
    }
  },
  children
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Formik initialValues={initVals} onSubmit={() => {}}>
        {children}
      </Formik>
    </ThemeProvider>
  );
};

describe('KeyFeatures', () => {
  it('should display the warning message ', () => {
    const { getByText } = render(<KeyFeatures />, {
      wrapper: Wrapper
    });
    expect(
      getByText('Only the first 10 features will display in an online advert!')
    ).not.toBeNull();
  });

  it('should display the input box for adding a new feature', () => {
    const { getByLabelText } = render(<KeyFeatures />, { wrapper: Wrapper });

    const inputNode = getByLabelText(labelText);
    const input = inputNode as HTMLInputElement;
    expect(input.placeholder).toBe(placeholderText);
  });

  it('should make sure I cannot add an empty feature in the list', async () => {
    const { getByLabelText, getAllByTestId } = render(<KeyFeatures />, {
      wrapper: Wrapper
    });

    const inputNode = getByLabelText(labelText);
    const input = inputNode as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });

    await wait(() => {
      fireEvent.keyPress(input, {
        key: 'Enter',
        code: 13,
        charCode: 13
      });
    });

    expect(
      getAllByTestId((content: string) => content.startsWith('feature'))
    ).toHaveLength(2);
  });

  it('should make sure when I add a new item it is added at the end of the list with the correct information I provided', async () => {
    const {
      getByLabelText,
      getAllByTestId,
      getByDisplayValue
    } = render(<KeyFeatures />, { wrapper: Wrapper });

    const inputNode = getByLabelText(labelText);
    const input = inputNode as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'My awesome feature' } });

    await wait(() => {
      fireEvent.keyPress(input, {
        key: 'Enter',
        code: 13,
        charCode: 13
      });
    });

    await wait(() => {
      expect(
        getAllByTestId((content: string) => content.startsWith('feature'))
      ).toHaveLength(3);

      const lastItem = getByDisplayValue('My awesome feature');
      expect(lastItem).not.toBe(null);
    });
  });

  it('should make sure when I press Backspace on an item in the array it gets deleted', async () => {
    const { getAllByTestId, queryByDisplayValue, getByDisplayValue } = render(
      <KeyFeatures />,
      {
        wrapper: Wrapper
      }
    );

    const itemIWantToDelete = getByDisplayValue('Shed of unicorns')
      .parentElement?.parentElement?.parentElement as HTMLDivElement;
    await wait(() => {
      fireEvent.keyUp(itemIWantToDelete, {
        key: 'Backspace',
        code: 8,
        charCode: 8
      });
    });

    expect(
      getAllByTestId((content: string, element: HTMLElement) =>
        content.startsWith('feature')
      )
    ).toHaveLength(1);
    expect(queryByDisplayValue('Shed of unicorns')).toBe(null);
  });

  it('should make sure when I press on the X icon on an item in the array it gets deleted', async () => {
    const { getByDisplayValue, getAllByTestId, queryByText } = render(
      <KeyFeatures />,
      {
        wrapper: Wrapper
      }
    );

    const itemIWantToDeleteSVG = getByDisplayValue('Shed of unicorns')
      .parentElement?.parentElement?.nextSibling as HTMLElement;

    await wait(() => {
      fireEvent.click(itemIWantToDeleteSVG);
    });

    expect(
      getAllByTestId((content, element) => content.startsWith('feature'))
    ).toHaveLength(1);
    expect(queryByText('Shed of unicorns')).toBe(null);
  });
});
