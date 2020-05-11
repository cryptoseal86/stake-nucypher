import React, { Fragment } from 'react';
import classnames from 'classnames';
import './Timeline.scss';

function dateFormat(dateNum) {
  const date = new Date(dateNum * 1000);
  const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const now = Date.now() / 1000;

export default function Timeline(props) {
  if (props.timelinePoints) {
    return <>
      <ul className="timeline" id="timeline">
        {
          props.timelinePoints.map((point, index) => <Fragment key={index}>
            <li className={classnames('li', { 'complete': (point.date <= now || props.completedIndex >= index )})} style={{width: 100/props.timelinePoints.length + '%'}}>
              <div className="timeline">
                {
                  point.date ? <span className="date">{ dateFormat(point.date) }</span> : null
                }
                {
                  point.textPoint ? <span className="text-point">{ point.textPoint }</span> : null
                }
              </div>
              <div className="status">
                {
                  point.label ? <h6>{point.label}</h6> : null
                }
              </div>
            </li>
          </Fragment>)
        }
      </ul>
    </>;
  } else {
    return null;
  }
}
