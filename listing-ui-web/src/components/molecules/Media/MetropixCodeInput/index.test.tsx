import React, { FC } from 'react';
import { Formik } from 'formik';
import { render, act } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { CreateListing } from '../../../organisms/CreateListingForm/types';
import MetropixCodeInput from '.';
import theme from '../../../../configuration/theme';
import { mocked } from 'ts-jest/utils';
import { GetExternalImageUrl } from '../../../../services/AssetService';
import metropixStore, {
  resetMetropixStore
} from '../../../../context/metropixStore';
import userEvent from '@testing-library/user-event';

type ListingDetailsValues = Pick<CreateListing, 'listingDetails'>;
type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

interface ITestComponentProps {
  initialValues?: PartialNested<ListingDetailsValues>;
}

const createInitialValue = (
  code: string
): PartialNested<ListingDetailsValues> => ({
  listingDetails: {
    floorPlan: {
      code
    }
  }
});

const initValues: PartialNested<ListingDetailsValues> = createInitialValue('');
const [, metropixStoreApi] = metropixStore;

jest.mock('../../../../services/AssetService.ts');

const testImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';

const TestComponent: FC<ITestComponentProps> = ({
  initialValues = initValues
}) => (
  <ThemeProvider theme={theme}>
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <MetropixCodeInput />
    </Formik>
  </ThemeProvider>
);

const labelText = /Metropix Floorplan code/i;
const placeholderText = /e.g. 123456/i;
const buttonText = /Apply Code/i;
const errorText = /Failed to load floor plan/i;

describe('MetropixCodeInput', () => {
  beforeEach(() => {
    resetMetropixStore();
    mocked(GetExternalImageUrl).mockReturnValue(testImg);
  });

  describe('Code Input', () => {
    it('should have a label', () => {
      const { getByLabelText } = render(<TestComponent />);
      const inputNode = getByLabelText(labelText) as HTMLInputElement;
      expect(inputNode).toBeTruthy();
    });

    it('should have placeholder text', () => {
      const { getByPlaceholderText } = render(<TestComponent />);
      const inputNode = getByPlaceholderText(
        placeholderText
      ) as HTMLInputElement;
      expect(inputNode).toBeTruthy();
    });

    it('should be empty if it has no initial value', () => {
      const { getByLabelText } = render(<TestComponent />);
      const inputNode = getByLabelText(labelText) as HTMLInputElement;
      expect(inputNode.value).toBeFalsy();
    });

    it('should have a value if it has an initial value', () => {
      const { getByLabelText } = render(
        <TestComponent initialValues={createInitialValue('A')} />
      );
      const inputNode = getByLabelText(labelText) as HTMLInputElement;
      expect(inputNode.value).toBe('A');
    });
  });

  describe('Apply Button', () => {
    it('should not disable the apply button on mount', () => {
      const { getByText } = render(<TestComponent />);
      const buttonNode = getByText(buttonText)
        .parentElement as HTMLButtonElement;
      expect(buttonNode.disabled).toBeFalsy();
    });

    it('should disable the apply button when has url and image not loaded', async () => {
      const { getByText } = render(<TestComponent />);
      const buttonNode = getByText(buttonText)
        .parentElement as HTMLButtonElement;
      await act(async () => {
        metropixStoreApi.setState({ imageUrl: 'A', imageLoaded: false });
      });
      expect(buttonNode.disabled).toBeTruthy();
    });

    it('should show an error if image has failed', async () => {
      const { getByText, getByLabelText } = render(<TestComponent />);
      const inputNode = getByLabelText(labelText) as HTMLInputElement;
      await act(async () => {
        metropixStoreApi.setState({ imageFailed: true });
      });
      userEvent.click(inputNode);
      userEvent.tab(); // Force touched
      expect(getByText(errorText)).toBeTruthy();
    });

    it('should not show an error if image has not failed', async () => {
      const { queryByText, getByLabelText } = render(<TestComponent />);
      const inputNode = getByLabelText(labelText) as HTMLInputElement;
      await act(async () => {
        metropixStoreApi.setState({ imageFailed: false });
      });
      userEvent.click(inputNode);
      userEvent.tab(); // Force touched
      expect(queryByText(errorText)).toBeNull();
    });
  });
});
