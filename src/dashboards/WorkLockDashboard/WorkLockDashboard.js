import React, { useState, useEffect, Fragment } from 'react';
import Web3 from 'web3';
import { observer } from 'mobx-react';
import { decorate } from 'mobx';
import { useStore } from '../../stores';
import Web3Initilizer from '../../web3Initializer';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import WorkLock from '../../components/WorkLock/WorkLock';
import { toUiNumberOfTokens } from '../../utils/utils';
import Loading from '../../components/Loading/Loading';
import BN from 'bignumber.js';
import './WorkLockDashboard.scss';

function dateFormat(date) {
  const options = { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function WorkLockDashboard(props) {
  const store = useStore();
  const [loading, setLoading] = useState();
  const [busyCancel, setBusyCancel] = useState(false);
  const [busyClaim, setBusyClaim] = useState(false);
  const onEthValueChange = (event) => {
    try {
      const value = event.target.value;
      const weiValue = Web3.utils.toWei(value);
    } catch(e) {

    }
  };

  const onBid = (event) => {
    const ethValue = Web3.utils.toWei(event.bidValue);
    store.workLockStore.bid(ethValue);
  };

  const onClaim = async () => {
    setBusyClaim(true);
    await store.workLockStore.claim();
    setBusyClaim(false);
  };

  const onBidCancel = async () => {
    setBusyCancel(true);
    await store.workLockStore.cancelBid();
    setBusyCancel(false);
  };

  useEffect(() => {
    if (store.web3Initilized && store.workLockStore && !store.workLockStore.inited) {
      (async () => {
        setLoading(true);
        await store.workLockStore.init();
        setLoading(false);
      })();
    }
  });
  const startDate = new Date();
  startDate.setTime(store.workLockStore.startBidDate * 1000);
  const endDate = new Date();
  endDate.setTime(store.workLockStore.endBidDate * 1000);

  return store.web3Initilized && !loading ? (<div className="worklock-contrainer">
    <Row>
      <Col md={4}>
      </Col>
      <Col md={4}>
        <p className="text-center h6">Total NU to distribute</p>
        { store.workLockStore.tokenSupply ? <p className="text-center h4">{ toUiNumberOfTokens(store.workLockStore.tokenSupply) } <br /> NU</p> : null }
      </Col>
      <Col md={{ span: 4 }}>
      </Col>
    </Row>
    {
      store.workLockStore.workLockStatus() === 'in_progress' ? <>
        <Row className="panel">
          <Container>
            <Row className="mt-2 justify-content-center">
              <span className="h5">WorkLock event ends on { dateFormat(endDate) }</span>
            </Row>
            <Row className="mt-3">
              { store.workLockStore.workInfo ? <>
                <Col>
                  <p className="h6 text-center">Your total bid</p>
                  <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.workInfo.depositedETH)}</p>
                  <div className="action d-flex justify-content-center">
                    { store.workLockStore.workInfo.depositedETH !== '0' ?
                      <>{ !busyCancel ? <Button onClick={onBidCancel}>Cancel bid</Button> : <Loading size={20}></Loading> }</>
                    : null }
                  </div>
                </Col>
                {
                  store.workLockStore.workInfo.depositedETH !== '0' ? <>
                    <Col>
                      <p className="h6 text-center">Your claim</p>
                      <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.claimAmount)} NU</p>
                      <p className="small text-center text-muted">Warning! Available claim value may fluctuate until bidding closes and claims are finalized</p>
                    </Col>
                  </> : null
                }
              </> : null }
            </Row>
            <Row className="mt-4">
              <Col md={12} className="m-2 d-flex justify-content-center">
                <WorkLock onBid={onBid} onEthValueChange={onEthValueChange}></WorkLock>
              </Col>
            </Row>
          </Container>
        </Row>
      </> : null
    }
    {
      store.workLockStore.workLockStatus() === 'finished' ? <>
        <Row className="panel">
          <Container>
            <Row className="mt-2 justify-content-center">
              <span className="h5">WorkLock event ended on { dateFormat(endDate) }</span>
            </Row>
            <Row className="mt-3 justify-content-center">
              { store.workLockStore.workInfo ? <>
                <Col>
                  <p className="h6 text-center">Your total bid</p>
                  <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.workInfo.depositedETH)}</p>
                  <div className="action d-flex justify-content-center">
                    { store.workLockStore.workInfo.depositedETH !== '0' ?
                      <>{ !busyCancel ? <Button onClick={onBidCancel}>Cancel bid</Button> : <Loading size={20}></Loading> }</>
                    : null }
                  </div>
                </Col>
                {
                  store.workLockStore.workInfo.depositedETH !== '0' ? <>
                    <Col className="mt-2">
                      <p className="h6 text-center">Available for claim</p>
                      <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.claimAmount)} NU</p>
                      <p className="small text-center text-muted">Warning! Claiming WorkLock NU tokens will initialize a new stake</p>
                      <div className="action d-flex justify-content-center">
                        { store.workLockStore.workInfo.depositedETH !== '0' && !store.workLockStore.workInfo.claimed ?
                          <>{ !busyClaim ? <Button onClick={onClaim}>Claim</Button> : <Loading size={20}></Loading> }</>
                        : null }
                      </div>
                    </Col>
                  </> : null }
              </> : null }
            </Row>
          </Container>
        </Row>
      </> : null
    }
    {
      store.workLockStore.workLockStatus() === 'not_started' ? <>
        <Row className="panel">
          <Container>
            <Row className="mt-2 justify-content-center">
              <span className="h5">WorkLock event starts on { dateFormat(startDate) }</span>
            </Row>
          </Container>
        </Row>
      </> : null
    }
  </div>) : <div className="d-flex justify-content-center"><Loading size={80}></Loading></div>;
}

export default observer(WorkLockDashboard);
