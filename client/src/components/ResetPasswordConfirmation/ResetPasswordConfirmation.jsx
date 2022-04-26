import React, {useState} from 'react'
import {Formik} from 'formik'
import * as yup from 'yup';
import AuthService from '../../services/AuthService';
import {Alert, Container, Form, Button} from 'react-bootstrap'
import { useParams } from "react-router-dom";

const schema = yup.object().shape({
    password: yup.string()
      .required()
      .min(6),
    passwordConfirm: yup.string()
      .required()
      .oneOf([yup.ref('password')], 'Passwords do not match')
  });

function ResetPasswordConfirmation() {
    let params = useParams();
    const [message, setMessage] = useState(null)

    const handlePasswordReset = async values => {
        try {
            const response = await AuthService.verifyPasswordReset(params.confirmationCode, values) 
            setMessage(response)
          } catch(error) {
            console.log(error)
            setMessage({status: 'Failed', message: 'Something went wrong!'})
          }
    }

    return (
        <Container>
            {message &&
            <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                {message.message && message.message}
            </Alert>
            }
            <Formik
            validationSchema={schema}
            onSubmit={handlePasswordReset}
            initialValues={{
                password: '',
                passwordConfirm: ''
            }}
            >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
                isSubmitting,
                dirty
            }
            ) => (            
                <Container className="d-flex vh-100 justify-content-center align-items-center">   
                    <Form noValidate onSubmit={handleSubmit} className="border bg-light bg-gradient rounded p-3">
                        <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
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
                        <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control 
                            name="passwordConfirm"
                            type="password" 
                            placeholder="confirm password" 
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
                        <Button className="w-100" type="submit" disabled={isSubmitting}>
                            Reset password
                        </Button>
                    </Form>
                </Container>
            )}
            </Formik>
        </Container>
    )
}

export default ResetPasswordConfirmation;
