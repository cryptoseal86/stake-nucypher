import React, { useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import Loading from '../Loading/Loading';
import * as Yup from 'yup';

import './ProlongSubStake.scss';

const validationSchema = Yup.object().shape({
  prolongDurationValue: Yup.number().min(1, 'Minimum prolongation is 1 period').required('Field is required.')
});

function ProlongSubStake(props) {
  const onSubStakeProlong = (stakeValues) => {
    if (props.onSubStakeProlong) {
      props.onSubStakeProlong(stakeValues);
    }
  };
  const [loading, setLoading] = useState(false);
  const onSubmit = async (...args) => {
    setLoading(true);
    if (onSubStakeProlong) {
      await onSubStakeProlong(...args);
    }
    setLoading(false);
  };
  return <Formik onSubmit={onSubmit} initialValues={{ prolongDurationValue: 1 }} validationSchema={validationSchema}>
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      isValid,
      errors,
      setValues,
      setErrors
    }) => {
      if (!loading) {
        return <Form onSubmit={handleSubmit}>
          <Form.Group as={Row}>
            <Form.Label column md={{ span: 2, offset: 2 }} htmlFor="substake-prolong-duration">
              Extend for
            </Form.Label>
            <Col md={4}>
              <Form.Control id="substake-prolong-duration" type="number" name="prolongDurationValue" onChange={handleChange} value={values.prolongDurationValue} />
              <div className="feedback-placeholder">
                <Form.Control.Feedback type="invalid" style={{ display: errors.prolongDurationValue && touched.prolongDurationValue ? 'inline' : 'none' }}>{errors.prolongDuration}</Form.Control.Feedback>
              </div>
            </Col>
            <Form.Label column md={4}>
              periods
            </Form.Label>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit"  disabled={!isValid}>Prolong</Button>
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

export default ProlongSubStake;
