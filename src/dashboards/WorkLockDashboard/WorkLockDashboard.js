import React, { useState, useEffect, Fragment } from 'react';
import Web3 from 'web3';
import { observer } from 'mobx-react';
import { decorate } from 'mobx';
import { useHistory } from 'react-router-dom';
import { useStore } from '../../stores';
import { Container, Row, Col, Table, Button, Modal, Alert } from 'react-bootstrap';
import WorkLock from '../../components/WorkLock/WorkLock';
import { toUiNumberOfTokens, toClosesMeaningfulUnit } from '../../utils/utils';
import Loading from '../../components/Loading/Loading';
import Timeline from '../../components/Timeline/Timeline';
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
  const [warningShow, setWarningShow] = useState(false);
  const [bidValue, setBidBalue] = useState('0');

  const onBid = (event) => {
    setWarningShow(true);
    const ethValue = Web3.utils.toWei(event.bidValue.toString());
    setBidBalue(ethValue);
  };

  const onAgree = () => {
    store.workLockStore.bid(bidValue);
    setWarningShow(false);
  };

  const onClaim = async () => {
    setBusyClaim(true);
    if (store.workLockStore.availableCompensation !== '0') {
      await store.workLockStore.withdrawCompensation();
    }
    await store.workLockStore.claim();
    setBusyClaim(false);
  };

  const onBidCancel = async () => {
    setBusyCancel(true);
    await store.workLockStore.cancelBid();
    setBusyCancel(false);
  };

  const refundWorkLock = () => {
    return store.workLockStore.refund();
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

  const minBidAmount = store.workLockStore.minAllowedBid ? Web3.utils.fromWei(store.workLockStore.minAllowedBid.toString()) : null;
  const unlockedEth = store.workLockStore.unlockedEth ? toClosesMeaningfulUnit(store.workLockStore.unlockedEth) : { value: '0', unit: 'wei' };
  return store.web3Initilized && !loading ? (<div className="worklock-contrainer">
    <Row>
      <Col md={4}>
        <p className="text-center h6">Total ETH supplied</p>
        { store.workLockStore.tokenSupply ? <p className="text-center h4">{ toUiNumberOfTokens(store.workLockStore.ethSupply) } <br /> ETH</p> : null }
      </Col>
      <Col md={4}>
        <p className="text-center h6">Worklock Participants</p>
        { store.workLockStore.biddersNumber ? <p className="text-center h4">{ store.workLockStore.biddersNumber }</p> : null }
      </Col>
      <Col md={{ span: 4 }}>
        <p className="text-center h6">Total NU to distribute</p>
        { store.workLockStore.tokenSupply ? <p className="text-center h4">{ toUiNumberOfTokens(store.workLockStore.tokenSupply) } <br /> NU</p> : null }
      </Col>
    </Row>
    {
      store.workLockStore.workLockStatus() === 'in_progress' ? <>
        <Row className="panel">
          <Container>
            <Row className="mt-2 justify-content-center">
              { store.workLockStore.workInfo ? <>
                <Timeline
                  timelinePoints={[
                    {
                      date: store.workLockStore.startBidDate,
                      label: 'Escrow phase'
                    },
                    {
                      date: store.workLockStore.endBidDate,
                      label: 'Escrow cancelation window'
                    },
                    {
                      date: +store.workLockStore.endBidDate + (60 * 60 * 24),
                      label: 'Claiming tokens window'
                    },
                    {
                      textPoint: 'Stake creation',
                      label: 'Running node'
                    },
                    {
                      textPoint: 'Ether claimed'
                    }
                  ]}
                  completedIndex={ store.workLockStore.workInfo.claimed ? (store.workLockStore.workInfo.depositedETH === '0' ? 4 : 3) : null }
                  ></Timeline>
                </> : null }
            </Row>
            <Row className="mt-2 justify-content-center">
              <span className="h5">WorkLock event ends on { dateFormat(endDate) }</span>
            </Row>
            <Row className="mt-3">
              { store.workLockStore.workInfo ? <>
                <Col>
                  <p className="h6 text-center">Your total</p>
                  <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.workInfo.depositedETH)} <br /> ETH</p>
                  <div className="action d-flex justify-content-center">
                    { store.workLockStore.workInfo.depositedETH !== '0' && store.workLockStore.cancelationBidStatus() !== 'finished' ?
                      <>{ !busyCancel ? <Button onClick={onBidCancel}>Cancel bid</Button> : <Loading size={20}></Loading> }</>
                    : null }
                  </div>
                </Col>
                {
                  store.workLockStore.workInfo.depositedETH !== '0' && store.workLockStore.cancelationBidStatus() === 'finished' ? <>
                    <Col>
                      <p className="h6 text-center">Your claim</p>
                      <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.claimAmount)} <br /> NU</p>
                      <p className="small text-center text-muted">Warning! Available claim value may fluctuate until Worklock closes and claims are finalized</p>
                    </Col>
                  </> : null
                }
              </> : null }
            </Row>
            <Row className="mt-4">
              <Col md={12} className="m-2 d-flex justify-content-center">
                <WorkLock onBid={onBid} minBid={minBidAmount}></WorkLock>
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
              { store.workLockStore.workInfo ? <>
                <Timeline
                  timelinePoints={[
                    {
                      date: store.workLockStore.startBidDate,
                      label: 'Escrow phase'
                    },
                    {
                      date: store.workLockStore.endBidDate,
                      label: 'Escrow cancelation window'
                    },
                    {
                      date: +store.workLockStore.endBidDate + (60 * 60 * 24),
                      label: 'Claiming tokens window'
                    },
                    {
                      textPoint: 'Stake creation',
                      label: 'Running node'
                    },
                    {
                      textPoint: 'Ether claimed'
                    }
                  ]}
                  completedIndex={ store.workLockStore.workInfo.claimed ? (store.workLockStore.workInfo.depositedETH === '0' ? 4 : 3) : null }
                  ></Timeline>
                </> : null }
            </Row>
            <Row className="mt-3 justify-content-center">
              { store.workLockStore.workInfo ? <>
                <Col>
                  <p className="h6 text-center">Deposited amount</p>
                  <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.workInfo.depositedETH)} <br /> ETH</p>
                  <div className="action d-flex justify-content-center">
                    { store.workLockStore.workInfo.depositedETH !== '0' && store.workLockStore.cancelationBidStatus() !== 'finished' ?
                      <>{ !busyCancel ? <Button onClick={onBidCancel}>Cancel bid</Button> : <Loading size={20}></Loading> }</>
                    : <p className="small text-center text-muted">Warning! Escrow period ended</p> }
                  </div>
                </Col>
                {
                  !store.workLockStore.workInfo.claimed ? <>
                    {
                      store.workLockStore.workInfo.depositedETH !== '0' && store.workLockStore.cancelationBidStatus() === 'finished' ? <>
                        <Col className="mt-2">
                          <p className="h6 text-center">Available for claim</p>
                          <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.claimAmount)} <br /> NU</p>
                          <p className="small text-center text-muted">Warning! Claiming WorkLock NU tokens will initialize a new stake</p>
                          <div className="action d-flex justify-content-center">
                            <>{ !busyClaim ? <Button
                                onClick={onClaim}
                                disabled={!(store.workLockStore.workInfo.depositedETH !== '0' && store.workLockStore.claimingAvailable && !store.workLockStore.workInfo.claimed)}
                                >Claim</Button> : <Loading size={20}></Loading> }</>
                          </div>
                        </Col>
                      </> : null }
                    </> : <>
                    {
                      store.workLockStore.workInfo.depositedETH !== '0' && store.workLockStore.cancelationBidStatus() === 'finished' ? <>
                        <Col className="mt-2">
                          <p className="h6 text-center">You claimed</p>
                          <p className="h4 text-center">{toUiNumberOfTokens(store.workLockStore.claimAmount)} <br /> NU</p>
                        </Col>
                      </> : null }
                    </>
                }

              </> : null }
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
    <Modal
       show={warningShow}
       onHide={() => setWarningShow(false)}
       dialogClassName="modal-90w"
       aria-labelledby="example-custom-modal-styling-title"
     >
       <Modal.Header closeButton>
         <Modal.Title id="example-custom-modal-styling-title">
           Warning!
         </Modal.Title>
       </Modal.Header>
       <Modal.Body>
          <p>
          <Alert variant="danger">All ETH contributed during the WorkLock will be automatically returned to the participant by the Worklock smart contract after the WorkLock participant has provided Proxy Re-Encryption services for the required period of approximately six months from network launch. If a participant does not provide the required services, their ETH will remain escrowed in the WorkLock smart contract. Please carefully consider this before choosing to participate in the Worklock program. The WorkLock smart contract has been audited by both NuCypher core developers and Trail of Bits. However, there are no guarantees and a certain degree of smart contract risk remains.</Alert>
         </p>
       </Modal.Body>
       <Modal.Footer>
         <Button onClick={onAgree}>Agree</Button>
       </Modal.Footer>
     </Modal>
  </div>) : <div className="d-flex justify-content-center"><Loading size={80}></Loading></div>;
}

export default observer(WorkLockDashboard);
