import React from 'react'
import {Container, Stack} from 'react-bootstrap'
import AddAvailabilityForm from './AddAvailabilityForm';

export default function Availabilities() {
    return (
        <Container className="mt-3">
            <Stack gap={3}>
                <AddAvailabilityForm/>
            </Stack>
        </Container>        
    )
}