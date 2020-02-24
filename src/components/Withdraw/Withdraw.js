import React, { Component } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Web3 from 'web3';

function Withdraw(props) {
  const onSubmit = (value) => {
    if (props.onWithdraw) {
      props.onWithdraw(value);
    }
  };
  const maxAvailable = props.maxAvailable ? Web3.utils.fromWei(new Web3.utils.BN(props.maxAvailable)) : null;
  let withdrawalValidationRule = Yup.number();
  if (maxAvailable) {
    withdrawalValidationRule = withdrawalValidationRule.max(maxAvailable, `Maximum available ${maxAvailable}`);
  }
  const validationSchema = Yup.object().shape({
    withdrawValue: withdrawalValidationRule.required('Field is required.')
  });
  return <Formik onSubmit={onSubmit} initialValues={{ withdrawValue: 0 }} validationSchema={validationSchema}>
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
        const setMaxValue = () => {
          setValues({
            withdrawValue: maxAvailable
          });
        };
        return <>
          <Form onSubmit={handleSubmit} className="w-100">
            <Form.Group as={Row}>
              <Form.Label column md={{ span: 2, offset: 2 }} htmlFor="withdraw-value">
                Amount
              </Form.Label>
              <Col md={4}>
                <Form.Control id="withdraw-value" size="bg" type="text" name="withdrawValue" onChange={handleChange} value={values.withdrawValue} />
                <Form.Control.Feedback type="invalid" style={{ display: errors.withdrawValue ? 'inline' : 'none' }}>{errors.withdrawValue}</Form.Control.Feedback>
              </Col>
              <Col md={2}>
                <Button size="sm" variant="link" onClick={setMaxValue}>Set max</Button>
              </Col>
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button type="submit" disabled={!isValid}>Withdraw</Button>
            </div>
          </Form>
        </>;
      }
    }
    </Formik>;
}

export default Withdraw;
