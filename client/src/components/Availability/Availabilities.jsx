import React, {useEffect, useState} from 'react'
import {Container, Stack} from 'react-bootstrap'
import AddAvailabilityForm from './AddAvailabilityForm';
import Availability from '../../services/Availability';

export default function Availabilities() {
    return (
        <Container>
            <Stack gap={3}>
                <AddAvailabilityForm/>
            </Stack>
        </Container>        
    )
}