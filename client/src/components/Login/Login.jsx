import React, {useState} from 'react'
import AuthService from '../../services/AuthService';
import {Alert, Container, Form, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {Formik} from 'formik'
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string()
    .required(),
  password: yup.string()
    .required()
});

function Login({handleLogin, handleData}) {
  const [message, setMessage] = useState(null)

  const handleSubmit = async values => {
    try {
        const response = await AuthService.login(values)
        if(response.status === 'Success'){
          handleData(response.data)
          handleLogin(true)
        } else {
          setMessage({status: response.status, message: response.message})
        }
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
      password: '',
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
        <div className="d-flex vh-100 justify-content-center align-items-center">
          <Form noValidate onSubmit={handleSubmit} className="border bg-light bg-gradient rounded p-3">
            <Form.Group className="mb-3" controlId="formLoginEmail">
              <Form.Label>User</Form.Label>
              <Form.Control 
                name="email" 
                placeholder="username or email" 
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRegisterPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
              name="password" 
              type="password" 
              placeholder="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.password && errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="w-100" type="submit" disabled={isSubmitting}>
                Login
            </Button>
            <Link className="d-block mt-3 btn btn-secondary" to="/reset-password">Reset password</Link>
            <Button className="w-100 mt-3" href={process.env.REACT_APP_API_URL + '/users/login/facebook'}>
              Login via Facebook
            </Button>
          </Form>        
        </div>
      </Container>
      )}
    </Formik>
  )
}

export default Login;
