import { Formik, FieldArray, FieldArrayRenderProps } from 'formik';
import React, { FC } from 'react';
import { object, array } from 'yup';
import { render, fireEvent, wait, within } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import FeatureList from '.';
import { IKeyFeature } from '../../../../types/Listing';
import theme from '../../../../configuration/theme';
import userEvent from '@testing-library/user-event';
import {
  newFeatureSchema,
  keyFeaturesSchema
} from '../../../../schemas/CreateListingSchema';

interface Values {
  listingDetails: {
    newFeature: string;
    keyFeatures: IKeyFeature[];
  };
}

interface ITestComponentProps {
  initialValues?: Values;
}

const defaultInitialValues: Values = {
  listingDetails: {
    newFeature: '',
    keyFeatures: [
      {
        feature: 'Feature 0',
        order: 0
      },
      {
        feature: 'Feature 2',
        order: 2
      },
      {
        feature: 'Feature 1',
        order: 1
      }
    ]
  }
};

const testSchema = object({
  listingDetails: object({
    newFeature: newFeatureSchema,
    keyFeatures: array().of(keyFeaturesSchema)
  })
});

const TestComponent: FC<ITestComponentProps> = ({
  initialValues = defaultInitialValues
}) => (
  <ThemeProvider theme={theme}>
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validationSchema={testSchema}
    >
      <FieldArray name="listingDetails.keyFeatures">
        {(helpers: FieldArrayRenderProps) => <FeatureList {...helpers} />}
      </FieldArray>
    </Formik>
  </ThemeProvider>
);

