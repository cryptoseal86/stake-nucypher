import { observable, decorate } from 'mobx';

class Staker {
  constructor(obj) {
    this.reStakeDisabled = obj.reStakeDisabled;
    this.lockReStakeUntilPeriod = obj.lockReStakeUntilPeriod;
    this.worker = obj.worker;
    this.workerStartPeriod = obj.workerStartPeriod;
    this.lastActivePeriod = obj.lastActivePeriod;
    this.measureWork = obj.measureWork;
    this.completedWork = obj.completedWork;
    this.windDown = obj.windDown;
    this.pastDowntime = obj.pastDowntime;
    this.value = obj.value;
    this.substakes = [];
    this.address = null;
    this.lockedTokens = null;
    this.availableForWithdraw = null;
  }
}

export default decorate(Staker, {
  windDown: observable,
  reStakeDisabled: observable,
  substakes: observable
});
