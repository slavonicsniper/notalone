import React, {useEffect, useState} from 'react'
import User from '../../services/User';
import {Form, Container, Button, Alert, Placeholder, Stack} from 'react-bootstrap'
import {Formik} from 'formik'
import * as yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const schema = yup.object().shape({
    city: yup.string()
        .matches(/^[A-Za-z]+$/, "Only English letters"),
    age: yup.string()
        .length(4, "Invalid year")
        .test("age", "Sorry but you are too old.", (age) => !age || age > 1942)
        .test("age", "Sorry but you are too young.", (age) => !age || age < new Date().getFullYear() - 15),
  });

export default function Profile(props) {
    const [message, setMessage] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await User.getProfile()
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            if(response.status === 'Success'){
                setUser(response.data)                
            }
            
        } catch(err) {
            console.log(err)
            setMessage({status: 'Failed', message: 'Something went wrong!'})
        }
    }

    const handleUpdate = async values => {
        try {
            const response = await User.updateProfile(values)
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            setMessage({status: response.status, message: response.message})
        } catch(err) {
            console.log(err)
            setMessage({status: 'Failed', message: 'Something went wrong!'})
        }
    }

    const handleDelete = async () => {
        try {
            const response = await User.deleteProfile()
            if(response.message === "Not authenticated") {
                props.handleLogin(false)
                window.localStorage.removeItem('data')
            }
            setMessage({status: response.status, message: response.message})
        } catch(err) {
            console.log(err)
            setMessage({status: 'Failed', message: 'Something went wrong!'})
        }
    }

    return (
        <Container>
            {message &&
            <Alert variant={message.status === "Failed" ? "danger" : "success"}>
                {message.message && message.message}
            </Alert>}
        {user ?
        <Formik
        validationSchema={schema}
        validateOnChange={false}
        onSubmit={handleUpdate}
        initialValues={{
            username: user.username,
            email: user.email,
            country: user.country,
            region: user.region,
            city: user.city,
            age: user.age,
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
                <Container className="d-flex justify-content-center mt-3">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formProfileUsername">
                          <Form.Label>Username</Form.Label>
                          <Form.Control value={values.username} readOnly/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProfileEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control value={values.email} readOnly/>
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
                                {user.age ?
                                <><Form.Label>Age</Form.Label>
                                <Form.Control type="number" placeholder="age" value={new Date().getFullYear() - user.age} readOnly/></>
                                :
                                <><Form.Label>Birthyear</Form.Label>
                                <Form.Control 
                                  name="age" 
                                  placeholder="birthyear"
                                  value={values.age}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  isInvalid={touched.age && errors.age}
                                  isValid={touched.age && !errors.age}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.age}
                                </Form.Control.Feedback></>}
                            </Form.Group>
                            <Stack direction="horizontal" gap={1} className="justify-content-center">      
                                <Button type="submit">
                                    Update
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Stack>
                    </Form>
                </Container>
            
        )}
        </Formik>
        :
        <Container className="d-flex justify-content-center mt-3">            
            <div className="w-25">
                {Array.from({ length: 6 }).map((_, idx) => 
                    <div key={idx}>
                    <Placeholder as="h6" animation='glow'><Placeholder xs={6}/></Placeholder>
                    <Placeholder as="h2" animation='glow'><Placeholder xs={12}/></Placeholder>
                    </div>
                )}
                <Placeholder.Button variant="primary" xs={6} />
            </div>            
        </Container>}       
        </Container>
    )
}