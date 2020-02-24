import React from 'react';
import classnames from 'classnames';
import './Loading.css';

export default function Loading(props) {
  const size = props.size ? props.size : 80;
  const center = props.center ? props.center : false;
  return <>
    <div className={classnames({ 'sk-fading-circle': true, 'mx-auto': center, 'd-inline-block': !center })} style={{ height: size, width: size }}>
      <div className="sk-circle1 sk-circle"></div>
      <div className="sk-circle2 sk-circle"></div>
      <div className="sk-circle3 sk-circle"></div>
      <div className="sk-circle4 sk-circle"></div>
      <div className="sk-circle5 sk-circle"></div>
      <div className="sk-circle6 sk-circle"></div>
      <div className="sk-circle7 sk-circle"></div>
      <div className="sk-circle8 sk-circle"></div>
      <div className="sk-circle9 sk-circle"></div>
      <div className="sk-circle10 sk-circle"></div>
      <div className="sk-circle11 sk-circle"></div>
      <div className="sk-circle12 sk-circle"></div>
    </div>
    { props.message ? <div className={classnames({ 'text-center': center, 'pt-4': center, 'd-inline-block': !center })}>{props.message}</div> : null }
  </>;
}
