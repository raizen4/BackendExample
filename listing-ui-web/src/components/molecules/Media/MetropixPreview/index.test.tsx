import React, { FC } from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { Formik } from 'formik';
import { CreateListing } from '../../../organisms/CreateListingForm/types';
import Metropix from '.';
import { mocked } from 'ts-jest/utils';
import { GetExternalImageUrl } from '../../../../services/AssetService';
import { resetMetropixStore } from '../../../../context/metropixStore';

type ListingDetailsValues = Pick<CreateListing, 'listingDetails'>;
type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

interface ITestComponentProps {
  initialValues?: PartialNested<ListingDetailsValues>;
}

const initValues: PartialNested<ListingDetailsValues> = {
  listingDetails: {
    floorPlan: {
      code: ''
    }
  }
};

const TestComponent: FC<ITestComponentProps> = ({
  initialValues = initValues
}) => (
  <Formik initialValues={initialValues} onSubmit={() => {}}>
    <Metropix />
  </Formik>
);

jest.mock('../../../../services/AssetService.ts');

const testImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';

describe('Metropix', () => {
  beforeEach(() => {
    mocked(GetExternalImageUrl).mockReturnValue(testImg);
  });

  afterEach(() => {
    cleanup();
    resetMetropixStore();
  });

  it('should not render an image if no code provided', () => {
    const { queryByTestId } = render(<TestComponent />);
    expect(GetExternalImageUrl).not.toHaveBeenCalled();
    expect(queryByTestId('metropix-image')).toBeNull();
  });

  it('should load the image from initial values', async () => {
    const { getByTestId } = render(
      <TestComponent
        initialValues={{
          listingDetails: {
            floorPlan: {
              code: '1'
            }
          }
        }}
      />
    );
    expect(getByTestId('metropix-image')).toBeTruthy();
  });
});
