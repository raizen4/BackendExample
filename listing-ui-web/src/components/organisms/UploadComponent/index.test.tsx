import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  wait,
  waitForElement,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import { Formik } from 'formik';
import theme from '../../../configuration/theme';
import {
  dispatchEvt,
  createFile,
  createDtWithFiles
} from '../../../utils/fileHelpers';
import UploadComponent from './index';
import { PostFile } from '../../../services/FileService';
import { mocked } from 'ts-jest/utils';
import { IFile } from '../../../types/File';
import { ListingAsset } from '../CreateListingForm/types';
import { PatchImagesForListing } from '../../../services/ListingService';

jest.mock('../../../services/FileService');
jest.mock('../../../services/ListingService');

function delay(ms: number): Promise<IFile | null> {
  return new Promise(resolve =>
    setTimeout(() => resolve({ location: 'uri' }), ms)
  );
}

const mockedPostFile = mocked(PostFile, true);
mockedPostFile.mockResolvedValue({ location: 'uri' });

const mockedPatchFile = mocked(PatchImagesForListing, true);
mockedPatchFile.mockResolvedValue([
  {
    uri: '/path/to/img1',
    isPrimary: false,
    caption: '',
    name: 'test.jpg',
    fileSize: 1243,
    fileType: 'images/jpg',
    id: 'test.jpg1243'
  }
]);

const mockedWindow = mocked(window, true);
mockedWindow.URL.createObjectURL.mockReturnValue('path/to/img');

