import React, { Component } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  bidValue: Yup.string().matches(/[0-9+]/).required('Field is required.')
});

function WorkLock(props) {
  const onSubmit = (value) => {
    if (props.onBid) {
      props.onBid(value);
    }
  }
  return <Formik onSubmit={onSubmit} initialValues={{ bidValue: 0 }} validationSchema={validationSchema}>
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      isValid,
      errors,
      setValues,
    }) => {
        const onEthValueChange = (...args) => {
          props.onEthValueChange && props.onEthValueChange(...args);
          handleChange(...args);
        };
        return <>
          <Form onSubmit={handleSubmit} className="w-100">
            <Form.Group as={Row}>
              <Form.Label column md={{ span: 3, offset: 1 }} htmlFor="bid-value">
                ETH amount
              </Form.Label>
              <Col md={6}>
                <Form.Control id="bid-value" size="bg" type="text" name="bidValue" onChange={onEthValueChange} value={values.bidValue} />
                <Form.Control.Feedback type="invalid" style={{ display: errors.bidValue ? 'inline' : 'none' }}>{errors.bidValue}</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button type="submit" disabled={!isValid}>Bid</Button>
            </div>
          </Form>
        </>;
      }
    }
    </Formik>;
}

export default WorkLock;
