import React from 'react';
import BN from 'bignumber.js';
import Web3 from 'web3';
import DivideSubStake from '../DivideSubStake';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<DivideSubStake />', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { asFragment } = render(<DivideSubStake />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onSubStakeDivide on divide', async () => {
    const onSubStakeDivide = jest.fn(() => Promise.resolve(jest.fn()));
    const subStake = {
      value: Web3.utils.toWei('300000')
    };
    const { getByLabelText, getByText, getByTestId } = render(<DivideSubStake subStake={subStake} onSubStakeDivide={onSubStakeDivide} />);

    await wait(() => {
      fireEvent.click(getByText('Divide'));
    });

    expect(getByTestId('first-substake-value').value).toBe(Web3.utils.fromWei(BN(subStake.value).div(2).toFixed()));
    expect(getByTestId('second-substake-value').value).toBe(Web3.utils.fromWei(BN(subStake.value).div(2).toFixed()));
    expect(onSubStakeDivide).toBeCalledWith({
      'firstSubstakeValue': '150000',
      'secondSubstakeValue': '150000',
      'sliderValue': 50,
      'stakeDuration': 1
    }, expect.any(Object));
  });

  it('should recalculte on fields change', async () => {
    const onSubStakeDivide = jest.fn(() => Promise.resolve(jest.fn()));
    const subStake = {
      value: Web3.utils.toWei('100000')
    };
    const { getByLabelText, getByText, getByTestId } = render(<DivideSubStake subStake={subStake} onSubStakeDivide={onSubStakeDivide} />);

    await wait(() => {
      fireEvent.change(getByTestId('first-substake-value'), { target: { value: '25000' } });
    });
    expect(getByTestId('second-substake-value').value).toBe('75000');
  });

  it('should validate fields', async () => {
    const onSubStakeDivide = jest.fn(() => Promise.resolve(jest.fn()));
    const subStake = {
      value: Web3.utils.toWei('300000')
    };
    const { asFragment, getByTestId } = render(<DivideSubStake subStake={subStake} onSubStakeDivide={onSubStakeDivide} />);

    await wait(() => {
      fireEvent.change(getByTestId('first-substake-value'), { target: { value: '1000' } });
    });
    expect(asFragment()).toMatchSnapshot();

    await wait(() => {
      fireEvent.change(getByTestId('second-substake-value'), { target: { value: '1000' } });
    });
    expect(asFragment()).toMatchSnapshot();

    await wait(() => {
      fireEvent.change(getByTestId('first-substake-value'), { target: { value: '3000000' } });
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
