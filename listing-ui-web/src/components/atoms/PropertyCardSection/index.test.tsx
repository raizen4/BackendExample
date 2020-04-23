import React from 'react';
import { render } from '@testing-library/react';
import PropertyCardSection from '.';

const TestComponent = () => {
  return (
    <PropertyCardSection
      title="test title"
      descriptionTitle="description title"
      descriptionBody="test description body"
    >
      <div>Child components!</div>
    </PropertyCardSection>
  );
};

describe('property card section', () => {
  const { getByText } = render(<TestComponent />);
  it('should display description title', () => {
    expect(() => getByText('description title')).toBeDefined();
  });
  it('should display description body', () => {
    expect(() => getByText('test description body')).toBeDefined();
  });
  it('should render the title', () => {
    expect(() => getByText('test title')).toBeDefined();
  });
  it('should render the child component', () => {
    expect(() => getByText('Child components!')).toBeDefined();
  });
});
