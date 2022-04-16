import React, {useState} from 'react'
import AuthService from '../../services/AuthService';
import {Alert, Container, Form, Button} from 'react-bootstrap'
import {Formik} from 'formik'
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string()
    .required()
    .email()
});

function ResetPassword() {
  const [message, setMessage] = useState(null)

  const handleSubmit = async values => {
    try {
      const response = await AuthService.initializePasswordReset(values) 
      setMessage(response)
    } catch(err) {
      console.log(err)
      setMessage({status: 'Failed', message: 'Something went wrong!'})
    }
  }

  return (
    <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
          email: '',
        }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        isSubmitting,
      }) => (
          <Container>
            {message &&
            <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                {message.message && message.message}
            </Alert>
            }
            <Container className="d-flex vh-100 justify-content-center align-items-center">   
              <Form onSubmit={handleSubmit} className="border bg-light bg-gradient rounded p-3">
                <Form.Group className="mb-3" controlId="formRegisterEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    name="email" 
                    placeholder="email" 
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                    isValid={touched.email && !errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button className="w-100" type="submit" disabled={isSubmitting}>
                    Reset password
                </Button>
              </Form>
            </Container>
          </Container>
      )}
      </Formik>
  )
}

export default ResetPassword;

