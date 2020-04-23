import React, { FC } from 'react';
import { render, wait } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';

import PricingInfo from './index';
import theme from '../../../configuration/theme';
import selectMaterialUiSelectOption from 'shared/utils/testing/selectMaterialUiDropdown';
import { IListing } from '../../../types/Listing';

type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

interface WrapperProps {
  initValues?: PartialNested<IListing>;
}

const Wrapper: FC<WrapperProps> = ({
  initValues = {
    propertyDetails: { minPrice: 0, maxPrice: 0 },
    listingDetails: {
      priceQualifier: 'GuidePrice',
      marketPrice: 0
    }
  },
  children
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Formik initialValues={initValues} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    </ThemeProvider>
  );
};

const createWrapperWithMarketPrice = (marketPrice: number) => {
  return (
    <Wrapper
      initValues={{
        propertyDetails: { minPrice: 100000, maxPrice: 120000 },
        listingDetails: {
          priceQualifier: '',
          marketPrice: marketPrice
        }
      }}
    >
      <PricingInfo />
    </Wrapper>
  );
};

const marketPriceWarningText =
  'The market price you have entered does not fall within the minumum and maximum price';

describe('PricingInfo', () => {
  describe('Min Price field', () => {
    it('should display the property min price label', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });

      expect(getByLabelText('Min Price')).not.toBeNull();
    });

    it('should display £ Min as the placeholder value for the property min price field', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Min Price');
      const input = inputNode as HTMLInputElement;

      expect(input.placeholder).toBe('£ Min');
    });
  });

  describe('Max Price field', () => {
    it('should display the property max price label', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });

      expect(getByLabelText('Max Price')).not.toBeNull();
    });

    it('should display £ Max as the placeholder value for the property max price field', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Max Price');
      const input = inputNode as HTMLInputElement;

      expect(input.placeholder).toBe('£ Max');
    });
  });

  describe('Price Qualifier field', () => {
    it('should display the property price qualifier label', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });

      expect(getByLabelText('Price Qualifier')).not.toBeNull();
    });

    it('should display "Guide Price" as the value for the price qualifier value, "GuidePrice"', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Price Qualifier');
      expect(inputNode.textContent).toBe('Guide Price');
    });

    it('should change value for the price qualifier when dropdown option is selected', async () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Price Qualifier');

      await wait(() => {
        selectMaterialUiSelectOption(
          getByLabelText('Price Qualifier'),
          'Fixed Price'
        );
      });

      expect(inputNode.textContent).toBe('Fixed Price');
    });
  });

  describe('Market Price field', () => {
    it('should display the market price label', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });

      expect(getByLabelText('Market Price')).not.toBeNull();
    });

    it('should display £ as the placeholder value for the market price selector ', () => {
      const { getByLabelText } = render(<PricingInfo />, { wrapper: Wrapper });
      const inputNode = getByLabelText('Market Price');
      const input = inputNode as HTMLInputElement;

      expect(input.placeholder).toBe('£');
    });
  });

  describe('Market price warning', () => {
    it('should be shown when the market price is above the max', () => {
      const ComponentWithMarketPriceAboveMax = createWrapperWithMarketPrice(
        140000
      );
      const { queryByText } = render(ComponentWithMarketPriceAboveMax);
      const marketPriceWarning = queryByText(marketPriceWarningText);

      expect(marketPriceWarning).not.toBe(null);
    });

    it('should be shown when the market price is below the min', () => {
      const ComponentWithMarketPriceBelowMin = createWrapperWithMarketPrice(
        90000
      );
      const { queryByText } = render(ComponentWithMarketPriceBelowMin);
      const marketPriceWarning = queryByText(marketPriceWarningText);

      expect(marketPriceWarning).not.toBe(null);
    });

    it('should not be shown when the market price is equal to the min', () => {
      const ComponentWithMarketPriceEqualToMin = createWrapperWithMarketPrice(
        100000
      );
      const { queryByText } = render(ComponentWithMarketPriceEqualToMin);
      const marketPriceWarning = queryByText(marketPriceWarningText);

      expect(marketPriceWarning).toBe(null);
    });

    it('should not be shown when the market price is equal to the max', () => {
      const ComponentWithMarketPriceEqualToMax = createWrapperWithMarketPrice(
        120000
      );
      const { queryByText } = render(ComponentWithMarketPriceEqualToMax);
      const marketPriceWarning = queryByText(marketPriceWarningText);

      expect(marketPriceWarning).toBe(null);
    });

    it('should not be shown when the market price is within the min and max', () => {
      const ComponentWithMarketPriceWithinTheRange = createWrapperWithMarketPrice(
        110000
      );
      const { queryByText } = render(ComponentWithMarketPriceWithinTheRange);
      const marketPriceWarning = queryByText(marketPriceWarningText);

      expect(marketPriceWarning).toBe(null);
    });
  });
});