const Wrapper: React.FC<{
  initVals?: {
    listingUri: string;
    listingDetails: {
      images: ListingAsset[];
    };
  };
}> = ({
  children,
  initVals = {
    listingUri: 'abcdef1234',
    listingDetails: { images: [] }
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

const uploadedImageData = [
  {
    uri: '/path/to/img1',
    isPrimary: false,
    caption: '',
    name: 'test.jpg',
    fileSize: 1243,
    isUploading: false,
    isUploaded: true,
    id: 'test.jpg1243',
    error: false
  },
  {
    uri: '/path/to/img2',
    isPrimary: false,
    caption: '',
    name: 'test2.jpg',
    fileSize: 12434,
    isUploading: false,
    isUploaded: true,
    id: 'test2.jpg12434',
    error: false
  },
  {
    uri: '/path/to/img3',
    isPrimary: false,
    caption: '',
    name: 'test3.jpg',
    fileSize: 124345,
    isUploading: false,
    isUploaded: true,
    id: 'test3.jpg124345',
    error: false
  }
] as ListingAsset[];

const ComponentWith3Images = (
  <Wrapper
    initVals={{
      listingUri: 'somewhere.com',
      listingDetails: {
        images: uploadedImageData
      }
    }}
  >
    <UploadComponent
      isImageUpload
      name="IMAGES"
      multipleFiles
      fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
      fieldName="listingDetails.images"
      showPreview
    />
  </Wrapper>
);

const Component = (
  <Wrapper>
    <UploadComponent
      isImageUpload
      name="IMAGES"
      multipleFiles
      fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
      fieldName="listingDetails.images"
      showPreview
    />
  </Wrapper>
);

const ComponentSingleFiles = (
  <Wrapper
    initVals={{
      listingUri: 'somewhere.com',
      listingDetails: {
        images: [
          {
            uri: '/path/to/img3',
            isPrimary: false,
            caption: '',
            name: 'test3.jpg',
            fileSize: 124345,
            isUploading: false,
            isUploaded: true,
            id: 'test3.jpg124345',
            error: false
          }
        ] as ListingAsset[]
      }
    }}
  >
    <UploadComponent
      isImageUpload={false}
      name="FILES"
      multipleFiles={false}
      fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
      fieldName="listingDetails.images"
      showPreview
    />
  </Wrapper>
);

describe('UploadComponent', () => {
  afterEach(cleanup);

  it('should render the upload component', () => {
    const { container } = render(
      <UploadComponent
        isImageUpload
        name="IMAGES"
        multipleFiles
        fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
        fieldName="listingDetails.images"
        showPreview
      />,
      { wrapper: Wrapper }
    );

    expect(container).not.toBeNull();
  });

  it('should not render the upload component with invalid field name', () => {
    const { queryByTestId } = render(
      <UploadComponent
        isImageUpload
        name="IMAGES"
        multipleFiles
        fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
        fieldName="listingDetails.INVALID_PATH"
        showPreview
      />,
      { wrapper: Wrapper }
    );

    expect(queryByTestId('dropzone')).toBeNull();
  });

  describe('CurrentAsset', () => {
    it('should display the placeholder when images is empty', () => {
      const { getByAltText } = render(Component);

      expect(getByAltText('Placeholder')).not.toBeNull();
    });

    it('should not display the placeholder when showPreview is false', () => {
      const { queryByAltText } = render(
        <UploadComponent
          isImageUpload={true}
          name="IMAGES"
          multipleFiles={true}
          fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
          fieldName="listingDetails.images"
          showPreview={false}
        />,
        { wrapper: Wrapper }
      );

      expect(queryByAltText('Placeholder')).toBeNull();
    });

    it('should display the first image as the selected image when a number of images are added', async () => {
      const { getByAltText, getByTestId } = render(Component);

      const dropzone = getByTestId('dropzone');

      const file1 = createFile('file1', 1234, 'image/jpeg');
      const file2 = createFile('file2', 2543, 'image/png');
      const data = createDtWithFiles([file1, file2]);

      dispatchEvt(dropzone, 'drop', data);

      await Promise.resolve();

      await wait(() => {
        expect(getByAltText('file1')).not.toBeNull();
      });
    });

    it('should change to the correct selected image when the 2nd thumbnail is clicked', async () => {
      const { getByAltText, getByTestId } = render(ComponentWith3Images);

      const secondThumb = getByTestId('thumb-button-1');
      fireEvent.click(secondThumb);

      await wait(() => {
        expect(getByAltText('test2.jpg')).not.toBeNull();
      });
    });

    it('should display the correct position when the 2nd thumbnail is clicked', async () => {
      const { getByText, getByTestId } = render(ComponentWith3Images);

      const secondThumb = getByTestId('thumb-button-1');
      fireEvent.click(secondThumb);

      await wait(() => {
        expect(getByText('Pos.').nextSibling?.textContent ?? false).toBe('1');
      });
    });

    it('should set the caption to focused when a new selected image is chosen', async () => {
      const { getByLabelText, getByTestId } = render(ComponentWith3Images);

      const secondThumb = getByTestId('thumb-button-1');
      fireEvent.click(secondThumb);

      await wait(() => {
        const input = getByLabelText('new name goes here') as HTMLInputElement;
        expect(document.activeElement).toEqual(input);
      });
    });
  });

  describe('Thumbs', () => {
    it('should not display any thumbnails when images is empty', () => {
      const { queryAllByTestId } = render(Component);

      expect(queryAllByTestId('thumb-image')).toHaveLength(0);
    });

    it('should display 3 thumbnails when 3 images are added', async () => {
      const { queryAllByTestId, getByTestId } = render(Component);

      const dropzone = getByTestId('dropzone');

      const file1 = createFile('file1', 1234, 'image/jpeg');
      const file2 = createFile('file2', 2543, 'image/png');
      const file3 = createFile('file3', 2543, 'image/jpg');

      const data = createDtWithFiles([file1, file2, file3]);
      dispatchEvt(dropzone, 'drop', data);

      await wait(async () => {
        expect(queryAllByTestId('thumb-image')).toHaveLength(3);
      });
    });

    it('should display 2 deselect buttons when two thumbnails are group selected', async () => {
      const { getAllByText, getAllByLabelText } = render(ComponentWith3Images);

      const buttons = getAllByLabelText('group select');
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);

      await wait(() => {
        expect(getAllByText('Deselect')).toHaveLength(2);
      });
    });

    it('should deselect a group selected image when clicked', async () => {
      const { queryAllByText, getAllByLabelText } = render(
        ComponentWith3Images
      );

      const buttons = getAllByLabelText('group select');

      fireEvent.click(buttons[0]);

      await wait(() => {
        fireEvent.click(buttons[0]);
        expect(queryAllByText('Deselect')).toHaveLength(0);
      });
    });

    it('should display 3 thumbnails when 2 images are added then 1 more is added', async () => {
      const { queryAllByTestId, getByTestId } = render(Component);

      const dropzone = getByTestId('dropzone');
      const file1 = createFile('file1', 1234, 'image/jpeg');
      const file2 = createFile('file2', 2543, 'image/png');
      const file3 = createFile('file3', 2543, 'image/jpg');
      const firstData = createDtWithFiles([file1, file2]);

      dispatchEvt(dropzone, 'drop', firstData);
      await wait(async () => {
        expect(queryAllByTestId('thumb-image')).toHaveLength(2);
      });
      const secondData = createDtWithFiles([file3]);
      dispatchEvt(dropzone, 'drop', secondData);
      await wait(async () => {
        expect(queryAllByTestId('thumb-image')).toHaveLength(3);
      });
    });

    it('should display 1 thumbnail when 1 image is added with multiple files turned off with one already added', async () => {
      const { queryAllByTestId, getByTestId } = render(ComponentSingleFiles);
      const dropzone = getByTestId('dropzone');
      const file1 = createFile('file1', 1234, 'image/jpeg');
      const data = createDtWithFiles([file1]);
      dispatchEvt(dropzone, 'drop', data);
      await wait(async () => {
        expect(queryAllByTestId('thumb-image')).toHaveLength(1);
      });
    });

    it('should display 6 thumbnails when 6 images are added', async () => {
      const { queryAllByTestId, getByTestId } = render(Component);
      const dropzone = getByTestId('dropzone');
      const file1 = createFile('file1', 1234, 'image/jpeg');
      const file2 = createFile('file2', 2543, 'image/png');
      const file3 = createFile('file3', 9876, 'image/jpg');
      const file4 = createFile('file4', 3579, 'image/jpg');
      const file5 = createFile('file5', 8642, 'image/jpg');
      const file6 = createFile('file6', 9786, 'image/jpg');
      const data = createDtWithFiles([
        file1,
        file2,
        file3,
        file4,
        file5,
        file6
      ]);
      dispatchEvt(dropzone, 'drop', data);
      await wait(async () => {
        expect(queryAllByTestId('thumb-image')).toHaveLength(6);
      });
    });
  });

  describe('Primary', () => {
    it('should display the primary icon in the thumbnails when the current image is set to be the primary image', async () => {
      const { getByTestId } = render(ComponentWith3Images);

      const button = getByTestId('primary-button');
      fireEvent.click(button);

      await wait(() => {
        expect(getByTestId('isprimary-icon')).not.toBeNull();
        expect(getByTestId('primary-star')).not.toBeNull();
      });
    });

    it('should not display the primary icon in the thumbnails when the current image is set to not be the primary image', async () => {
      const { queryByTestId, getByTestId } = render(ComponentWith3Images);

      const button = getByTestId('primary-button');
      fireEvent.click(button);

      await wait(() => {
        fireEvent.click(button);
        expect(queryByTestId('isprimary-icon')).toBeNull();
        expect(queryByTestId('primary-star')).toBeNull();
      });
    });

    it('should only have 1 primary image when a second image is set to be the primary', async () => {
      const { getAllByTestId, getByTestId } = render(ComponentWith3Images);

      const button = getByTestId('primary-button');
      fireEvent.click(button);

      await wait(() => {
        const secondThumb = getByTestId('thumb-button-1');
        fireEvent.click(secondThumb);
        const button = getByTestId('primary-button');
        fireEvent.click(button);
      });

      await wait(() => {
        expect(getAllByTestId('isprimary-icon')).toHaveLength(1);
        expect(getAllByTestId('primary-star')).toHaveLength(1);
      });
    });
  });

  describe('Uploading', () => {
    it('should call the file service once when an image is dropped', async () => {
      const { getByTestId } = render(Component);

      const dropzone = getByTestId('dropzone');

      const file1 = createFile('file1', 1234, 'image/jpeg');

      const data = createDtWithFiles([file1]);

      await wait(async () => {
        dispatchEvt(dropzone, 'drop', data);
      });

      expect(PostFile).toHaveBeenCalledTimes(1);
    });

    it('should call the file service with the correct arguments when an image is dropped', async () => {
      const { getByTestId } = render(Component);

      const dropzone = getByTestId('dropzone');

      const file1 = createFile('file1', 1234, 'image/jpeg');

      const data = createDtWithFiles([file1]);

      await wait(async () => {
        dispatchEvt(dropzone, 'drop', data);
      });

      const formData = new FormData();

      formData.append('details', JSON.stringify({}));
      formData.append('file', file1);

      const abortController = new AbortController();

      expect(PostFile).toHaveBeenCalledWith(formData, {
        signal: abortController.signal
      });
      abortController.abort();
    });

    it('should show then hide the spinner for images that have been uploaded', async () => {
      mockedPostFile.mockReturnValueOnce(delay(1000));

      const { getByTestId, queryByTestId } = render(Component);

      const dropzone = getByTestId('dropzone');

      const file1 = createFile('file2', 1235, 'image/jpeg');

      const data = createDtWithFiles([file1]);

      dispatchEvt(dropzone, 'drop', data);

      await waitForElement(() => queryByTestId('thumb-spinner'));

      await waitForElementToBeRemoved(() => queryByTestId('thumb-spinner'));
    });
  });
});
