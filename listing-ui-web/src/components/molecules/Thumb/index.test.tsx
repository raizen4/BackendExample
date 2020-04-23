import React, { FC } from 'react';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../../../configuration/theme';
import Thumb from './index';

afterEach(cleanup);

const Wrapper: FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe('Thumb', () => {
  const image = {
    caption: '',
    uri: '/path/to/blob',
    preview: '/path/to/image',
    isSelected: false,
    isPrimary: false,
    name: 'file1.jpg',
    fileSize: 1234,
    fileType: 'image/jpg',
    isUploading: false,
    isUploaded: false,
    id: 'file1.jpg1234',
    error: false
  };

  const Component = (
    <Thumb
      i={1}
      cols={1}
      image={image}
      onCurrentAssetClick={() => {}}
      isGroupSelected={false}
      isSelected={false}
      handleToggleFromGroupSelect={() => {}}
    />
  );

  it('should render a thumb', () => {
    const { container } = render(Component, {
      wrapper: Wrapper
    });

    expect(container).not.toBeNull();
  });

  it('should display the preview button when the thumb is not group selected', () => {
    const { queryByText } = render(Component, {
      wrapper: Wrapper
    });

    expect(queryByText('Preview')).not.toBeNull();
    expect(queryByText('Deselect')).toBeNull();
  });

  it('should display the deselect button when the thumb is not group selected', () => {
    const { queryByText } = render(
      React.cloneElement(Component, {
        isGroupSelected: true
      }),
      {
        wrapper: Wrapper
      }
    );

    expect(queryByText('Preview')).toBeNull();
    expect(queryByText('Deselect')).not.toBeNull();
  });

  it('should show the star icon when the thumb is the primary image', () => {
    const { getByTestId } = render(
      React.cloneElement(Component, {
        image: {
          isPrimary: true
        }
      }),
      {
        wrapper: Wrapper
      }
    );

    expect(getByTestId('primary-star')).not.toBeNull();
  });

  it('should show the CheckCircleOutlineIcon when the thumb is not group selected', () => {
    const { getByTestId } = render(
      React.cloneElement(Component, {
        isGroupSelected: true
      }),
      {
        wrapper: Wrapper
      }
    );

    expect(getByTestId('checked-icon')).not.toBeNull();
  });

  it('should the RadioButtonUncheckedIcon when the thumb is not group selected', () => {
    const { getByTestId } = render(Component, {
      wrapper: Wrapper
    });

    expect(getByTestId('unchecked-icon')).not.toBeNull();
  });

  //TODO: add tests for tab behaviour
});
