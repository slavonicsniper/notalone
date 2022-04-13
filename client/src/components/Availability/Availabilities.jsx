import React from 'react'
import {Container, Stack} from 'react-bootstrap'
import AddAvailabilityForm from './AddAvailabilityForm';

export default function Availabilities() {
    return (
        <Container>
            <Stack gap={3}>
                <AddAvailabilityForm/>
            </Stack>
        </Container>        
    )
}