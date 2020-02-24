import React from 'react';
import Loading from '../Loading';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<Loading />', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<Loading />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render size property', () => {
    const { asFragment } = render(<Loading size={60} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
