import BN from 'bignumber.js';
import Web3 from 'web3';

function shortenHex(hex) {
  return `${hex.substring(0, 6)}`;
}

function isHexNil(hex) {
  return hex === '0x0000000000000000000000000000000000000000';
}

function toNumberOfTokens(amount) {
  return BN(Web3.utils.fromWei(amount.toString())).toNumber();
}

function toUiNumberOfTokens(amount) {
  return BN(toNumberOfTokens(amount)).toFixed(4);
}

function timeTo0UTC() {
  const date = new Date();
  const offsetInMiliseconds = (date.getTimezoneOffset() * 60 * 1000);
  const utcActualTime = new Date(Date.now() + offsetInMiliseconds);
  const utcEndOfDay = new Date(utcActualTime.getFullYear(), utcActualTime.getMonth(), utcActualTime.getDate() + 1, 0, 0, 0);
  const timeRemaining = utcEndOfDay.getTime() - utcActualTime.getTime();

  let timeUnits = 'hours';
  let timeTo = (timeRemaining/1000/60)/60;
  if (timeTo < 1) {
    timeTo *= 60;
    timeUnits = 'minutes';
  }
  return `${Math.floor(timeTo)} ${timeUnits}`;
}

function toClosesMeaningfulUnit(value) {
  const unitMap = {
    18: 'wei',
    0: 'ETH'
  };
  let result = toUiNumberOfTokens(value);
  let keys = Object.keys(unitMap);
  let index = 0;
  while (result === '0.0000' && index < keys.length) {
    result = toUiNumberOfTokens(BN(value).times(Math.pow(10, keys[index])).toFixed());
    index++;
  }

  if (+(keys[index - 1]) == 18) {
    result = result.substring(0, result.length - 5);
  }

  return { value: result, unit: unitMap[index === 0 ? index : keys[index - 1]] };
}

export {
  shortenHex,
  isHexNil,
  toNumberOfTokens,
  toUiNumberOfTokens,
  timeTo0UTC,
  toClosesMeaningfulUnit
};
