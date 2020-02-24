import React from 'react';
import ProlongSubStake from '../ProlongSubStake';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<ProlongSubStake />', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<ProlongSubStake />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onSubStakeProlong on prolongation', async () => {
    const onSubStakeProlong = jest.fn(() => {});
    const { getByLabelText, getByText } = render(<ProlongSubStake onSubStakeProlong={onSubStakeProlong} />);

    await wait(() => {
      fireEvent.change(getByLabelText('Extend for'), { target: { value: '21' } });
      fireEvent.click(getByText('Prolong'));
    });

    expect(onSubStakeProlong).toBeCalledWith(expect.objectContaining({ prolongDurationValue: 21 }));
  });

  it('should validate input from user correctly', async () => {
    const { getByLabelText, getByText, asFragment } = render(<ProlongSubStake />);

    await wait(() => {
      fireEvent.change(getByLabelText('Extend for'), { target: { value: '0' } });
      fireEvent.click(getByText('Prolong'));
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
