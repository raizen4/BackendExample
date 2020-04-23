import React from 'react';
import { render } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('should render', () => {
    const { container } = render(<Loader />);
    expect(container).toMatchSnapshot();
  });

  it('should hide when show is set to false', () => {
    const { container } = render(<Loader show={false} />);
    const styles = (container.firstChild as HTMLElement).style;
    expect(styles.opacity === '0').toBeTruthy();
    expect(styles.visibility === 'hidden').toBeTruthy();
  });
});
