import React from 'react';
import StakerDashboard from '../StakerDashboard';
import { render, fireEvent, wait } from '@testing-library/react';
import Web3Initilizer from '../../../web3Initializer';
jest.mock('../../../web3Initializer');

describe('<StakerDashboard />', () => {

  const originalDate = Date.now;
  let escrowContract;
  beforeAll(() => {
    Date.now = () => 1582581721708;
    escrowContract = Web3Initilizer.getContractInstance();
  });

  afterAll(() => {
    Date.now = originalDate;
    jest.restoreMocks();
  });

  it('should render correctly', async () => {
    await wait(() => {
      const { asFragment } = render(<StakerDashboard />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('should call contract method on setting restake', async () => {
    await wait(() => {
      const { getByTestId } = render(<StakerDashboard />);
      fireEvent.click(getByTestId('restaking-toggle'));
    });
    expect(escrowContract.methods.setReStake).toBeCalled();
  });

  it('should call contract method on setting wind down', async () => {
    await wait(() => {
      const { getByTestId } = render(<StakerDashboard />);
      fireEvent.click(getByTestId('winddown-toggle'));
    });
    expect(escrowContract.methods.setWindDown).toBeCalled();
  });

  it('should show modal on add stake button click', async () => {
    await wait(() => {
      const { getByText, asFragment } = render(<StakerDashboard />);
      fireEvent.click(getByText('Add stake'));
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('should show modal on set worker button click', async () => {
    await wait(() => {
      const { getByText, asFragment } = render(<StakerDashboard />);
      fireEvent.click(getByText('Change worker'));
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('should call contract method on detach worker', async () => {
    await wait(() => {
      const { getByText } = render(<StakerDashboard />);
      fireEvent.click(getByText('Detach worker'));
    });
    expect(escrowContract.methods.setWorker).toBeCalled();
  });
});
