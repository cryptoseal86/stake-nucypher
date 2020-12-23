import React, { useState, Fragment } from 'react';
import { Container, Row, Col, Button, Collapse } from 'react-bootstrap';
import DivideSubStake from '../DivideSubStake/DivideSubStake';
import ProlongSubStake from '../ProlongSubStake/ProlongSubStake';
import MergeSubStake from '../MergeSubStake/MergeSubStake';
import { toUiNumberOfTokens } from '../../utils/utils';
import './Stakes.scss';

function dateFormat(date) {
  const options = { month: 'short', day: 'numeric', year: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

function Stakes(props) {
  const [divideCollapse, setDivideCollapse] = useState([]);
  const [prolongCollapse, setProlongCollapse] = useState([]);
  const [mergeCollapse, setMergeCollapse] = useState([]);

  function toggleDivideRow(index) {
    return () => {
      setDivideCollapse(prevState => {
        const newState = [...prevState];
        newState[index] = !prevState[index];
        return newState;
      });
      if (prolongCollapse[index]) toggleProlongRow(index)();
    };
  };

  function toggleProlongRow(index) {
    return () => {
      setProlongCollapse(prevState => {
        const newState = [...prevState];
        newState[index] = !prevState[index];
        return newState;
      });
      if (divideCollapse[index]) toggleDivideRow(index)();
    };
  };

  function toggleMergeRow(index) {
    return () => {
      setMergeCollapse(prevState => {
        const newState = [...prevState];
        newState[index] = !prevState[index];
        return newState;
      });
      if (mergeCollapse[index]) toggleMergeRow(index)();
    };
  }

  const onSubStakeDivide = props.onSubStakeDivide ? props.onSubStakeDivide : () => {};
  const onSubStakeProlong = props.onSubStakeProlong ? props.onSubStakeProlong : () => {};
  const onSubStakeMerge = props.onSubStakeMerge ? props.onSubStakeMerge : () => {};
  return <Container>
    <div className="table">
      <div className="table-row table-header">
        <div className="table-row-column table-row-index">#</div>
        <div className="table-row-column table-center">Value</div>
        <div className="table-row-column table-center">Remaining</div>
        <div className="table-row-column table-center">Enactment</div>
        <div className="table-row-column table-center"></div>
      </div>

      {
        props.substakes && props.substakes.map((substake, i) => <Fragment key={substake.index}>
          <div className="table-row">
            <div className="table-row-column table-row-index">{i}</div>
            <div className="table-row-column table-center">{toUiNumberOfTokens(substake.value)} NU</div>
            <div className="table-row-column table-center">{substake.remainingDuration} periods</div>
            <div className="table-row-column table-center">{dateFormat(substake.firstPeriod)} - {dateFormat(substake.lastPeriod)}</div>
            <div className="table-row-column table-center">
              <Button data-testid={ `divide-button-${i}` } className="m-1" variant="secondary" size="sm" onClick={toggleDivideRow(i)}>Divide</Button>
              {
                substake.remainingDuration !== 0 ? <>
                  <Button data-testid={ `prolong-button-${i}` } className="m-1" variant="secondary" size="sm" onClick={toggleProlongRow(i)}>Prolong</Button>
                </> : null
              }
              <Button data-testid={ `merge-button-${i}` } className="m-1" variant="secondary" size="sm" onClick={toggleMergeRow(i)}>Merge</Button>
            </div>
          </div>
          <Collapse in={divideCollapse[i]} className="mt-4">
            <Container>
              <Row>
                <Col>
                  <DivideSubStake subStake={substake} onSubStakeDivide={onSubStakeDivide.bind(substake)}></DivideSubStake>
                </Col>
              </Row>
            </Container>
          </Collapse>
          {
            substake.remainingDuration !== 0 ? <>
              <Collapse in={prolongCollapse[i]} className="mt-4">
                <Container>
                  <Row>
                    <Col>
                      <ProlongSubStake subStake={substake} onSubStakeProlong={onSubStakeProlong.bind(substake)}></ProlongSubStake>
                    </Col>
                  </Row>
                </Container>
              </Collapse>
            </> : null
          }
          <Collapse in={mergeCollapse[i]} className="mt-4">
            <Container>
              <Row>
                <Col>
                  <MergeSubStake subStake={substake} onSubStakeMerge={onSubStakeMerge.bind(substake)}></MergeSubStake>
                </Col>
              </Row>
            </Container>
          </Collapse>
        </Fragment>)
      }
    </div>
  </Container>;
}

export default Stakes;
