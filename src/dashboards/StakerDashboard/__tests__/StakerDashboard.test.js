import React from 'react';
import StakerDashboard from '../StakerDashboard';
import { render, fireEvent, wait } from '@testing-library/react';
jest.mock('../../../web3Initializer');

describe('<StakerDashboard />', () => {

  const originalDate = Date.now;
  beforeAll(() => {
    Date.now = () => 1582581721708;
  });

  afterAll(() => {
    Date.now = originalDate;
  });

  it('should render correctly', async () => {
    await wait(() => {
      const { asFragment } = render(<StakerDashboard />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

});
