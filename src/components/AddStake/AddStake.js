import React from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './AddStake.css';

const validationSchema = Yup.object().shape({
  stakeValue: Yup.number().min(15000, 'Minimum stake is 15000 NU').required('Field is required.'),
  stakeDuration: Yup.number().min(30, 'Minimum duration is 30 periods').required('Field is required.')
});

function AddStake(props) {
  const onSubmit = (stakeValues) => {
    if (props.onAddStake) {
      props.onAddStake(stakeValues);
    }
  };
  return <Formik onSubmit={onSubmit} initialValues={{ infiniteApproval: false }} validationSchema={validationSchema}>
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      touched,
      isValid,
      errors,
      dirty
    }) => (
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={4} htmlFor="stake-value">
            Stake value
          </Form.Label>
          <Col sm={8}>
            <Form.Control id="stake-value" type="number" name="stakeValue" onChange={handleChange} value={values.value} />
            <div className="feedback-placeholder">
              <Form.Control.Feedback type="invalid" style={{ display: errors.stakeValue && dirty ? 'inline' : 'none' }}>{errors.stakeValue}</Form.Control.Feedback>
            </div>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={4} htmlFor="stakeDuration">
            Stake duration
          </Form.Label>
          <Col sm={8}>
            <Form.Control id="stakeDuration" type="number" name="stakeDuration" onChange={handleChange} value={values.duration} />
            <div className="feedback-placeholder">
              <Form.Control.Feedback type="invalid" style={{ display: errors.stakeDuration && dirty ? 'inline' : 'none' }}>{errors.stakeDuration}</Form.Control.Feedback>
            </div>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col sm={{ span: 8, offset: 4 }}>
            <Form.Check label="Infinite approval" name="infiniteApproval" defaultChecked={values.infiniteApproval} onChange={handleChange} value={values.infiniteApproval} />
          </Col>
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button type="submit" disabled={!isValid}>Stake</Button>
        </div>
      </Form>
    )}
  </Formik>;
}

export default AddStake;
