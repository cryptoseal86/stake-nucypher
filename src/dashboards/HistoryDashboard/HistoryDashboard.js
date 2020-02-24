import React, { useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react';
import { decorate } from 'mobx';
import Web3 from 'web3';
import Web3Initilizer from '../../web3Initializer';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useStore } from '../../stores';
import { toUiNumberOfTokens, isHexNil, shortenHex } from '../../utils/utils';

function historyItemText(item) {
  switch(item.type) {
    case 'activityConfirmed':
      return `Worker confirmed activity`;
    case 'deposit':
      return `Deposited ${toUiNumberOfTokens(item.value)} NU`;
    case 'withdraw':
      return `Withdrawal of ${toUiNumberOfTokens(item.value)} NU`;
    case 'restakeEnable':
      return (item.reStake ? 'Enabled' : 'Disabled') + ' restaking';
    case 'windDown':
      return (item.windDown ? 'Enabled' : 'Disabled') + ' winddown';
    case 'divide':
      return 'Divided stake';
    case 'slashed':
      return `Slashed stake for ${item.penalty}`;
    case 'workerSet':
      return isHexNil(item.worker) ? 'Detached worker' : `Set worker to ${shortenHex(item.worker)}`;
    case 'prolong':
      return `Prolonged stake`;
    case 'mined':
      return `Mined reward of ${toUiNumberOfTokens(item.value)} NU`
    case 'policyWithdraw':
      return `Withdrawal of policy reward ${(+Web3.utils.fromWei(new Web3.utils.BN(item.value))).toString()} ETH`;
  }

  return 'no_text_for_item' + JSON.stringify(item);
}

function HistoryDashboard() {

  const store = useStore();
  useEffect(() => {
    if (store.web3Initilized && !store.historyStore.events) {
      store.historyStore.getHistory();
    }
  });

  return store.web3Initilized ? (<div className="panel">
    <Row className="w-100">
      <Col md={12}>
        <div className="p-3 table">
          <div className="table-row table-header">
            <div className="table-row-column table-row-index">Block #</div>
            <div className="table-row-column table-center w-100">Action</div>
          </div>
          {
            store.historyStore.events && store.historyStore.events.map((item, index) => <Fragment key={item.block + index}>
              <div className="table-row">
                <div className="table-row-column table-row-index">{item.block.toString()}</div>
                <div className="table-row-column table-center w-100">{historyItemText(item)}</div>
              </div>
            </Fragment>)
          }
        </div>
      </Col>
    </Row>
  </div>) : null;
}

export default decorate(observer(HistoryDashboard), {

});
