import React from 'react';
import WithdrawDashboard from '../WithdrawDashboard';
import { render, wait } from '@testing-library/react';
jest.mock('../../../web3Initializer');

describe('<WithdrawDashboard />', () => {

  it('should render correctly', async () => {
    await wait(() => {
      const { asFragment } = render(<WithdrawDashboard />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

});
