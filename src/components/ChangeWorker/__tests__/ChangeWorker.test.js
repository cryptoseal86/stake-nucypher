import React from 'react';
import ChangeWorker from '../ChangeWorker';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<ChangeWorker />', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<ChangeWorker />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should trigger onChangeWorker on providing worker', async () => {
    const onChangeWorker = jest.fn(() => {});
    const { getByLabelText, getByText } = render(<ChangeWorker onChangeWorker={onChangeWorker} />);

    await wait(() => {
      fireEvent.change(getByLabelText('Worker'), { target: { value: '0x6453ee19CDa53491Be3772Ff33B499b3A3e47886' } });
      fireEvent.click(getByText('Set worker'));
    });

    expect(onChangeWorker).toBeCalledWith(expect.objectContaining({ workerAddress: '0x6453ee19CDa53491Be3772Ff33B499b3A3e47886' }));
  });

  it('should validate input from user correctly', async () => {
    const { getByLabelText, getByText, asFragment } = render(<ChangeWorker />);

    await wait(() => {
      fireEvent.change(getByLabelText('Worker'), { target: { value: '0x1111' } });
      fireEvent.click(getByText('Set worker'));
    });

    expect(asFragment()).toMatchSnapshot();

    await wait(() => {
      fireEvent.change(getByLabelText('Worker'), { target: { value: '' } });
      fireEvent.click(getByText('Set worker'));
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
