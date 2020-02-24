import React from 'react';
import HistoryDashboard from '../HistoryDashboard';
import { render, fireEvent, wait } from '@testing-library/react';
jest.mock('../../../web3Initializer');

describe('<HistoryDashboard />', () => {

  it('should render correctly', async () => {
    await wait(() => {
      const { asFragment } = render(<HistoryDashboard />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

});
