import React, { FC } from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../../../configuration/theme';
import DimensionInput from './index';
import { Directions, IDimensionInputProps } from './types';
import { Units } from '../../organisms/CreateListingForm/types';
import { Formik, Form } from 'formik';
import userEvent from '@testing-library/user-event';
import { roomSchema } from '../../../schemas/CreateListingSchema';

afterEach(cleanup);

const Wrapper: FC = ({ children }) => {
  const initialValues = {
    measurements: {
      width: { main: 1, sub: 0 },
      length: { main: 1, sub: 0 }
    }
  };
  const schema = roomSchema;

  return (
    <ThemeProvider theme={theme}>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={() => {}}
      >
        <Form>{children}</Form>
      </Formik>
    </ThemeProvider>
  );
};

describe('DimensionInput', () => {
  const Component = (
    <DimensionInput
      direction={Directions.WIDTH}
      name="measurements"
      unit={Units.IMPERIAL}
    />
  );
  const RenderElement = (propsToChange: Partial<IDimensionInputProps>) =>
    render(React.cloneElement(Component, { ...propsToChange }), {
      wrapper: Wrapper
    });

  it('should render a Dimension Input', () => {
    const { container } = RenderElement({ unit: Units.IMPERIAL });
    expect(container).not.toBeNull();
  });

  describe('Imperial', () => {
    it('Should display two inputs', () => {
      const { getAllByLabelText } = RenderElement({ unit: Units.IMPERIAL });
      expect(getAllByLabelText(/width.*/)).toHaveLength(2);
    });

    it('Should display imperial units', () => {
      const { getByText } = RenderElement({ unit: Units.IMPERIAL });

      expect(getByText('ft')).not.toBeNull();
      expect(getByText('in')).not.toBeNull();
    });
  });

  describe('Metric', () => {
    it('Should display two input', () => {
      const { getAllByLabelText } = RenderElement({ unit: Units.METRIC });

      expect(getAllByLabelText(/width.*/)).toHaveLength(2);
    });

    it('Should display metric units', () => {
      const { getByText } = RenderElement({ unit: Units.METRIC });

      expect(getByText('m')).not.toBeNull();
      expect(getByText('cm')).not.toBeNull();
    });
  });

  describe('Validation', () => {
    it('Should provide error when number is invalid', async () => {
      const { getByText, getByLabelText } = RenderElement({
        unit: Units.IMPERIAL
      });
      const input = getByLabelText('width-ft') as HTMLInputElement;
      const input2 = getByLabelText('width-in') as HTMLElement;
      userEvent.click(input);
      await userEvent.type(input, 'qqq');
      userEvent.click(input2);

      await wait(() => {
        expect(getByText('Please enter a number')).not.toBeNull();
      });
    });
    it('Should provide error when number is not a whole number', async () => {
      const { getByText, getByLabelText } = RenderElement({
        unit: Units.IMPERIAL
      });
      const input = getByLabelText('width-ft') as HTMLInputElement;
      const input2 = getByLabelText('width-in') as HTMLElement;
      userEvent.click(input);
      await userEvent.type(input, '1.5');
      userEvent.click(input2);

      await wait(() => {
        expect(getByText('Please enter a whole number')).not.toBeNull();
      });
    });
    it('Should show error when number less than 0', async () => {
      const { getByText, getByLabelText } = RenderElement({
        unit: Units.IMPERIAL
      });
      const input = getByLabelText('width-ft') as HTMLInputElement;
      const input2 = getByLabelText('width-in') as HTMLElement;
      userEvent.click(input);
      await userEvent.type(input, '-1');
      userEvent.click(input2);

      await wait(() => {
        expect(
          getByText('Please enter a number greater than 0')
        ).not.toBeNull();
      });
    });
  });
});