describe('FeatureList', () => {
  it('should render the features in order', async () => {
    const { queryAllByDisplayValue } = render(<TestComponent />);
    const featureNodes = queryAllByDisplayValue(
      /Feature \d/i
    ) as HTMLInputElement[];
    const values = featureNodes.map((node: HTMLInputElement) => node.value);
    expect(values).toEqual(['Feature 0', 'Feature 1', 'Feature 2']);
  });

  describe('adding features', () => {
    it('should add a new feature on add button click', async () => {
      const { getByTestId, getByLabelText, queryAllByDisplayValue } = render(
        <TestComponent />
      );
      const inputNode = getByLabelText(
        /Add and edit features/i
      ) as HTMLInputElement;
      userEvent.click(inputNode);
      await userEvent.type(inputNode, 'Feature 3');
      const buttonNode = getByTestId('add-feature-button');
      userEvent.click(buttonNode);
      await wait(() => {
        const featureNodes = queryAllByDisplayValue(
          /Feature \d/i
        ) as HTMLInputElement[];
        const values = featureNodes.map((node: HTMLInputElement) => node.value);
        expect(values).toEqual([
          'Feature 0',
          'Feature 1',
          'Feature 2',
          'Feature 3'
        ]);
      });
    });

    it('should add a new feature on enter', async () => {
      const { getByLabelText, queryAllByDisplayValue } = render(
        <TestComponent />
      );
      const inputNode = getByLabelText(
        'Add and edit features'
      ) as HTMLInputElement;
      userEvent.click(inputNode);
      await userEvent.type(inputNode, 'Feature 3');
      fireEvent.keyPress(inputNode, {
        key: 'Enter',
        code: 13,
        charCode: 13
      });
      await wait(() => {
        const featureNodes = queryAllByDisplayValue(
          /Feature \d/i
        ) as HTMLInputElement[];
        const values = featureNodes.map((node: HTMLInputElement) => node.value);
        expect(values).toEqual([
          'Feature 0',
          'Feature 1',
          'Feature 2',
          'Feature 3'
        ]);
      });
    });
  });

  describe('removing features', () => {
    it('should remove the feature if the delete icon is clicked', async () => {
      const { getByDisplayValue, queryAllByDisplayValue } = render(
        <TestComponent />
      );
      const deleteIconNode = getByDisplayValue('Feature 0').parentElement
        ?.parentElement?.nextSibling as HTMLElement;

      fireEvent.click(deleteIconNode);
      await wait(() => {
        const newFeatureNodes = queryAllByDisplayValue(
          /Feature \d/i
        ) as HTMLInputElement[];
        const values = newFeatureNodes.map(
          (node: HTMLInputElement) => node.value
        );
        expect(values).toEqual(['Feature 1', 'Feature 2']);
      });
    });

    it('should remove the feature if the backspace key is pressed', async () => {
      const { getByDisplayValue, queryAllByDisplayValue } = render(
        <TestComponent />
      );
      const chipNode = getByDisplayValue('Feature 0').parentElement
        ?.parentElement?.parentElement as HTMLElement;
      userEvent.click(chipNode);
      fireEvent.keyUp(chipNode, {
        key: 'Backspace',
        code: 8,
        charCode: 8
      });
      await wait(() => {
        const newFeatureNodes = queryAllByDisplayValue(
          /Feature \d/i
        ) as HTMLInputElement[];
        const values = newFeatureNodes.map(
          (node: HTMLInputElement) => node.value
        );
        expect(values).toEqual(['Feature 1', 'Feature 2']);
      });
    });
  });

  describe('validation', () => {
    it('should show an error if the new feature is invalid', async () => {
      const { getByLabelText, getByText } = render(<TestComponent />);
      const inputNode = getByLabelText(
        'Add and edit features'
      ) as HTMLInputElement;
      userEvent.click(inputNode);
      await userEvent.type(inputNode, 'Fe');
      userEvent.tab();
      await wait(() => {
        expect(getByText(/Min characters is 3/i)).toBeTruthy();
      });
    });

    it('should validate the chips when edited through double-click', async () => {
      const { getByText, getByDisplayValue } = render(<TestComponent />);
      const inputNode = getByDisplayValue('Feature 1');
      const chipNode = inputNode.parentElement!;
      userEvent.dblClick(chipNode);
      await userEvent.type(inputNode, 'f');
      userEvent.tab();
      await wait(() => {
        expect(() => getByText(/Min characters is 3/i)).toBeTruthy();
      });
    });

    it('should validate the chips when edited through clicking edit button', async () => {
      const { getByText, getByDisplayValue } = render(<TestComponent />);
      const inputNode = getByDisplayValue('Feature 1');
      const chipNode = inputNode.parentElement?.parentElement?.parentElement!;
      const editButtonNode = within(chipNode).getByRole('button');
      userEvent.click(editButtonNode);
      await userEvent.type(inputNode, 'f');
      userEvent.tab();
      await wait(() => {
        expect(() => getByText(/Min characters is 3/i)).toBeTruthy();
      });
    });

    it('should reset new feature field state when new feature added', async () => {
      const { getByTestId, getByLabelText, queryByText } = render(
        <TestComponent />
      );
      const inputNode = getByLabelText(
        /Add and edit features/i
      ) as HTMLInputElement;
      userEvent.click(inputNode);
      await userEvent.type(inputNode, 'Feature 3');
      const buttonNode = getByTestId('add-feature-button');
      userEvent.click(buttonNode);
      await userEvent.type(inputNode, 'fe');
      await wait(() => {
        expect(queryByText(/Min characters is 3/i)).toBeFalsy();
      });
    });

    it('should show a duplicate error if trying to add a new feature which already exists', async () => {
      const { getByLabelText, queryByText } = render(<TestComponent />);
      const inputNode = getByLabelText(
        /Add and edit features/i
      ) as HTMLInputElement;
      userEvent.click(inputNode);
      await userEvent.type(inputNode, 'Feature 0');
      fireEvent.keyPress(inputNode, {
        key: 'Enter',
        code: 13,
        charCode: 13
      });
      await wait(() => {
        expect(queryByText(/This feature already exists/i)).toBeTruthy();
      });
    });

    it('should show a duplicate error if trying to edit a feature to match an existing one', async () => {
      const { getByDisplayValue, queryAllByText } = render(<TestComponent />);
      const inputNode = getByDisplayValue(/Feature 0/) as HTMLInputElement;
      const chipNode = inputNode.parentElement!;
      userEvent.dblClick(chipNode);
      fireEvent.change(inputNode, { target: { value: 'Feature 1' } });
      userEvent.tab();
      await wait(() => {
        expect(queryAllByText(/Duplicate feature/i)).toBeTruthy();
      });
    });
  });
});
