import React from 'react';
import AddStake from '../AddStake';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<AddStake />', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<AddStake />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onAddStake on adding stake', async () => {
    const onAddStake = jest.fn(() => {});
    const { getByLabelText, getByText } = render(<AddStake onAddStake={onAddStake} />);

    await wait(() => {
      fireEvent.change(getByLabelText('Stake value'), { target: { value: '15000' } });
      fireEvent.change(getByLabelText('Stake duration'), { target: { value: '365' } });
      fireEvent.click(getByText('Stake'));
    });

    expect(onAddStake).toBeCalledWith(expect.objectContaining({ stakeValue: 15000, stakeDuration: 365, infiniteApproval: false }));
  });

  it('should validate input from user correctly', async () => {
    const { getByLabelText, getByText, asFragment } = render(<AddStake />);

    await wait(() => {
      fireEvent.change(getByLabelText('Stake value'), { target: { value: '1' } });
      fireEvent.change(getByLabelText('Stake duration'), { target: { value: '1' } });
      fireEvent.click(getByText('Stake'));
    });

    expect(asFragment()).toMatchSnapshot();

    await wait(() => {
      fireEvent.change(getByLabelText('Stake value'), { target: { value: '' } });
      fireEvent.change(getByLabelText('Stake duration'), { target: { value: '' } });
      fireEvent.click(getByText('Stake'));
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
