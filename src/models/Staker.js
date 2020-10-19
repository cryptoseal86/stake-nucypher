import { observable, decorate } from 'mobx';

class Staker {
  constructor(obj) {
    this.lockReStakeUntilPeriod = obj.lockReStakeUntilPeriod;
    this.worker = obj.worker;
    this.workerStartPeriod = obj.workerStartPeriod;
    this.lastActivePeriod = obj.lastActivePeriod;
    this.completedWork = obj.completedWork;
    this.pastDowntime = obj.pastDowntime;
    this.value = obj.value;
    this.substakes = [];
    this.address = null;
    this.lockedTokens = null;
    this.availableForWithdraw = null;
    this.flags = obj.flags;
  }
}

export default decorate(Staker, {
  windDown: observable,
  reStakeDisabled: observable,
  substakes: observable
});
