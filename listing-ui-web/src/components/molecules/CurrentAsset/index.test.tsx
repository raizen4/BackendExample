import React from 'react';
import { render, cleanup, fireEvent, wait } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import { Formik } from 'formik';
import theme from '../../../configuration/theme';
import CurrentAsset from './index';
import { FC } from 'react';
import { IListing } from '../../../types/Listing';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};
interface WrapperProps {
  initVals?: PartialNested<IListing>;
}

afterEach(cleanup);

const Wrapper: FC<WrapperProps> = ({
  children,
  initVals = {
    listingDetails: {
      images: [
        {
          uri: '/path/to/img',
          caption: '',
          isPrimary: false,
          fileSize: 1234,
          name: 'test.jpg'
        }
      ]
    }
  }
}) => (
  <ThemeProvider theme={theme}>
    <Formik initialValues={initVals} onSubmit={() => {}}>
      {children}
    </Formik>
  </ThemeProvider>
);

describe('CurrentAsset - Non-Image File', () => {
  it('should not render IsPrimary checkbox', () => {
    const { queryByTestId } = render(
      <CurrentAsset
        currentSelectedAssetIndex={null}
        isImageUpload={false}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    expect(queryByTestId('primary-button')).toBeNull();
  });

  it('should not render caption', () => {
    const { queryByTestId } = render(
      <CurrentAsset
        currentSelectedAssetIndex={null}
        isImageUpload={false}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    expect(queryByTestId('Caption this photograph')).toBeNull();
  });
});

describe('CurrentAsset - Image', () => {
  it('should render the placeholder', () => {
    const { getByAltText } = render(
      <CurrentAsset
        currentSelectedAssetIndex={null}
        isImageUpload={true}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    expect(getByAltText('Placeholder')).not.toBeNull();
  });

  it('should render correct image', () => {
    const { getByAltText } = render(
      <CurrentAsset
        currentSelectedAssetIndex={0}
        isImageUpload={true}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    expect(getByAltText('test.jpg')).not.toBeNull();
  });

  it('should show the correct order position', () => {
    const { getByText } = render(
      <CurrentAsset
        currentSelectedAssetIndex={0}
        isImageUpload={true}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    expect(getByText('Pos.').nextSibling?.textContent ?? false).toBe('0');
  });

  it('should display the correct primary icon when the image is not primary', () => {
    const { getByTestId } = render(
      <CurrentAsset
        currentSelectedAssetIndex={0}
        isImageUpload={true}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    expect(getByTestId('isnotprimary-icon')).not.toBeNull();
  });

  it('should display the correct primary icon when the image is primary', () => {
    const { getByTestId } = render(
      <Wrapper
        initVals={{
          listingDetails: {
            images: [
              {
                uri: '/path/to/img',
                caption: '',
                isPrimary: true,
                fileSize: 1234,
                name: 'test.jpg'
              }
            ]
          }
        }}
      >
        <CurrentAsset
          currentSelectedAssetIndex={0}
          isImageUpload={true}
          fieldName="listingDetails.images"
        />
      </Wrapper>
    );

    expect(getByTestId('isprimary-icon')).not.toBeNull();
  });

  it('should display the correct primary icon when the icon is clicked', async () => {
    const { getByTestId } = render(
      <CurrentAsset
        currentSelectedAssetIndex={0}
        isImageUpload={true}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    expect(getByTestId('isnotprimary-icon')).not.toBeNull();

    const button = getByTestId('primary-button');
    fireEvent.click(button);

    await wait(() => {
      expect(getByTestId('isprimary-icon')).not.toBeNull();
    });
  });

  it('should set the caption', async () => {
    const { getByLabelText } = render(
      <CurrentAsset
        currentSelectedAssetIndex={0}
        isImageUpload={true}
        fieldName="listingDetails.images"
      />,
      { wrapper: Wrapper }
    );

    const input = getByLabelText('new name goes here') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Im a new caption' } });

    await wait(() => {
      expect(input.value).toBe('Im a new caption');
    });
  });
});
