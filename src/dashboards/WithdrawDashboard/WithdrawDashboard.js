import React, { useEffect } from 'react';
import Web3 from 'web3';
import { observer } from 'mobx-react';
import { decorate } from 'mobx';
import { useStore } from '../../stores';
import { Row, Col, Button } from 'react-bootstrap';
import Withdraw from '../../components/Withdraw/Withdraw';
import { toClosesMeaningfulUnit } from '../../utils/utils';

function WithdrawDashboard(props) {
  const store = useStore();
  const withdrawStakingReward = (event) => {
    return store.stakerStore.withdraw(Web3.utils.toWei(event.withdrawValue.toString()));
  };
  const withdrawPolicyReward = () => {
    return store.policyStore.withdraw();
  };
  const refundWorkLock = () => {
    return store.workLockStore.refund();
  };
  useEffect(() => {
    (async () => {
      if (store.web3Initilized) {
        if (!store.policyStore.nodeReward) {
          store.policyStore.getNodeReward();
        }
        if (!store.stakerStore.completedWork) {
          store.stakerStore.getCompletedWork();
        }
        if (store.stakerStore.completedWork && !store.workLockStore.unlockedEth) {
          await store.workLockStore.getWorkInfo();
          await store.workLockStore.getUnlockedEth();
        }
      }
    })();
  });
  const policyReward = store.policyStore.nodeReward ? toClosesMeaningfulUnit(store.policyStore.nodeReward) : null;
  const unlockedEth = store.workLockStore.unlockedEth ? toClosesMeaningfulUnit(store.workLockStore.unlockedEth) : null;

  return store.web3Initilized ? (<Row className="panel">
    <Col>
      <Row className="mt-5 tokens-row">
        {
          unlockedEth ? <>
            <Col>
              <p className="h6 text-center">Unlocked from WorkLock</p>
              <p className="h4 text-center">{ unlockedEth.value } <br /> { unlockedEth.unit }</p>
              <div className="text-center d-flex justify-content-center">{
                <Button variant="secondary" className="button-action mt-2" disabled={ store.workLockStore.unlockedEth === '0'} onClick={refundWorkLock}>Refund</Button>
              }</div>
            </Col>
          </> : null
        }
        <Col>
          <p className="h6 text-center">Policy rewards</p>
          <p className="h4 text-center">{ policyReward ? <>{ policyReward.value } <br /> { policyReward.unit } </> : null}</p>
          <div className="action d-flex justify-content-center"><Button variant="secondary" className="button-action mt-2" onClick={withdrawPolicyReward}>Withdraw</Button></div>
        </Col>
      </Row>
      <Row className="mt-5 tokens-row">
        <Col>
          <p className="h6 text-center">Rewards</p>
          <div className="text-center d-flex justify-content-center">{
            store.stakerStore.staker ? <>
              <Withdraw onWithdraw={withdrawStakingReward} maxAvailable={store.stakerStore.staker ? store.stakerStore.staker.availableForWithdraw : null}></Withdraw>
            </> : null
          }</div>
        </Col>
      </Row>
    </Col>
  </Row>) : null;
}

export default decorate(observer(WithdrawDashboard), {

});
