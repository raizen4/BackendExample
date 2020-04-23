import React, { FC } from 'react';
import { render, cleanup, fireEvent, within } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { createListingSchema } from '../../../schemas/CreateListingSchema';

import theme from '../../../configuration/theme';
import userEvent from '@testing-library/user-event';
import { CreateListing } from '../../organisms/CreateListingForm/types';

import EnergyRating from './index';

afterEach(cleanup);

type PropertyDetailsValues = Pick<CreateListing, 'propertyDetails'>;
type PartialNested<T> = {
  [P in keyof T]?: PartialNested<T[P]>;
};

const Wrapper: FC<{
  initVals: PartialNested<PropertyDetailsValues>;
}> = ({ children, initVals }) => {
  const schema = createListingSchema;

  return (
    <ThemeProvider theme={theme}>
      <Formik
        validationSchema={schema}
        initialValues={initVals}
        enableReinitialize
        onSubmit={() => {}}
      >
        <Form>{children}</Form>
      </Formik>
    </ThemeProvider>
  );
};

interface TestComponentProps {
  reportType: string;
  status?: string;
  currentEer?: number;
  potentialEer?: number;
  currentEir?: number;
  potentialEir?: number;
}

const TestComponent: FC<TestComponentProps> = ({
  reportType = '',
  status = 'None',
  currentEer = 0,
  potentialEer = 0,
  currentEir = 0,
  potentialEir = 0
}) => {
  const initVals = {
    propertyDetails: {
      epc: {
        status: status,
        isValid: false,
        eer: {
          current: currentEer,
          potential: potentialEer
        },
        eir: {
          current: currentEir,
          potential: potentialEir
        }
      },
      homeReport: {
        status: status,
        eer: {
          current: currentEer,
          potential: potentialEer
        },
        eir: {
          current: currentEir,
          potential: potentialEir
        }
      }
    }
  };

  return (
    <Wrapper initVals={initVals}>
      <EnergyRating reportType={reportType} />
    </Wrapper>
  );
};

describe('EnergyRating', () => {
  it('should should not display if incompatible reportType', () => {
    const { queryByText } = render(
      <TestComponent reportType="invalid-report-type" />
    );
    const label1 = queryByText('Energy efficiency rating');
    const label2 = queryByText('Environmental impact rating');
    expect(label1).toBe(null);
    expect(label2).toBe(null);
  });
});

