import React, {useState} from 'react'
import {Formik} from 'formik'
import * as yup from 'yup';
import AuthService from '../../services/AuthService';
import {Alert, Container, Form, Button, Row, Col} from 'react-bootstrap'
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
    const [response, setResponse] = useState({ message: '', alertVariant: '' });

    const handlePasswordReset = async values => {
        try {
            const res = await AuthService.verifyPasswordReset(params.confirmationCode, {values}) 
            if(res.status === 'Success'){
              setResponse(({message: res.message, alertVariant: 'success'}));
            } else{
              setResponse(({message: res.message, alertVariant: 'danger'}));
            }
          } catch(error) {
            console.log(error)
          }
    }

    return (
        <Formik
        validationSchema={schema}
        onSubmit={handlePasswordReset}
        validateOnChange={false}
        validateOnBlur={true}
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
            
        <div>
            <Container className="d-flex vh-100 justify-content-center align-items-center">
                
                <Form noValidate onSubmit={handleSubmit}>
                    <h1>Enter new password</h1>
                    <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        name="password"
                        type="password"
                        placeholder="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.password}  
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control 
                        name="passwordConfirm"
                        type="password" 
                        placeholder="confirm password" 
                        value={values.passwordConfirm}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.passwordConfirm}  
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.passwordConfirm}
                    </Form.Control.Feedback>
                    </Form.Group>
                    {response.message && 
                    <Alert variant={response.alertVariant}>
                    {response.message}
                    </Alert>
                    }
                    <Button className="w-100" type="submit" disabled={isSubmitting}>
                        Reset password
                    </Button>
                </Form>
            </Container>
        </div>
      )}
    </Formik>
    )
}

export default ResetPasswordConfirmation;
