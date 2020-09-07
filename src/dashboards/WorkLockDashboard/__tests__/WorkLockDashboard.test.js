import React from 'react';
import WorkLockDashboard from '../WorkLockDashboard';
import { render, wait } from '@testing-library/react';
jest.mock('../../../web3Initializer');

describe('<WorkLockDashboard />', () => {

  it('should render correctly', async () => {
    await wait(() => {
      const { asFragment } = render(<WorkLockDashboard />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

});