describe('EnergyRating - EPC', () => {
  describe('Energy Efficiency Rating', () => {
    it('should should warning when potential is less than current', () => {
      const { queryByText } = render(
        <TestComponent
          reportType="epc"
          status="Received"
          currentEer={50}
          potentialEer={20}
        />
      );
      const marketPriceWarning = queryByText(
        'Current rating should not be greater than potential rating'
      );
      expect(marketPriceWarning).not.toBe(null);
    });

    describe('Current input field', () => {
      it('should display a validation error when the rating is less than 0', async () => {
        const { getByText, findByText } = render(
          React.cloneElement(<TestComponent reportType="epc" />, {
            status: 'Received'
          })
        );
        const section = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );
        const current = section.getByLabelText('Current') as HTMLInputElement;
        const potential = section.getByLabelText(
          'Potential'
        ) as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '-1' }
        });
        userEvent.click(potential);

        expect(
          await findByText(/Current rating must be greater than or equal to 0/)
        ).not.toBeNull();
      });

      it('should display a validation error when the rating is greater than 100', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="epc" status="Received" />
        );

        const input = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );

        const current = input.getByLabelText('Current') as HTMLInputElement;
        const potential = input.getByLabelText('Potential') as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '999' }
        });
        userEvent.click(potential);

        expect(
          await findByText('Current rating must be less than or equal to 100')
        ).not.toBeNull();
      });
    });

    describe('Potential input field', () => {
      it('should display a validation error when the rating is less than 0', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="epc" status="Received" />
        );

        const input = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );

        const potential = input.getByLabelText('Potential') as HTMLInputElement;
        const current = input.getByLabelText('Current') as HTMLInputElement;

        potential.focus();
        fireEvent.change(potential, {
          target: { value: '-1' }
        });
        current.focus();

        expect(
          await findByText(
            'Potential rating must be greater than or equal to 0'
          )
        ).not.toBeNull();
      });
    });

    it('should display a validation error when the rating is greater than 100', async () => {
      const { getByText, findByText } = render(
        <TestComponent reportType="epc" status="Received" />
      );

      const input = within(
        getByText('Energy efficiency rating').parentElement
          ?.parentElement as HTMLElement
      );

      const potential = input.getByLabelText('Potential') as HTMLInputElement;
      const current = input.getByLabelText('Current') as HTMLInputElement;

      potential.focus();
      fireEvent.change(potential, {
        target: { value: '999' }
      });
      userEvent.click(current);

      expect(
        await findByText('Potential rating must be less than or equal to 100')
      ).not.toBeNull();
    });
  });

  describe('Environmental impact rating', () => {
    it('should should warning when potential is less than current', () => {
      const { queryByText } = render(
        <TestComponent
          reportType="epc"
          status="Received"
          currentEir={50}
          potentialEir={20}
        />
      );
      const marketPriceWarning = queryByText(
        'Current rating should not be greater than potential rating'
      );
      expect(marketPriceWarning).not.toBe(null);
    });

    describe('Current Rating', () => {
      it('should display a validation error when the rating is less than 0', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="epc" status="Received" />
        );

        const input = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );
        const current = input.getByLabelText('Current') as HTMLInputElement;
        const potential = input.getByLabelText('Potential') as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '-1' }
        });
        userEvent.click(potential);

        expect(
          await findByText(/Current rating must be greater than or equal to 0/i)
        ).not.toBeNull();
      });

      it('should display a validation error when the rating is greater than 100', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="epc" status="Received" />
        );
        const section = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );
        const current = section.getByLabelText('Current') as HTMLInputElement;
        const potential = section.getByLabelText(
          'Potential'
        ) as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '999' }
        });
        userEvent.click(potential);

        expect(
          await findByText(/Current rating must be less than or equal to 100/i)
        ).not.toBeNull();
      });

      describe('Potential Rating', () => {
        it('should display a validation error when the rating is less than 0', async () => {
          const { getByText, findByText } = render(
            <TestComponent reportType="epc" status="Received" />
          );
          const section = within(
            getByText('Energy efficiency rating').parentElement
              ?.parentElement as HTMLElement
          );
          const current = section.getByLabelText('Current') as HTMLInputElement;
          const potential = section.getByLabelText(
            'Potential'
          ) as HTMLInputElement;

          potential.focus();
          fireEvent.change(potential, {
            target: { value: '-1' }
          });
          userEvent.click(current);

          expect(
            await findByText(
              'Potential rating must be greater than or equal to 0'
            )
          ).not.toBeNull();
        });

        it('should display a validation error when the rating is greater than 100', async () => {
          const { getByText, findByText } = render(
            <TestComponent reportType="epc" status="Received" />
          );
          const section = within(
            getByText('Energy efficiency rating').parentElement
              ?.parentElement as HTMLElement
          );
          const current = section.getByLabelText('Current') as HTMLInputElement;
          const potential = section.getByLabelText(
            'Potential'
          ) as HTMLInputElement;

          potential.focus();
          fireEvent.change(potential, {
            target: { value: '999' }
          });
          userEvent.click(current);

          expect(
            await findByText(
              'Potential rating must be less than or equal to 100'
            )
          ).not.toBeNull();
        });
      });
    });
  });
});

