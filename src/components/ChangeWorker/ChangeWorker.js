import React from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  workerAddress: Yup.string().matches(/^0x[a-fA-F0-9]{40}$/i, 'Should be a valid Ethereum address').required('Field is required.')
})

function ChangeWorker(props) {
  const onSubmit = (stakeValues) => {
    if (props.onChangeWorker) {
      props.onChangeWorker(stakeValues);
    }
  };
  return <Formik onSubmit={onSubmit} initialValues={{ workerAddress: props.worker ? props.worker : '' }} validationSchema={validationSchema}>
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      isValid,
      errors,
    }) => (
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={2} htmlFor="worker-address">
            Worker
          </Form.Label>
          <Col sm={10}>
            <Form.Control id="worker-address" type="text" name="workerAddress" onChange={handleChange} value={values.workerAddress} />
            <Form.Control.Feedback type="invalid" style={{ display: errors.workerAddress ? 'inline' : 'none' }}>{errors.workerAddress}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button type="submit"  disabled={!isValid}>Set worker</Button>
        </div>
      </Form>
    )}
  </Formik>;
}

export default ChangeWorker;
