import React from 'react';
import Withdraw from '../Withdraw';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<Withdraw />', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<Withdraw />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onWithdraw on withdrawal', async () => {
    const onWithdraw = jest.fn(() => {});
    const { getByLabelText, getByText } = render(<Withdraw onWithdraw={onWithdraw} />);

    await wait(() => {
      fireEvent.change(getByLabelText('Amount'), { target: { value: '15000' } });
      fireEvent.click(getByText('Withdraw'));
    });

    expect(onWithdraw).toBeCalledWith(expect.objectContaining({ withdrawValue: '15000' }));
  });

  it('should validate input from user correctly', async () => {
    const { getByLabelText, getByText, asFragment } = render(<Withdraw />);

    await wait(() => {
      fireEvent.change(getByLabelText('Amount'), { target: { value: '' } });
      fireEvent.click(getByText('Withdraw'));
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
