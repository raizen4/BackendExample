import React, { FC } from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';

import Media from './index';
import theme from '../../../configuration/theme';
import { IListing } from '../../../types/Listing';
import userEvent from '@testing-library/user-event';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

interface WrapperProps {
  initVals?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  const initVals = {
    listingDetails: {
      floorPlan: {
        code: '',
        images: [
          {
            uri: ''
          }
        ]
      },
      tour: '',
      video: ''
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Formik initialValues={initVals} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    </ThemeProvider>
  );
};

describe('Metropix Floorplan input', () => {
  it('should display the floorplan label', () => {
    const { getByLabelText } = render(<Media />, { wrapper: Wrapper });
    expect(getByLabelText('Metropix Floorplan Code')).not.toBeNull();
  });

  it('should display placeholder value for the Metropix floorplan input ', () => {
    const { getByPlaceholderText } = render(<Media />, { wrapper: Wrapper });
    const input = getByPlaceholderText('e.g. 123456') as HTMLInputElement;
    expect(input).not.toBeNull();
  });

  it('should interact and display input', async () => {
    const { getByPlaceholderText } = render(<Media />, { wrapper: Wrapper });
    const input = getByPlaceholderText('e.g. 123456') as HTMLInputElement;
    const val = '123456';

    fireEvent.change(input, {
      target: {
        value: val
      }
    });

    expect(input.value).toBe(val);
  });

  it('should render the image if provided with a valid code', async () => {
    const { getByTestId, getByText, getByLabelText } = render(<Media />, {
      wrapper: Wrapper
    });
    const codeInput = getByLabelText(/Metropix Floorplan Code/i);
    const applyButton = getByText(/Apply Code/i);
    await userEvent.type(codeInput, '1');
    userEvent.click(applyButton);
    await wait(() => {
      expect(getByTestId('metropix-image')).toBeTruthy();
    });
  });
});

describe('Upload floorplan image', () => {
  it('should display the dropzone', () => {
    const { getByTestId } = render(<Media />, { wrapper: Wrapper });
    const node = getByTestId('dropzone');
    expect(node).not.toBeNull();
  });
});

describe('Embed a 360 virtual tour', () => {
  it('should display the embed tour label', () => {
    const { getByLabelText } = render(<Media />, { wrapper: Wrapper });
    const label = getByLabelText('Embed a 360° tour') as HTMLInputElement;
    expect(label).not.toBeNull();
  });

  it('should display Matterport URL placeholder value for the tour input ', () => {
    const { getByPlaceholderText } = render(<Media />, { wrapper: Wrapper });
    const input = getByPlaceholderText(
      'e.g. https://my.matterport.com/show/?m=1234567890'
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
  });

  it('should interact and display input', async () => {
    const { getByPlaceholderText } = render(<Media />, { wrapper: Wrapper });
    const input = getByPlaceholderText(
      'e.g. https://my.matterport.com/show/?m=1234567890'
    ) as HTMLInputElement;
    const val = 'www.awesometours.com/tour/12345';

    fireEvent.change(input, {
      target: {
        value: val
      }
    });

    expect(input.value).toBe(val);
  });
});

describe('Add an audio/video tour', () => {
  it('should display the embed audio tour label', () => {
    const { getByLabelText } = render(<Media />, { wrapper: Wrapper });
    const label = getByLabelText('Embed an audio tour') as HTMLInputElement;
    expect(label).not.toBeNull();
  });

  it('should display a URL placeholder for the audio tour input', () => {
    const { getByPlaceholderText } = render(<Media />, { wrapper: Wrapper });
    const input = getByPlaceholderText(
      'e.g. https://www.vimeo.com/yourtour-123456'
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
  });

  it('should interact and display input', () => {
    const { getByPlaceholderText } = render(<Media />, { wrapper: Wrapper });
    const input = getByPlaceholderText(
      'e.g. https://www.vimeo.com/yourtour-123456'
    ) as HTMLInputElement;
    const val = 'www.my-super-house-tour.com/123456';

    fireEvent.change(input, {
      target: {
        value: val
      }
    });

    expect(input.value).toBe(val);
  });
});
