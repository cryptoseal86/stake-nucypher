import React, { useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import Loading from '../Loading/Loading';
import * as Yup from 'yup';
import Web3 from 'web3';
import { toUiNumberOfTokens } from '../../utils/utils';
import BN from 'bignumber.js';

import './DivideSubStake.scss';

const validationSchema = Yup.object().shape({
  firstSubstakeValue: Yup.string().test('min', 'Minimum stake is 15000 NU', value => (+value) > 15000).required('Field is required.'),
  secondSubstakeValue: Yup.string().test('min', 'Minimum stake is 15000 NU', value => (+value) > 15000).required('Field is required.'),
  stakeDuration: Yup.number().min(1, 'Minimum prolong duration is 1 period').required('Field is required.')
});

function DivideSubStake(props) {
  const onSubStakeDivide = props.onSubStakeDivide ? props.onSubStakeDivide : null;
  const [loading, setLoading] = useState(false);
  const onSubmit = async (...args) => {
    setLoading(true);
    if (onSubStakeDivide) {
      await onSubStakeDivide(...args);
    }
    setLoading(false);
  };
  const TooltipedSlider = createSliderWithTooltip(Slider);

  const subStakeValue = props.subStake ? BN(props.subStake.value) : BN(0);
  return <Formik onSubmit={onSubmit} initialValues={{ firstSubstakeValue: Web3.utils.fromWei(subStakeValue.div(2).toFixed(0, BN.ROUND_UP)), secondSubstakeValue: Web3.utils.fromWei(subStakeValue.div(2).toFixed(0, BN.ROUND_DOWN)), sliderValue: 50, stakeDuration: 1 }} validationSchema={validationSchema}>
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      isValid,
      errors,
      setValues,
      setErrors,
      setTouched
    }) => {
      const onSliderChange = (value) => {
        const first = subStakeValue.times(value).div(100).toFixed(0, BN.ROUND_UP);
        const second = subStakeValue.times(new BN(100).minus(value)).div(100).toFixed(0, BN.ROUND_DOWN);
        setValues({
          ...values,
          firstSubstakeValue: Web3.utils.fromWei(first),
          secondSubstakeValue: Web3.utils.fromWei(second),
          sliderValue: value
        });
        setTouched({
          ...touched,
          firstSubstakeValue: true,
          secondSubstakeValue: true
        });
      };
      const onControlValueChange = (event) => {
        if (event.target.value) {
          const controlValue = new BN(Web3.utils.toWei(event.target.value));
          const controlName = event.target.name;
          if (controlValue.gt(subStakeValue)) {
            setErrors({
              ...errors,
              firstSubstakeValue: 'Can not be more than sub stake value'
            });
          } else {
            const setValue = {
              ...values,
              stakeDuration: values.stakeDuration
            };
            if (controlName === 'firstSubstakeValue') {
              setValue.firstSubstakeValue = Web3.utils.fromWei(controlValue.toFixed());
              setValue.secondSubstakeValue = Web3.utils.fromWei(subStakeValue.minus(controlValue).toFixed());
              setValue.sliderValue = controlValue.div(subStakeValue).times(100).toNumber();
            } else {
              setValue.firstSubstakeValue = Web3.utils.fromWei(subStakeValue.minus(controlValue).toFixed());
              setValue.secondSubstakeValue = Web3.utils.fromWei(controlValue.toFixed());
              setValue.sliderValue = subStakeValue.div(controlValue).times(100).toNumber();
            }
            setValues(setValue);
          }
        }
        setTouched({
          ...touched,
          firstSubstakeValue: true,
          secondSubstakeValue: true
        });
        handleChange(event);
      };
      if (!loading) {
        return <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mt-2">
            <Col sm={3}>
              <Form.Control data-testid="first-substake-value" size="sm" type="text" name="firstSubstakeValue" onChange={onControlValueChange} onBlur={handleBlur} value={values.firstSubstakeValue} />
              <div className="feedback-placeholder">
                <Form.Control.Feedback type="invalid" style={{ display: errors.firstSubstakeValue && touched.firstSubstakeValue ? 'inline' : 'none' }}>{errors.firstSubstakeValue}</Form.Control.Feedback>
              </div>
            </Col>
            <Col sm={6} className="d-flex justify-content-center" style={{ paddingTop: '8px' }}>
              <TooltipedSlider step={5} defaultValue={50} name="sliderValue" value={values.sliderValue} min={0} max={100} onChange={onSliderChange} />
            </Col>
            <Col sm={3}>
              <Form.Control data-testid="second-substake-value" size="sm" type="text" name="secondSubstakeValue" onChange={onControlValueChange} onBlur={handleBlur} value={values.secondSubstakeValue} />
              <div className="feedback-placeholder">
                <Form.Control.Feedback type="invalid" style={{ display: errors.secondSubstakeValue && touched.secondSubstakeValue ? 'inline' : 'none' }}>{errors.secondSubstakeValue}</Form.Control.Feedback>
              </div>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column md={{ span: 2, offset: 2 }}>
              Extend for
            </Form.Label>
            <Col md={4}>
              <Form.Control type="number" name="stakeDuration" onChange={handleChange} onBlur={handleBlur} value={values.stakeDuration} />
              <div className="feedback-placeholder">
                <Form.Control.Feedback type="invalid" style={{ display: errors.stakeDuration && touched.stakeDuration ? 'inline' : 'none' }}>{errors.stakeDuration}</Form.Control.Feedback>
              </div>
            </Col>
            <Form.Label column md={{ span: 2 }}>
              periods
            </Form.Label>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit" disabled={!isValid}>Divide</Button>
          </div>
        </Form>;
      } else {
        return <>
          <div className="mt-2 d-flex justify-content-center align-items-center">
            <Loading size={60}></Loading>
          </div>
        </>;
      }
    }
  }
  </Formik>;
}

export default DivideSubStake;
