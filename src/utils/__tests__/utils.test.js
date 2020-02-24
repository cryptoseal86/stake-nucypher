import * as utils from '../utils';
import BN from 'bignumber.js';

describe('Utils', () => {
  const originalDate = Date.now;

  beforeAll(() => {
    Date.now = () => new Date('2020-02-14T10:20:30Z').getTime();
  });

  afterAll(() => {
    Date.now = originalDate;
  });

  it('shortenHex', () => {
    expect(utils.shortenHex('0x0000000000000000000000000000000000000000')).toBe('0x0000');
  });

  it('isHexNil', () => {
    expect(utils.isHexNil('0x0000000000000000000000000000000000000001')).toBe(false);
    expect(utils.isHexNil('0x0000000000000000000000000000000000000000')).toBe(true);
  });

  it('toNumberOfTokens', () => {
    expect(utils.toNumberOfTokens('10000000000000000000')).toBe(10);
    expect(utils.toNumberOfTokens('10400000000000000000')).toBe(10.4);
    expect(utils.toNumberOfTokens(BN('10440000000000000000'))).toBe(10.44);
  });

  it('toUiNumberOfTokens', () => {
    expect(utils.toUiNumberOfTokens('10000000000000000000')).toBe('10.0000');
    expect(utils.toUiNumberOfTokens('10400000000000000000')).toBe('10.4000');
    expect(utils.toUiNumberOfTokens(BN('10440000000000000000'))).toBe('10.4400');
  });

  it('timeTo0UTC', () => {
    expect(utils.timeTo0UTC()).toBe('13 hours');
    Date.now = () => new Date('2020-02-14T23:20:30Z').getTime();
    expect(utils.timeTo0UTC()).toBe('39 minutes');
  });

  it('toClosesMeaningfulUnit', () => {
    expect(utils.toClosesMeaningfulUnit('0')).toEqual({ value: '0', unit: 'wei' });
    expect(utils.toClosesMeaningfulUnit('7')).toEqual({ value: '7', unit: 'wei' });
    expect(utils.toClosesMeaningfulUnit('7000')).toEqual({ value: '7000', unit: 'wei' });
    expect(utils.toClosesMeaningfulUnit('7000000000000000000')).toEqual({ value: '7.0000', unit: 'ETH' });
  });
});
