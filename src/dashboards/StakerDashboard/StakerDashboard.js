import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { decorate } from 'mobx';
import Web3 from 'web3';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import Toggle from 'react-toggle';
import Stakes from '../../components/Stakes/Stakes';
import AddStake from '../../components/AddStake/AddStake';
import ChangeWorker from '../../components/ChangeWorker/ChangeWorker';
import Loading from '../../components/Loading/Loading';

import { shortenHex, isHexNil, toUiNumberOfTokens, timeTo0UTC } from '../../utils/utils';
import classnames from 'classnames';
import { useStore } from '../../stores';

import './StakerDashboard.scss';

function StakerDashboard(props) {
  const [busyAddStake, setBusyAddStake] = useState(false);
  const [busyAddWorker, setBusyAddWorker] = useState(false);
  const [busySetRestaking, setBusySetRestaking] = useState(false);
  const [busySetWindDown, setBusySetWindDown] = useState(false);
  const [addStakePanelOpen, setAddStakePanelOpen] = useState(false);
  const [editWorkerPanelOpen, setEditWorkerPanelOpen] = useState(false);
  const toggleAddStakePanel = () => {
    if (!busyAddStake) {
      setAddStakePanelOpen(!addStakePanelOpen);
    }
  }
  const toggleEditWorkerPanel = () => {
    if (!busyAddWorker) {
      setEditWorkerPanelOpen(!editWorkerPanelOpen);
    }
  }

  const store = useStore();

  useEffect(() => {
    if (store.web3Initilized && !store.stakerStore.staker) {
      store.stakerStore.getStakerInfo();
    }
  });

  const toggleRestaking = async (event) => {
    setBusySetRestaking(true);
    try {
      await store.stakerStore.setReStake(event.target.checked);
    } catch(e) {
      console.error(e);
    }
    setBusySetRestaking(false);
  };

  const toggleWindDown = async (event) => {
    setBusySetWindDown(true);
    try {
      await store.stakerStore.setWindDown(event.target.checked);
    } catch(e) {
      console.error(e);
    }
    setBusySetWindDown(false);
  };

  const addStake = async (newStake) => {
    setBusyAddStake(true);
    await store.stakerStore.addStake(newStake);
    setBusyAddStake(false);
    toggleAddStakePanel();
  };

  const changeWorker = async (newWorker) => {
    setBusyAddWorker(true);
    await store.stakerStore.bondWorker(newWorker);
    setBusyAddWorker(false);
    toggleEditWorkerPanel();
  };

  const detachWorker = async () => {
    setBusyAddWorker(true);
    await store.stakerStore.detachWorker();
    setBusyAddWorker(false);
  };

  let workerActivityState = null;
  if (store.stakerStore.staker &&  store.stakerStore.staker.lastActivePeriod === '0') {
    workerActivityState = 'not_seen';
  } else if (store.stakerStore.staker && store.currentPeriod < store.stakerStore.staker.lastActivePeriod) {
    workerActivityState = 'next_confirmed';
  } else if (store.stakerStore.staker && store.currentPeriod === store.stakerStore.staker.lastActivePeriod) {
    workerActivityState = 'confirmed';
  } else if (store.stakerStore.staker && store.currentPeriod > store.stakerStore.staker.lastActivePeriod) {
    workerActivityState = 'not_confirmed'
  }

  const labelForWorkerState = (state) => {
    let result = '';
    switch (state) {
      case 'not_seen':
        result = 'Never confirmed activity';
        break;
      case 'next_confirmed':
        result = 'Next period confirmed';
        break;
      case 'confirmed':
        result = 'Current period confirmed. Next period confirmation pending';
        break;
      case 'not_confirmed':
        result = 'Current period is not confirmed';
        break;
      default:
        result = null;
    }
    return result;
  };
  const WorkerActivity = () =>  <>
      <span className={classnames({
          'text-success': workerActivityState === 'next_confirmed',
          'text-warning': workerActivityState === 'confirmed',
          'text-danger': workerActivityState === 'not_confirmed',
          'text-secondary': workerActivityState === 'not_seen'
        })}>
        <span>{labelForWorkerState(workerActivityState)}</span>
      </span>
    </>;

  const lockedRestaking = store.stakerStore.staker && store.stakerStore.staker.lockReStakeUntilPeriod !== '0' && (+store.stakerStore.staker.lockReStakeUntilPeriod) < (+store.currentPeriod);

  const onSubStakeDivide = function(event) {
    return store.stakerStore.divideStake(this.index, Web3.utils.toWei(event.firstSubstakeValue.toString()), event.stakeDuration);
  };

  const onSubStakeProlong = function(event) {
    return store.stakerStore.prolongStake(this.index, event.prolongDurationValue);
  };
  const onTabChange = props.onTabChange ? props.onTabChange : () => {};
  return store.web3Initilized ? (<>
    <Row className="panel">
      <Col>
        <h2 className="text-center">Welcome back, {store.stakerStore.staker ? shortenHex(store.stakerStore.staker.address) : null}</h2>
          <Row className="mt-5">
            <Col>
              <p className="h6 text-center">Current period</p>
              <p className="h4 text-center">{store.currentPeriod}</p>
            </Col>
            <Col>
              <p className="h6 text-center">Next period in</p>
              <p className="h4 text-center">{timeTo0UTC()}</p>
            </Col>
          </Row>
          <Row className="mt-5 tokens-row">
            <Col>
              <p className="h6 text-center">Tokens staked</p>
              <p className="h4 text-center">{store.stakerStore.staker ? toUiNumberOfTokens(store.stakerStore.staker.value) : null} <br />NU</p>
              <div className="action d-flex justify-content-center"><Button className="button-action mt-2" onClick={toggleAddStakePanel}>Add stake</Button></div>
            </Col>
            <Col>
              <p className="h6 text-center">Total rewards</p>
              <p className="h4 text-center">{store.historyStore.events ? toUiNumberOfTokens(store.historyStore.totalRewards) : null} <br />NU</p>
            </Col>
            <Col>
              <p className="h6 text-center">Available for withdrawal</p>
              <p className="h4 text-center">{store.stakerStore.staker ? toUiNumberOfTokens(store.stakerStore.staker.availableForWithdraw) : null} <br />NU</p>
              <div className="action d-flex justify-content-center"><Button data-testid="withdraw-switch-button" variant="secondary" className="button-action mt-2" onClick={onTabChange.bind(this, 'withdraw')}>Withdraw</Button></div>
            </Col>
          </Row>
          <Row className="mt-5">
            {
              store.stakerStore.staker && store.stakerStore.staker.flags && store.stakerStore.staker.substakes.length ?
                <Col md={6}>
                  <p className="h6 text-center">Restaking</p>
                  {
                    !lockedRestaking ? <>
                      <div className="h4 text-center">
                        { !busySetRestaking ? <>
                          <Toggle
                            data-testid="restaking-toggle"
                            checked={store.stakerStore.staker.flags.reStake}
                            onChange={toggleRestaking}>
                          </Toggle>
                        </> : <Loading size={20}></Loading> }
                      </div>
                    </> : <>
                      <div className="h4 text-center">
                        Restaking is locked
                      </div>
                    </>
                  }
                </Col>
                :
                null
            }
            {
              store.stakerStore.staker && store.stakerStore.staker.flags && store.stakerStore.staker.substakes.length ?
                <Col md={6}>
                  <p className="h6 text-center">Wind down</p>
                  <div className="h4 text-center">
                    { !busySetWindDown ? <>
                      <Toggle
                        data-testid="winddown-toggle"
                        checked={store.stakerStore.staker.flags.windDown}
                        onChange={toggleWindDown}>
                      </Toggle>
                    </> : <Loading size={20}></Loading> }
                  </div>
                </Col>
                :
                null
            }
          </Row>
          <Row className="mt-5">
            {
              store.stakerStore.staker && store.stakerStore.staker.substakes.length ?
                <Col>
                  <p className="h6 text-center">Your worker</p>
                  <p className="h4 text-center">{ !busyAddWorker ? shortenHex(store.stakerStore.staker.worker) : <Loading size={20}></Loading>}</p>
                  <div className="action d-flex justify-content-center text-center">
                    {
                      (store.stakerStore.staker.workerStartPeriod === '0' || ((+store.currentPeriod) - (+store.stakerStore.staker.workerStartPeriod) >= 2) || isHexNil(store.stakerStore.staker.worker)) ? <>
                        <Button
                          variant={classnames({ 'secondary' : !isHexNil(store.stakerStore.staker.worker), 'primary': isHexNil(store.stakerStore.staker.worker) })}
                          onClick={toggleEditWorkerPanel}
                          disabled={store.stakerStore.staker ? store.currentPeriod < store.stakerStore.staker.workerStartPeriod : true}>
                          { isHexNil(store.stakerStore.staker.worker) ? 'Set worker' : 'Change worker' }
                        </Button>
                        {
                          !isHexNil(store.stakerStore.staker.worker) ? <>
                            <Button
                              variant={classnames({ 'secondary' : !isHexNil(store.stakerStore.staker.worker), 'primary': isHexNil(store.stakerStore.staker.worker) })}
                              className="ml-1"
                              onClick={detachWorker}
                              disabled={store.stakerStore.staker ? store.currentPeriod < store.stakerStore.staker.workerStartPeriod : true}>
                                Detach worker
                            </Button>
                          </> : null
                        }
                    </> : <>
                      <div className="text-center">Worker change/detach will be available in { 2 - ((+store.currentPeriod) - (+store.stakerStore.staker.workerStartPeriod)) } periods</div>
                    </> }
                  </div>
                  { ((+store.currentPeriod) - (+store.stakerStore.staker.workerStartPeriod) > 2) ? <div className="small text-muted text-center pt-1">Warning! Worker change/detach is possible once in 2 periods</div> : null }
                </Col>
              : null
            }
            {
              store.stakerStore.staker && !isHexNil(store.stakerStore.staker.worker) ? <>
                <Col>
                  <p className="h6 text-center">Worker activity</p>
                  <p className="h5 text-center">
                    <WorkerActivity></WorkerActivity>
                  </p>
                  <div className="action"></div>
                </Col>
              </> : null
            }
          </Row>
          <Modal show={addStakePanelOpen} onHide={toggleAddStakePanel}>
            <Modal.Header closeButton>
              <Modal.Title>Add Stake</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="p-3">
                { !busyAddStake ? <AddStake onAddStake={addStake}></AddStake> : <div className="action d-flex justify-content-center"><Loading size={80}></Loading></div> }
              </div>
            </Modal.Body>
          </Modal>
          <Modal show={editWorkerPanelOpen} onHide={toggleEditWorkerPanel}>
            <Modal.Header closeButton>
              <Modal.Title>Set worker</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="p-3">
                { !busyAddWorker && store.stakerStore.staker ? <ChangeWorker worker={store.stakerStore.staker.worker} onChangeWorker={changeWorker}></ChangeWorker> : <div className="action d-flex justify-content-center"><Loading size={80}></Loading></div>  }
              </div>
            </Modal.Body>
          </Modal>
      </Col>
    </Row>
    <Row>
      <Col>
        {
          store.stakerStore.staker ? <>
            <Row>
              <Col>
                <h5 className="pt-3 pb-3 text-center">Your stakes:</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                <Stakes substakes={store.stakerStore.staker.substakes} onSubStakeDivide={onSubStakeDivide} onSubStakeProlong={onSubStakeProlong}></Stakes>
              </Col>
            </Row>
          </> : null
        }
      </Col>
    </Row>
  </>) : null;
}

export default observer(decorate(StakerDashboard, {

}));
