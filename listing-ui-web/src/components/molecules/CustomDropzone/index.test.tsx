import React, { FC } from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import { Formik } from 'formik';
import theme from '../../../configuration/theme';
import {
  dispatchEvt,
  flushPromises,
  createFile,
  createDtWithFiles
} from '../../../utils/fileHelpers';
import CustomDropzone from './index';
import { IListing } from '../../../types/Listing';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

afterEach(cleanup);

interface WrapperProps {
  initVals?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({
  children,
  initVals = {
    listingDetails: {
      images: [
        {
          uri: '/path/to/img',
          isPrimary: false,
          caption: '',
          name: 'test.jpg',
          fileSize: 1243,
          isUploading: false,
          isUploaded: true
        }
      ]
    }
  }
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Formik initialValues={initVals} onSubmit={() => {}}>
        {children}
      </Formik>
    </ThemeProvider>
  );
};

describe('CustomDropzone', () => {
  it('should show the default text with file type', () => {
    const { getByText } = render(
      <CustomDropzone
        multipleFiles={true}
        handleOnDrop={() => {}}
        fileTypes={['image/jpeg']}
      />,
      {
        wrapper: Wrapper
      }
    );
    const label = getByText(/Drop your/i);
    expect(label).not.toBeNull();
  });

  it('should show the confirmation text when dropping a valid file type', async () => {
    const Component = (
      <Wrapper>
        <CustomDropzone
          multipleFiles={true}
          handleOnDrop={() => {}}
          fileTypes={['image/*']}
        />
      </Wrapper>
    );
    const { container, getByText, getByTestId } = render(Component);

    const file = createFile('image', 1234, 'image/jpeg');
    const data = createDtWithFiles([file]);

    const node = getByTestId('dropzone');
    dispatchEvt(node, 'dragenter', data);

    await wait(async () => {
      await flushPromises(Component, container);
      expect(getByText('Drop me inside the box')).not.toBeNull();
    });
  });

  it('should show the error text when dropping an invalid filetype', async () => {
    const Component = (
      <Wrapper>
        <CustomDropzone
          multipleFiles={true}
          handleOnDrop={() => {}}
          fileTypes={['image/*']}
        />
      </Wrapper>
    );
    const { container, getByText, getByTestId } = render(Component);

    const file = createFile('pdf', 1234, 'application/pdf');
    const data = createDtWithFiles([file]);

    const node = getByTestId('dropzone');
    dispatchEvt(node, 'dragenter', data);

    await wait(async () => {
      await flushPromises(Component, container);
      expect(
        getByText('One or more of the files were in the wrong format!')
      ).not.toBeNull();
    });
  });

  it('should show the error text when dropping an invalid filetype when multipleFiles is false', async () => {
    const Component = (
      <Wrapper>
        <CustomDropzone
          multipleFiles={false}
          handleOnDrop={() => {}}
          fileTypes={['image/*']}
        />
      </Wrapper>
    );
    const { container, getByText, getByTestId } = render(Component);

    const file = createFile('pdf', 1234, 'application/pdf');
    const data = createDtWithFiles([file]);

    const node = getByTestId('dropzone');
    dispatchEvt(node, 'dragenter', data);

    await wait(async () => {
      await flushPromises(Component, container);
      expect(getByText('The file was in the wrong format!')).not.toBeNull();
    });
  });

  it('should show the error text when dropping multiple invalid filetypes', async () => {
    const Component = (
      <Wrapper>
        <CustomDropzone
          multipleFiles={true}
          handleOnDrop={() => {}}
          fileTypes={['image/*']}
        />
      </Wrapper>
    );
    const { container, getByText, getByTestId } = render(Component);

    const file1 = createFile('pdf', 1234, 'application/pdf');
    const file2 = createFile('pdf', 2345, 'application/pdf');
    const file3 = createFile('image', 1234, 'image/jpeg');
    const data = createDtWithFiles([file1, file2, file3]);

    const node = getByTestId('dropzone');
    dispatchEvt(node, 'dragenter', data);

    await wait(async () => {
      await flushPromises(Component, container);
      expect(
        getByText('One or more of the files were in the wrong format!')
      ).not.toBeNull();
    });
  });

  it('should show the error text when dropping multiple files when multipleFiles is false', async () => {
    const Component = (
      <Wrapper>
        <CustomDropzone
          multipleFiles={false}
          handleOnDrop={() => {}}
          fileTypes={['image/*']}
        />
      </Wrapper>
    );
    const { container, getByText, getByTestId } = render(Component);

    const file1 = createFile('image', 1234, 'image/jpeg');
    const file2 = createFile('image', 2222, 'image/jpeg');
    const data = createDtWithFiles([file1, file2]);

    const node = getByTestId('dropzone');
    dispatchEvt(node, 'dragenter', data);

    await wait(async () => {
      await flushPromises(Component, container);
      expect(getByText('More than one file was added!')).not.toBeNull();
    });
  });
});
