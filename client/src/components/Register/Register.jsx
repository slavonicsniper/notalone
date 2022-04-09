import React, {useState} from 'react'
import {Formik} from 'formik'
import * as yup from 'yup';

import AuthService from '../../services/AuthService';
import {Form, Button, Alert, Stack} from 'react-bootstrap'


const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string()
    .required()
    .email(),
  password: yup.string()
    .required()
    .min(6),
  passwordConfirm: yup.string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  city: yup.string().required(),
  country: yup.string().required(),
  age: yup.number()
    .required()
    .min(15)
    .max(120),
});

function Register() {

  const [registerMessage, setRegisterMessage] = useState('')

  const handleRegister = async values => {
    try {
      const response = await AuthService.register(values)
      setRegisterMessage(response.message)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleRegister}
      initialValues={{
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        country: '',
        city: '',
        age: 0,
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        handleReset,
        values,
        touched,
        isValid,
        errors,
        isSubmitting,
        dirty
      }) => (
        <Stack gap={3}>
          {registerMessage &&
            <Alert variant="success">
              {registerMessage + ' before you '}
              <Alert.Link href="/login">log in</Alert.Link>
            </Alert>
          }
          <div className="d-flex justify-content-center">
            <Form  noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formRegisterUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    name="username" 
                    placeholder="username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRegisterEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    name="email" 
                    placeholder="email" 
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
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
                  isInvalid={!!errors.password}                
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRegisterPasswordConfirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control 
                    name="passwordConfirm" 
                    type="password" 
                    placeholder="password confirmation"
                    value={values.passwordConfirm}
                    onChange={handleChange}
                    isInvalid={!!errors.passwordConfirm}                
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.passwordConfirm}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRegisterCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control 
                    name="country" 
                    placeholder="country"
                    value={values.country}
                    onChange={handleChange}
                    isInvalid={!!errors.country}                
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.country}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRegisterCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control 
                    name="city" 
                    placeholder="city"
                    value={values.city}
                    onChange={handleChange}
                    isInvalid={!!errors.city}                
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRegisterAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control 
                    name="age" 
                    type="number" 
                    placeholder="age"
                    value={values.age}
                    onChange={handleChange}
                    isInvalid={!!errors.age}                
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.age}
                  </Form.Control.Feedback>
                </Form.Group>
                <Stack direction="horizontal" gap={2} className="justify-content-center">
                  <Button onClick={handleReset} disabled={!dirty || isSubmitting}>
                    Reset
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                      Register
                  </Button>
                </Stack>
            </Form>
          </div>
        </Stack>
      )}
    </Formik>
  )

}

export default Register;