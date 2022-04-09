import React, {useEffect, useState} from 'react'
import User from '../../services/User';
import {Form, Container, Button} from 'react-bootstrap'

export default function Dashboard() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [age, setAge] = useState(0)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await User.getProfile()
            setUsername(response.data.username)
            setEmail(response.data.email)
            setCountry(response.data.country)
            setCity(response.data.city)
            setAge(response.data.age)
        } catch(err) {
            console.log(err)
        }
    }

    const handleUpdate = async e => {
        e.preventDefault();
        try {
            const response = await User.updateProfile({country, city, age})
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <Container className="d-flex justify-content-center">
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
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" placeholder="age" value={age} onChange={e => setAge(e.target.value)}/>
                </Form.Group>
                <Button type="submit">
                    Update
                </Button>
            </Form>
        </Container>
    )
}