import React from 'react';
import MergeSubStake from '../MergeSubStake';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<MergeSubStake />', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<MergeSubStake />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onSubStakeMerge on merge', async () => {
    const onSubStakeMerge = jest.fn(() => {});
    const { getByLabelText, getByText } = render(<MergeSubStake onSubStakeMerge={onSubStakeMerge} />);

    await wait(() => {
      fireEvent.change(getByLabelText('Merge with #'), { target: { value: '0' } });
      fireEvent.click(getByText('Merge'));
    });

    expect(onSubStakeMerge).toBeCalledWith(expect.objectContaining({ mergeIdValue: 0 }));
  });
});
