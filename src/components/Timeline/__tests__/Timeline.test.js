import React from 'react';
import Timeline from '../Timeline';
import { render } from '@testing-library/react'

describe('<Timeline />', () => {
  const timelinePoints = [
    {
      date: '1589459576',
      label: 'Escrow phase'
    },
    {
      date: '1589459576',
      label: 'Escrow cancellation window'
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
