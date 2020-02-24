import React from 'react';
import WorkLock from '../WorkLock';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<WorkLock />', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<WorkLock />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onBid on bid', async () => {
    const onBid = jest.fn(() => {});
    const { getByLabelText, getByText } = render(<WorkLock onBid={onBid} />);

    await wait(() => {
      fireEvent.change(getByLabelText('ETH amount'), { target: { value: '6' } });
      fireEvent.click(getByText('Bid'));
    });

    expect(onBid).toBeCalledWith(expect.objectContaining({ bidValue: '6' }));
  });

  it('should validate input from user correctly', async () => {
    const { getByLabelText, getByText, asFragment } = render(<WorkLock />);

    await wait(() => {
      fireEvent.change(getByLabelText('ETH amount'), { target: { value: '' } });
      fireEvent.click(getByText('Bid'));
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
