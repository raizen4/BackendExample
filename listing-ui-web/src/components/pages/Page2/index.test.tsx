import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Page from '../Page2';

describe('Home', () => {
  it('should render', () => {
    const { container } = render(
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
