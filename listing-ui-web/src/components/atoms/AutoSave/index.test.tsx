import React, { FC } from 'react';
import { Formik, Form } from 'formik';
import { cleanup, render, wait } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../../../configuration/theme';
import AutoSave from '.';
import { act } from 'react-dom/test-utils';
import { IListing } from '../../../types/Listing';

afterEach(cleanup);
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: getMock,
      setItem: setMock
    },
    writable: true
  });
});
const listing = {
  listingUri: 'listings/12345',
  listingDetails: {},
  propertyDetails: {}
};
const setMock = jest.fn();
const getMock = jest.fn();
const submitMock = jest.fn();

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};
interface WrapperProps {
  initVals?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  const initialValues = listing;

  return (
    <ThemeProvider theme={theme}>
      <Formik initialValues={initialValues} onSubmit={submitMock}>
        <Form>{children}</Form>
      </Formik>
    </ThemeProvider>
  );
};

describe('AutoSave', () => {
  const Component = <AutoSave saveDelaySeconds={0.1} />;

  it('should call form save every so often', async () => {
    act(() => {
      render(React.cloneElement(Component), { wrapper: Wrapper });
    });

    await wait(() => expect(submitMock).toHaveBeenCalledTimes(1));
  });

  it('should call form more than once', async () => {
    act(() => {
      render(React.cloneElement(Component), { wrapper: Wrapper });
    });

    await wait(() => expect(submitMock).toHaveBeenCalledTimes(2));
  });
});
