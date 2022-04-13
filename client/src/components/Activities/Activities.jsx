import React from 'react'
import {Container, Stack} from 'react-bootstrap'
import AddActivityForm from './AddActivityForm';

export default function Activities() {
    return (
        <Container>
            <Stack gap={3}>
                <AddActivityForm/>
            </Stack>
        </Container>        
    )
}