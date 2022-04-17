import React, {useState} from 'react'
import {Formik} from 'formik'
import * as yup from 'yup';
import AuthService from '../../services/AuthService';
import {Form, Button, Alert, Stack, Container} from 'react-bootstrap'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const schema = yup.object().shape({
  username: yup.string()
    .required()
    .test("username", "Already used", async (username) => {
      const response = await AuthService.checkAvailableUsernameOrEmail(`?column=username&value=${username}`)
      return response.status === "Success"
    }),
  email: yup.string()
    .required()
    .email()
    .test("email", "Already used", async (email) => {
      const response = await AuthService.checkAvailableUsernameOrEmail(`?column=email&value=${email}`)
      return response.status === "Success"
    }),
  password: yup.string()
    .required()
    .min(6),
  passwordConfirm: yup.string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  city: yup.string(),
  country: yup.string(),
  age: yup.number()
    .min(1942, "Sorry but you are too old.")
    .max(new Date().getFullYear() - 15, "Sorry but you are too young."),
});

function Register() {
  const [message, setMessage] = useState(null)

  const handleRegister = async values => {
    try {
      const response = await AuthService.register(values)
      setMessage(response)
    } catch(err) {
      console.log(err)
      setMessage({status: 'Failed', message: 'Something went wrong!'})
    }
  }

  return (
    
      <Formik
        validationSchema={schema}
        validateOnChange={false}
        onSubmit={handleRegister}
        initialValues={{
          username: '',
          email: '',
          password: '',
          passwordConfirm: '',
          country: '',
          region: '',
          city: '',
          age: '',
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          handleReset,
          values,
          touched,
          errors,
          isSubmitting,
          dirty
        }) => (
            <Container>
              {message &&
                <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                  {message.message && message.message}
                </Alert>
              }
              <div className="d-flex justify-content-center mt-3">
                <Form noValidate onSubmit={handleSubmit} className="border bg-light bg-gradient rounded p-3">
                    <Form.Group className="mb-3" controlId="formRegisterUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control 
                        name="username" 
                        placeholder="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.username && errors.username}
                        isValid={touched.username && !errors.username}
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
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                        isValid={touched.email && !errors.email}
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
                      isValid={touched.password && !errors.password}
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
                        onBlur={handleBlur}
                        isInvalid={touched.passwordConfirm && errors.passwordConfirm}
                        isValid={touched.passwordConfirm && !errors.passwordConfirm}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.passwordConfirm}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegisterCountry">
                      <Form.Label>Country</Form.Label>
                      <CountryDropdown 
                        aria-label="Default select example"
                        className="form-select"
                        name="country"
                        placeholder="country"
                        value={values.country} 
                        onChange={(_, e) => handleChange(e)} 
                        onBlur={handleBlur}                        
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegisterRegion">
                      <Form.Label>Region</Form.Label>
                      <RegionDropdown 
                        aria-label="Default select example"
                        className="form-select"
                        name="region"
                        placeholder="region"
                        country={values.country}
                        value={values.region} 
                        onChange={(_, e) => handleChange(e)} 
                        onBlur={handleBlur} 
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegisterCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control 
                        name="city" 
                        placeholder="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.city && errors.city}
                        isValid={touched.city && !errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegisterAge">
                      <Form.Label>Birthyear</Form.Label>
                      <Form.Control 
                        name="age" 
                        type="number" 
                        placeholder="birthyear"
                        value={values.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.age && errors.age}
                        isValid={touched.age && !errors.age}
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
            </Container>
        )}
      </Formik>
    
  )

}

export default Register;