describe('EnergyRating - Home Report', () => {
  describe('Energy Efficiency Rating', () => {
    it('should should warning when potential is less than current', () => {
      const { queryByText } = render(
        <TestComponent
          reportType="homeReport"
          status="Received"
          currentEer={50}
          potentialEer={20}
        />
      );
      const marketPriceWarning = queryByText(
        'Current rating should not be greater than potential rating'
      );
      expect(marketPriceWarning).not.toBe(null);
    });

    describe('Current input field', () => {
      it('should display a validation error when the rating is less than 0', async () => {
        const { getByText, findByText } = render(
          React.cloneElement(<TestComponent reportType="epc" />, {
            status: 'Received'
          })
        );
        const section = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );
        const current = section.getByLabelText('Current') as HTMLInputElement;
        const potential = section.getByLabelText(
          'Potential'
        ) as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '-1' }
        });
        userEvent.click(potential);

        expect(
          await findByText(/Current rating must be greater than or equal to 0/)
        ).not.toBeNull();
      });

      it('should display a validation error when the rating is greater than 100', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="homeReport" status="Received" />
        );

        const input = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );

        const current = input.getByLabelText('Current') as HTMLInputElement;
        const potential = input.getByLabelText('Potential') as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '999' }
        });
        userEvent.click(potential);

        expect(
          await findByText('Current rating must be less than or equal to 100')
        ).not.toBeNull();
      });
    });

    describe('Potential input field', () => {
      it('should display a validation error when the rating is less than 0', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="homeReport" status="Received" />
        );

        const input = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );

        const potential = input.getByLabelText('Potential') as HTMLInputElement;
        const current = input.getByLabelText('Current') as HTMLInputElement;

        potential.focus();
        fireEvent.change(potential, {
          target: { value: '-1' }
        });
        current.focus();

        expect(
          await findByText(
            'Potential rating must be greater than or equal to 0'
          )
        ).not.toBeNull();
      });
    });

    it('should display a validation error when the rating is greater than 100', async () => {
      const { getByText, findByText } = render(
        <TestComponent reportType="homeReport" status="Received" />
      );

      const input = within(
        getByText('Energy efficiency rating').parentElement
          ?.parentElement as HTMLElement
      );

      const potential = input.getByLabelText('Potential') as HTMLInputElement;
      const current = input.getByLabelText('Current') as HTMLInputElement;

      potential.focus();
      fireEvent.change(potential, {
        target: { value: '999' }
      });
      userEvent.click(current);

      expect(
        await findByText('Potential rating must be less than or equal to 100')
      ).not.toBeNull();
    });
  });

  describe('Environmental impact rating', () => {
    it('should should warning when potential is less than current', () => {
      const { queryByText } = render(
        <TestComponent
          reportType="homeReport"
          status="Received"
          currentEir={50}
          potentialEir={20}
        />
      );
      const marketPriceWarning = queryByText(
        'Current rating should not be greater than potential rating'
      );
      expect(marketPriceWarning).not.toBe(null);
    });

    describe('Current Rating', () => {
      it('should display a validation error when the rating is less than 0', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="homeReport" status="Received" />
        );

        const input = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );
        const current = input.getByLabelText('Current') as HTMLInputElement;
        const potential = input.getByLabelText('Potential') as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '-1' }
        });
        userEvent.click(potential);

        expect(
          await findByText(/Current rating must be greater than or equal to 0/i)
        ).not.toBeNull();
      });

      it('should display a validation error when the rating is greater than 100', async () => {
        const { getByText, findByText } = render(
          <TestComponent reportType="homeReport" status="Received" />
        );
        const section = within(
          getByText('Energy efficiency rating').parentElement
            ?.parentElement as HTMLElement
        );
        const current = section.getByLabelText('Current') as HTMLInputElement;
        const potential = section.getByLabelText(
          'Potential'
        ) as HTMLInputElement;

        current.focus();
        fireEvent.change(current, {
          target: { value: '999' }
        });
        userEvent.click(potential);

        expect(
          await findByText(/Current rating must be less than or equal to 100/i)
        ).not.toBeNull();
      });

      describe('Potential Rating', () => {
        it('should display a validation error when the rating is less than 0', async () => {
          const { getByText, findByText } = render(
            <TestComponent reportType="homeReport" status="Received" />
          );
          const section = within(
            getByText('Energy efficiency rating').parentElement
              ?.parentElement as HTMLElement
          );
          const current = section.getByLabelText('Current') as HTMLInputElement;
          const potential = section.getByLabelText(
            'Potential'
          ) as HTMLInputElement;

          potential.focus();
          fireEvent.change(potential, {
            target: { value: '-1' }
          });
          userEvent.click(current);

          expect(
            await findByText(
              'Potential rating must be greater than or equal to 0'
            )
          ).not.toBeNull();
        });

        it('should display a validation error when the rating is greater than 100', async () => {
          const { getByText, findByText } = render(
            <TestComponent reportType="homeReport" status="Received" />
          );
          const section = within(
            getByText('Energy efficiency rating').parentElement
              ?.parentElement as HTMLElement
          );
          const current = section.getByLabelText('Current') as HTMLInputElement;
          const potential = section.getByLabelText(
            'Potential'
          ) as HTMLInputElement;

          potential.focus();
          fireEvent.change(potential, {
            target: { value: '999' }
          });
          userEvent.click(current);

          expect(
            await findByText(
              'Potential rating must be less than or equal to 100'
            )
          ).not.toBeNull();
        });
      });
    });
  });
});
