import React from 'react';
import Web3 from 'web3';
import Timeline from '../Timeline';
import { render, fireEvent, wait } from '@testing-library/react'

describe('<Timeline />', () => {
  const timelinePoints = [
    {
      date: '1589459576',
      label: 'Bidding phase'
    },
    {
      date: '1589459576',
      label: 'Bids cancelation window'
    },
    {
      date: '1589459576',
      label: 'Claiming tokens window'
    },
    {
      textPoint: 'Stake creation',
      label: 'Running node'
    },
    {
      textPoint: 'Ether claimed'
    }
  ];

  it('should render correctly', () => {
    const { asFragment } = render(<Timeline timelinePoints={timelinePoints} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
