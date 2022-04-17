import React, {useEffect, useState} from 'react'
import User from '../../services/User';
import {Form, Container, Button, Alert} from 'react-bootstrap'

export default function Profile(props) {
    const [message, setMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('')
    const [region, setRegion] = useState('')
    const [city, setCity] = useState('')
    const [age, setAge] = useState(null)

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
                setUsername(response.data.username)
                setEmail(response.data.email)
                setCountry(response.data.country)
                setRegion(response.data.region)
                setCity(response.data.city)
                setAge(response.data.age)
            }
            
        } catch(err) {
            console.log(err)
            setMessage({status: 'Failed', message: 'Something went wrong!'})
        }
    }

    const handleUpdate = async e => {
        e.preventDefault();
        try {
            const response = await User.updateProfile({country, city, region, age})
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
            <Container className="d-flex justify-content-center mt-3">
                <Form onSubmit={handleUpdate}>
                    <Form.Group className="mb-3" controlId="formProfileUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control value={username} readOnly/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formProfileEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control value={email} readOnly/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formProfileCountry">
                      <Form.Label>Country</Form.Label>
                      <Form.Control placeholder="country" value={country} onChange={e => setCountry(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formProfileCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control placeholder="city" value={city} onChange={e => setCity(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formProfileAge">
                      
                      {age ?
                      <><Form.Label>Age</Form.Label>
                      <Form.Control type="number" placeholder="age" value={new Date().getFullYear() - age} onChange={e => setAge(e.target.value)} readOnly/></> :
                      <><Form.Label>Birthyear</Form.Label>
                      <Form.Control type="number" placeholder="birthyear" onChange={e => setAge(e.target.value)}/></>}
                    </Form.Group>
                    <Button type="submit">
                        Update
                    </Button>
                </Form>
            </Container>
        </Container>
    )
}