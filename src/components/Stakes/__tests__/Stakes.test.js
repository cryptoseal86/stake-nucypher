import React from 'react';
import Web3 from 'web3';
import Stakes from '../Stakes';
import SubStake from '../../../models/SubStake';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<Stakes />', () => {

  const substakes = [
    new SubStake({
      index: 0,
      firstPeriod: new Date(300 * 24 * 60 * 60 * 1000),
      lastPeriod: new Date(305 * 24 * 60 * 60 * 1000),
      value: Web3.utils.toWei('15000'),
      remainingDuration: 245
    }),
    new SubStake({
      index: 1,
      firstPeriod: new Date(1600 * 24 * 60 * 60 * 1000),
      lastPeriod: new Date(1605 * 24 * 60 * 60 * 1000),
      value: Web3.utils.toWei('15000'),
      remainingDuration: 365
    })
  ];

  it('should render correctly', () => {
    const { asFragment } = render(<Stakes substakes={substakes} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be able to toggle panels', async () => {
    const { getByTestId, asFragment } = render(<Stakes substakes={substakes} />);
    await wait(() => {
      fireEvent.click(getByTestId('divide-button-0'));
    });
    expect(asFragment()).toMatchSnapshot();

    await wait(() => {
      fireEvent.click(getByTestId('prolong-button-0'));
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('should not show prolong button for expired stakes', () => {
    substakes.push(new SubStake({
      index: 0,
      firstPeriod: new Date(300 * 24 * 60 * 60 * 1000),
      lastPeriod: new Date(305 * 24 * 60 * 60 * 1000),
      value: Web3.utils.toWei('15000'),
      remainingDuration: 0
    }));
    const { getByTestId, asFragment } = render(<Stakes substakes={substakes} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
