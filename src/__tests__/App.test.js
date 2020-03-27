import React from 'react';
import App from '../App';
import { render, fireEvent, wait } from '@testing-library/react';
jest.mock('../web3Initializer');

describe('<App />', () => {

  const originalDateNow = Date.now;
  const originalDateGetTime = Date.prototype.getTime;
  beforeAll(() => {
    Date.now = () => 1582581721708;
    Date.prototype.getTime = () => 1582581721708;
  });

  afterAll(() => {
    Date.now = originalDate;
    Date.prototype.getTime = originalDateGetTime;
  });

  it('should render correctly', async () => {
    await wait(() => {
      const { asFragment } = render(<App />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('should be able to switch tab', async () => {
    const { getByTestId, asFragment } = render(<App />);
    fireEvent.click(getByTestId('withdraw-switch-button'));
    expect(asFragment()).toMatchSnapshot();
  });
});
