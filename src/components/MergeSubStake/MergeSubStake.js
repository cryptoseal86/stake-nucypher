import React, { useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import Loading from '../Loading/Loading';
import * as Yup from 'yup';

import './MergeSubStake.scss';

const validationSchema = Yup.object().shape({
  mergeIdValue: Yup.number().required('Field is required.')
});

function MergeSubStake(props) {
  const onSubStakeMerge = (stakeValues) => {
    if (props.onSubStakeMerge) {
      props.onSubStakeMerge(stakeValues);
    }
  };
  const [loading, setLoading] = useState(false);
  const onSubmit = async (...args) => {
    setLoading(true);
    if (onSubStakeMerge) {
      await onSubStakeMerge(...args);
    }
    setLoading(false);
  };
  return <Formik onSubmit={onSubmit} initialValues={{ mergeIdValue: 0 }} validationSchema={validationSchema}>
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
            <Form.Label column md={{ span: 2, offset: 2 }} htmlFor="substake-merge-id">
              Merge with #
            </Form.Label>
            <Col md={4}>
              <Form.Control id="substake-merge-id" type="number" name="prolongMergeValue" onChange={handleChange} value={values.prolongDurationValue} />
              <div className="feedback-placeholder">
                <Form.Control.Feedback type="invalid" style={{ display: errors.mergeIdValue && touched.mergeIdValue ? 'inline' : 'none' }}>{errors.mergeIdValue}</Form.Control.Feedback>
              </div>
            </Col>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit"  disabled={!isValid}>Merge</Button>
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

export default MergeSubStake;
